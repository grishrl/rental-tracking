import { BaseEntity, QueryOptions } from '../interfaces/repository.interface';
import { BaseRepository } from './base.repository';
export declare class PostgreSQLRepository<T extends BaseEntity> extends BaseRepository<T> {
    private connectionString;
    constructor(tableName: string, connectionString: string);
    findAll(options?: QueryOptions): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findBy(criteria: Partial<T>, options?: QueryOptions): Promise<T[]>;
}
//# sourceMappingURL=postgresql.repository.d.ts.map