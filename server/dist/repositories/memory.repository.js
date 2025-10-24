"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRepository = void 0;
const base_repository_1 = require("./base.repository");
// In-memory repository implementation for development/testing
class InMemoryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.data = new Map();
    }
    async findAll(options) {
        let results = Array.from(this.data.values());
        if (options?.filter) {
            results = results.filter(item => this.matchesCriteria(item, options.filter));
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
    async findById(id) {
        return this.data.get(id) || null;
    }
    async create(entity) {
        const newEntity = this.addTimestamps(entity);
        this.data.set(newEntity.id, newEntity);
        return newEntity;
    }
    async update(id, updates) {
        const existing = this.data.get(id);
        if (!existing) {
            return null;
        }
        const updated = {
            ...existing,
            ...updates,
            updatedAt: new Date(),
        };
        this.data.set(id, updated);
        return updated;
    }
    async delete(id) {
        return this.data.delete(id);
    }
    async findBy(criteria, options) {
        let results = Array.from(this.data.values()).filter(item => this.matchesCriteria(item, criteria));
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
    matchesCriteria(item, criteria) {
        return Object.entries(criteria).every(([key, value]) => {
            const itemValue = item[key];
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
    applySorting(results, sort) {
        return results.sort((a, b) => {
            for (const [field, direction] of Object.entries(sort)) {
                const aValue = a[field];
                const bValue = b[field];
                let comparison = 0;
                if (aValue < bValue)
                    comparison = -1;
                else if (aValue > bValue)
                    comparison = 1;
                if (comparison !== 0) {
                    return direction === 1 ? comparison : -comparison;
                }
            }
            return 0;
        });
    }
    // Helper method to seed data for testing
    async seed(entities) {
        entities.forEach(entity => {
            this.data.set(entity.id, entity);
        });
    }
    // Helper method to clear all data
    async clear() {
        this.data.clear();
    }
}
exports.InMemoryRepository = InMemoryRepository;
//# sourceMappingURL=memory.repository.js.map