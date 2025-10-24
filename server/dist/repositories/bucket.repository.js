"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketRepository = void 0;
const memory_repository_1 = require("./memory.repository");
class BucketRepository extends memory_repository_1.InMemoryRepository {
    constructor() {
        super('buckets');
    }
    async findByOwner(ownerId) {
        return this.findBy({ ownerId });
    }
    async findByType(type) {
        return this.findBy({ type });
    }
    async findByStatus(status) {
        return this.findBy({ status });
    }
    async findByPriority(minPriority, maxPriority) {
        const allBuckets = await this.findAll();
        return allBuckets.filter(bucket => bucket.priority >= minPriority && bucket.priority <= maxPriority);
    }
    async findOverdueBuckets() {
        const allBuckets = await this.findAll();
        const today = new Date();
        return allBuckets.filter(bucket => bucket.targetDate &&
            bucket.targetDate < today &&
            bucket.currentAmount < bucket.targetAmount &&
            bucket.status === 'active');
    }
    async findUnderfundedBuckets() {
        const allBuckets = await this.findAll();
        return allBuckets.filter(bucket => {
            if (!bucket.targetDate || bucket.status !== 'active')
                return false;
            const today = new Date();
            const totalDays = Math.ceil((bucket.targetDate.getTime() - bucket.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const daysPassed = Math.ceil((today.getTime() - bucket.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const expectedProgress = (daysPassed / totalDays) * bucket.targetAmount;
            return bucket.currentAmount < expectedProgress;
        });
    }
    async findByTargetDateRange(startDate, endDate) {
        const allBuckets = await this.findAll();
        return allBuckets.filter(bucket => bucket.targetDate &&
            bucket.targetDate >= startDate &&
            bucket.targetDate <= endDate);
    }
    async getTotalCurrentAmount(ownerId) {
        const userBuckets = await this.findByOwner(ownerId);
        return userBuckets.reduce((total, bucket) => total + bucket.currentAmount, 0);
    }
    async getTotalTargetAmount(ownerId) {
        const userBuckets = await this.findByOwner(ownerId);
        return userBuckets.reduce((total, bucket) => total + bucket.targetAmount, 0);
    }
}
exports.BucketRepository = BucketRepository;
//# sourceMappingURL=bucket.repository.js.map