import { IBucket, BucketType, BucketStatus } from '../models/bucket.model';
import { InMemoryRepository } from './memory.repository';
import { IBucketRepository } from './bucket.repository.interface';
export declare class BucketRepository extends InMemoryRepository<IBucket> implements IBucketRepository {
    constructor();
    findByOwner(ownerId: string): Promise<IBucket[]>;
    findByType(type: BucketType): Promise<IBucket[]>;
    findByStatus(status: BucketStatus): Promise<IBucket[]>;
    findByPriority(minPriority: number, maxPriority: number): Promise<IBucket[]>;
    findOverdueBuckets(): Promise<IBucket[]>;
    findUnderfundedBuckets(): Promise<IBucket[]>;
    findByTargetDateRange(startDate: Date, endDate: Date): Promise<IBucket[]>;
    getTotalCurrentAmount(ownerId: string): Promise<number>;
    getTotalTargetAmount(ownerId: string): Promise<number>;
}
//# sourceMappingURL=bucket.repository.d.ts.map