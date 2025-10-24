import { BaseEntity, QueryOptions } from '../interfaces/repository.interface';
import { BaseRepository } from './base.repository';
export declare class InMemoryRepository<T extends BaseEntity> extends BaseRepository<T> {
    protected data: Map<string, T>;
    findAll(options?: QueryOptions): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findBy(criteria: Partial<T>, options?: QueryOptions): Promise<T[]>;
    private matchesCriteria;
    private applySorting;
    seed(entities: T[]): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=memory.repository.d.ts.map