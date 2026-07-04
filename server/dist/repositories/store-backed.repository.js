"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreBackedRepository = void 0;
class StoreBackedRepository {
    constructor(store) {
        this.store = store;
    }
    async findAll() {
        return this.store.getAll();
    }
    async findById(id) {
        return this.store.getById(id);
    }
    async create(entity) {
        return this.store.create(entity);
    }
    async update(id, entity) {
        return this.store.update(id, entity);
    }
    async delete(id) {
        return this.store.delete(id);
    }
    async findBy(criteria) {
        return this.store.findBy(criteria);
    }
}
exports.StoreBackedRepository = StoreBackedRepository;
//# sourceMappingURL=store-backed.repository.js.map