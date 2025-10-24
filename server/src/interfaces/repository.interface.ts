// Base entity interface that all models should extend
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generic repository interface for database operations
export interface IRepository<T extends BaseEntity> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findBy(criteria: Partial<T>): Promise<T[]>;
}

// Query options for filtering, sorting, and pagination
export interface QueryOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  offset?: number;
}