import { BaseEntity } from './repository.interface';
export type CreateModelInput<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateModelInput<T extends BaseEntity> = Partial<CreateModelInput<T>>;
export interface IReadStore<T extends BaseEntity> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    findBy(criteria: Partial<T>): Promise<T[]>;
    exists(id: string): Promise<boolean>;
}
export interface IWriteStore<T extends BaseEntity> {
    create(input: CreateModelInput<T>): Promise<T>;
    createMany(inputs: CreateModelInput<T>[]): Promise<T[]>;
    update(id: string, input: UpdateModelInput<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    deleteMany(ids: string[]): Promise<number>;
    replaceAll(records: T[]): Promise<void>;
}
export interface IModelStore<T extends BaseEntity> extends IReadStore<T>, IWriteStore<T> {
}
export interface IStoreLifecycle {
    initialize(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=store.interface.d.ts.map