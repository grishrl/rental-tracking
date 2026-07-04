"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFileModelStore = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
class BaseFileModelStore {
    constructor(filePath) {
        this.filePath = filePath;
        this.initialized = false;
        this.writeQueue = Promise.resolve();
    }
    async initialize() {
        if (this.initialized) {
            return;
        }
        await fs_1.promises.mkdir(path_1.default.dirname(this.filePath), { recursive: true });
        try {
            await fs_1.promises.access(this.filePath);
        }
        catch {
            await fs_1.promises.writeFile(this.filePath, '[]\n', 'utf8');
        }
        this.initialized = true;
    }
    async close() {
        await this.writeQueue;
    }
    async getAll() {
        return this.readRecords();
    }
    async getById(id) {
        const records = await this.readRecords();
        return records.find((record) => record.id === id) ?? null;
    }
    async findBy(criteria) {
        const records = await this.readRecords();
        return records.filter((record) => this.matchesCriteria(record, criteria));
    }
    async exists(id) {
        return (await this.getById(id)) !== null;
    }
    async create(input) {
        const now = new Date();
        const entity = {
            ...input,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now,
        };
        await this.enqueueWrite(async () => {
            const records = await this.readRecordsDirect();
            records.push(entity);
            await this.writeRecordsDirect(records);
        });
        return entity;
    }
    async createMany(inputs) {
        const now = new Date();
        const entities = inputs.map((input) => ({
            ...input,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now,
        }));
        await this.enqueueWrite(async () => {
            const records = await this.readRecordsDirect();
            records.push(...entities);
            await this.writeRecordsDirect(records);
        });
        return entities;
    }
    async update(id, input) {
        let updatedRecord = null;
        await this.enqueueWrite(async () => {
            const records = await this.readRecordsDirect();
            const index = records.findIndex((record) => record.id === id);
            if (index < 0) {
                return;
            }
            const nextRecord = {
                ...records[index],
                ...input,
                id,
                updatedAt: new Date(),
            };
            records[index] = nextRecord;
            updatedRecord = nextRecord;
            await this.writeRecordsDirect(records);
        });
        return updatedRecord;
    }
    async delete(id) {
        let deleted = false;
        await this.enqueueWrite(async () => {
            const records = await this.readRecordsDirect();
            const filtered = records.filter((record) => record.id !== id);
            if (filtered.length === records.length) {
                return;
            }
            deleted = true;
            await this.writeRecordsDirect(filtered);
        });
        return deleted;
    }
    async deleteMany(ids) {
        let deletedCount = 0;
        const idSet = new Set(ids);
        await this.enqueueWrite(async () => {
            const records = await this.readRecordsDirect();
            const filtered = records.filter((record) => !idSet.has(record.id));
            deletedCount = records.length - filtered.length;
            if (deletedCount > 0) {
                await this.writeRecordsDirect(filtered);
            }
        });
        return deletedCount;
    }
    async replaceAll(records) {
        await this.enqueueWrite(async () => {
            await this.writeRecordsDirect(records);
        });
    }
    resolvePath() {
        return this.filePath;
    }
    generateId() {
        return (0, crypto_1.randomUUID)();
    }
    async enqueueWrite(operation) {
        const run = this.writeQueue.then(operation, operation);
        this.writeQueue = run
            .then(() => undefined)
            .catch(() => undefined);
        return run;
    }
    async readRecords() {
        await this.initialize();
        await this.writeQueue;
        return this.readRecordsDirect();
    }
    async readRecordsDirect() {
        await this.initialize();
        const rawText = await fs_1.promises.readFile(this.filePath, 'utf8');
        const parsed = JSON.parse(rawText);
        if (!Array.isArray(parsed)) {
            throw new Error(`Expected an array in ${this.filePath}`);
        }
        return this.revive(parsed);
    }
    async writeRecordsDirect(records) {
        await this.initialize();
        const serialized = this.serialize(records);
        const payload = `${JSON.stringify(serialized, null, 2)}\n`;
        const tempPath = `${this.filePath}.tmp`;
        await fs_1.promises.writeFile(tempPath, payload, 'utf8');
        await fs_1.promises.rename(tempPath, this.filePath);
    }
    matchesCriteria(record, criteria) {
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
            return criteria.every((criterion) => record.some((item) => this.areValuesEqual(item, criterion)));
        }
        if (typeof record !== 'object' || record === null || Array.isArray(record)) {
            return false;
        }
        return Object.entries(criteria).every(([key, value]) => this.matchesCriteria(record[key], value));
    }
    areValuesEqual(left, right) {
        if (left instanceof Date && right instanceof Date) {
            return left.getTime() === right.getTime();
        }
        return left === right;
    }
    serialize(value) {
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
    revive(value) {
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
exports.BaseFileModelStore = BaseFileModelStore;
//# sourceMappingURL=base-file-model.store.js.map