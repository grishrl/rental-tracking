import { BaseEntity, IRepository, QueryOptions } from '../interfaces/repository.interface';

// Abstract base repository that can be extended for different database implementations
export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  abstract findAll(options?: QueryOptions): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  abstract update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findBy(criteria: Partial<T>, options?: QueryOptions): Promise<T[]>;

  // Helper method to generate IDs (can be overridden for different ID strategies)
  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Helper method to add timestamps
  protected addTimestamps<K>(entity: Omit<K, 'id' | 'createdAt' | 'updatedAt'>): K & BaseEntity {
    const now = new Date();
    return {
      ...entity,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as K & BaseEntity;
  }

  // Helper method to update timestamps
  protected updateTimestamp<K extends BaseEntity>(entity: K): K {
    return {
      ...entity,
      updatedAt: new Date(),
    };
  }
}