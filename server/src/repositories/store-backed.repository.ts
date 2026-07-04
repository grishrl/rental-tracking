import { BaseEntity, IRepository } from '../interfaces/repository.interface';
import { IModelStore } from '../interfaces/store.interface';

export abstract class StoreBackedRepository<T extends BaseEntity> implements IRepository<T> {
  constructor(protected readonly store: IModelStore<T>) {}

  async findAll(): Promise<T[]> {
    return this.store.getAll();
  }

  async findById(id: string): Promise<T | null> {
    return this.store.getById(id);
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.store.create(entity);
  }

  async update(
    id: string,
    entity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T | null> {
    return this.store.update(id, entity);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async findBy(criteria: Partial<T>): Promise<T[]> {
    return this.store.findBy(criteria);
  }
}
