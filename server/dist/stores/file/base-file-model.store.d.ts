import { BaseEntity } from '../../interfaces/repository.interface';
import { CreateModelInput, IModelStore, IStoreLifecycle, UpdateModelInput } from '../../interfaces/store.interface';
export declare abstract class BaseFileModelStore<T extends BaseEntity> implements IModelStore<T>, IStoreLifecycle {
    private readonly filePath;
    private initialized;
    private writeQueue;
    constructor(filePath: string);
    initialize(): Promise<void>;
    close(): Promise<void>;
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    findBy(criteria: Partial<T>): Promise<T[]>;
    exists(id: string): Promise<boolean>;
    create(input: CreateModelInput<T>): Promise<T>;
    createMany(inputs: CreateModelInput<T>[]): Promise<T[]>;
    update(id: string, input: UpdateModelInput<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    deleteMany(ids: string[]): Promise<number>;
    replaceAll(records: T[]): Promise<void>;
    protected resolvePath(): string;
    protected generateId(): string;
    private enqueueWrite;
    private readRecords;
    private readRecordsDirect;
    private writeRecordsDirect;
    private matchesCriteria;
    private areValuesEqual;
    private serialize;
    private revive;
}
//# sourceMappingURL=base-file-model.store.d.ts.map