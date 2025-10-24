import { BaseEntity, IRepository, QueryOptions } from '../interfaces/repository.interface';
export declare abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
    protected tableName: string;
    constructor(tableName: string);
    abstract findAll(options?: QueryOptions): Promise<T[]>;
    abstract findById(id: string): Promise<T | null>;
    abstract create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    abstract update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
    abstract delete(id: string): Promise<boolean>;
    abstract findBy(criteria: Partial<T>, options?: QueryOptions): Promise<T[]>;
    protected generateId(): string;
    protected addTimestamps<K>(entity: Omit<K, 'id' | 'createdAt' | 'updatedAt'>): K & BaseEntity;
    protected updateTimestamp<K extends BaseEntity>(entity: K): K;
}
//# sourceMappingURL=base.repository.d.ts.map