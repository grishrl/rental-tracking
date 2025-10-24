import { BaseEntity, QueryOptions } from '../interfaces/repository.interface';
import { BaseRepository } from './base.repository';

// In-memory repository implementation for development/testing
export class InMemoryRepository<T extends BaseEntity> extends BaseRepository<T> {
  protected data: Map<string, T> = new Map();

  async findAll(options?: QueryOptions): Promise<T[]> {
    let results = Array.from(this.data.values());

    if (options?.filter) {
      results = results.filter(item => this.matchesCriteria(item, options.filter as Partial<T>));
    }

    if (options?.sort) {
      results = this.applySorting(results, options.sort);
    }

    if (options?.offset) {
      results = results.slice(options.offset);
    }

    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async findById(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const newEntity = this.addTimestamps<T>(entity);
    this.data.set(newEntity.id, newEntity);
    return newEntity;
  }

  async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null> {
    const existing = this.data.get(id);
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    } as T;

    this.data.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  async findBy(criteria: Partial<T>, options?: QueryOptions): Promise<T[]> {
    let results = Array.from(this.data.values()).filter(item => 
      this.matchesCriteria(item, criteria)
    );

    if (options?.sort) {
      results = this.applySorting(results, options.sort);
    }

    if (options?.offset) {
      results = results.slice(options.offset);
    }

    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  private matchesCriteria(item: T, criteria: Partial<T>): boolean {
    return Object.entries(criteria).every(([key, value]) => {
      const itemValue = (item as any)[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Handle nested object matching
        return this.matchesCriteria(itemValue, value);
      }
      
      if (Array.isArray(value)) {
        // Handle array matching
        return Array.isArray(itemValue) && 
               value.every(v => itemValue.includes(v));
      }
      
      return itemValue === value;
    });
  }

  private applySorting(results: T[], sort: Record<string, 1 | -1>): T[] {
    return results.sort((a, b) => {
      for (const [field, direction] of Object.entries(sort)) {
        const aValue = (a as any)[field];
        const bValue = (b as any)[field];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        if (comparison !== 0) {
          return direction === 1 ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  // Helper method to seed data for testing
  async seed(entities: T[]): Promise<void> {
    entities.forEach(entity => {
      this.data.set(entity.id, entity);
    });
  }

  // Helper method to clear all data
  async clear(): Promise<void> {
    this.data.clear();
  }
}