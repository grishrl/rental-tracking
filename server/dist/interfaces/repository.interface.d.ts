export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IRepository<T extends BaseEntity> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findBy(criteria: Partial<T>): Promise<T[]>;
}
export interface QueryOptions {
    filter?: Record<string, any>;
    sort?: Record<string, 1 | -1>;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=repository.interface.d.ts.map