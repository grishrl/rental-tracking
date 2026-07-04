import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { BaseEntity } from '../../interfaces/repository.interface';
import {
  CreateModelInput,
  IModelStore,
  IStoreLifecycle,
  UpdateModelInput,
} from '../../interfaces/store.interface';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export abstract class BaseFileModelStore<T extends BaseEntity>
  implements IModelStore<T>, IStoreLifecycle
{
  private initialized = false;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await fs.mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, '[]\n', 'utf8');
    }

    this.initialized = true;
  }

  async close(): Promise<void> {
    await this.writeQueue;
  }

  async getAll(): Promise<T[]> {
    return this.readRecords();
  }

  async getById(id: string): Promise<T | null> {
    const records = await this.readRecords();
    return records.find((record) => record.id === id) ?? null;
  }

  async findBy(criteria: Partial<T>): Promise<T[]> {
    const records = await this.readRecords();
    return records.filter((record) => this.matchesCriteria(record, criteria));
  }

  async exists(id: string): Promise<boolean> {
    return (await this.getById(id)) !== null;
  }

  async create(input: CreateModelInput<T>): Promise<T> {
    const now = new Date();
    const entity: T = {
      ...(input as T),
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };

    await this.enqueueWrite(async () => {
      const records = await this.readRecords();
      records.push(entity);
      await this.writeRecordsDirect(records);
    });

    return entity;
  }

  async createMany(inputs: CreateModelInput<T>[]): Promise<T[]> {
    const now = new Date();
    const entities = inputs.map((input) => ({
      ...(input as T),
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }));

    await this.enqueueWrite(async () => {
      const records = await this.readRecords();
      records.push(...entities);
      await this.writeRecordsDirect(records);
    });

    return entities;
  }

  async update(id: string, input: UpdateModelInput<T>): Promise<T | null> {
    let updatedRecord: T | null = null;

    await this.enqueueWrite(async () => {
      const records = await this.readRecords();
      const index = records.findIndex((record) => record.id === id);

      if (index < 0) {
        return;
      }

      const nextRecord: T = {
        ...records[index],
        ...(input as T),
        id,
        updatedAt: new Date(),
      };

      records[index] = nextRecord;
      updatedRecord = nextRecord;
      await this.writeRecordsDirect(records);
    });

    return updatedRecord;
  }

  async delete(id: string): Promise<boolean> {
    let deleted = false;

    await this.enqueueWrite(async () => {
      const records = await this.readRecords();
      const filtered = records.filter((record) => record.id !== id);

      if (filtered.length === records.length) {
        return;
      }

      deleted = true;
      await this.writeRecordsDirect(filtered);
    });

    return deleted;
  }

  async deleteMany(ids: string[]): Promise<number> {
    let deletedCount = 0;
    const idSet = new Set(ids);

    await this.enqueueWrite(async () => {
      const records = await this.readRecords();
      const filtered = records.filter((record) => !idSet.has(record.id));
      deletedCount = records.length - filtered.length;

      if (deletedCount > 0) {
        await this.writeRecordsDirect(filtered);
      }
    });

    return deletedCount;
  }

  async replaceAll(records: T[]): Promise<void> {
    await this.enqueueWrite(async () => {
      await this.writeRecordsDirect(records);
    });
  }

  protected resolvePath(): string {
    return this.filePath;
  }

  protected generateId(): string {
    return randomUUID();
  }

  private async enqueueWrite<R>(operation: () => Promise<R>): Promise<R> {
    const run = this.writeQueue.then(operation, operation);

    this.writeQueue = run
      .then(() => undefined)
      .catch(() => undefined);

    return run;
  }

  private async readRecords(): Promise<T[]> {
    await this.initialize();
    await this.writeQueue;

    const rawText = await fs.readFile(this.filePath, 'utf8');
    const parsed = JSON.parse(rawText);

    if (!Array.isArray(parsed)) {
      throw new Error(`Expected an array in ${this.filePath}`);
    }

    return this.revive(parsed) as T[];
  }

  private async writeRecordsDirect(records: T[]): Promise<void> {
    await this.initialize();

    const serialized = this.serialize(records);
    const payload = `${JSON.stringify(serialized, null, 2)}\n`;
    const tempPath = `${this.filePath}.tmp`;

    await fs.writeFile(tempPath, payload, 'utf8');
    await fs.rename(tempPath, this.filePath);
  }

  private matchesCriteria(record: unknown, criteria: unknown): boolean {
    if (criteria === null || criteria === undefined) {
      return true;
    }

    if (typeof criteria !== 'object' || criteria instanceof Date) {
      return this.areValuesEqual(record, criteria);
    }

    if (Array.isArray(criteria)) {
      if (!Array.isArray(record)) {
        return false;
      }

      return criteria.every((criterion) =>
        record.some((item) => this.areValuesEqual(item, criterion))
      );
    }

    if (typeof record !== 'object' || record === null || Array.isArray(record)) {
      return false;
    }

    return Object.entries(criteria).every(([key, value]) =>
      this.matchesCriteria((record as Record<string, unknown>)[key], value)
    );
  }

  private areValuesEqual(left: unknown, right: unknown): boolean {
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() === right.getTime();
    }

    return left === right;
  }

  private serialize(value: unknown): unknown {
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((entry) => this.serialize(entry));
    }

    if (value && typeof value === 'object') {
      const serializedEntries = Object.entries(value).map(([key, entry]) => [
        key,
        this.serialize(entry),
      ]);
      return Object.fromEntries(serializedEntries);
    }

    return value;
  }

  private revive(value: unknown): unknown {
    if (typeof value === 'string' && ISO_DATE_PATTERN.test(value)) {
      return new Date(value);
    }

    if (Array.isArray(value)) {
      return value.map((entry) => this.revive(entry));
    }

    if (value && typeof value === 'object') {
      const revivedEntries = Object.entries(value).map(([key, entry]) => [
        key,
        this.revive(entry),
      ]);
      return Object.fromEntries(revivedEntries);
    }

    return value;
  }
}
