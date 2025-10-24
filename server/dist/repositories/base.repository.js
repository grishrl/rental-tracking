"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
// Abstract base repository that can be extended for different database implementations
class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }
    // Helper method to generate IDs (can be overridden for different ID strategies)
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    // Helper method to add timestamps
    addTimestamps(entity) {
        const now = new Date();
        return {
            ...entity,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now,
        };
    }
    // Helper method to update timestamps
    updateTimestamp(entity) {
        return {
            ...entity,
            updatedAt: new Date(),
        };
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map