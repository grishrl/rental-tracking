import { BaseEntity, IRepository } from '../interfaces/repository.interface';
import { IModelStore } from '../interfaces/store.interface';
export declare abstract class StoreBackedRepository<T extends BaseEntity> implements IRepository<T> {
    protected readonly store: IModelStore<T>;
    constructor(store: IModelStore<T>);
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findBy(criteria: Partial<T>): Promise<T[]>;
}
//# sourceMappingURL=store-backed.repository.d.ts.map