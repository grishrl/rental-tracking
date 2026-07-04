import { IBucket, BucketType, BucketStatus } from '../../models/bucket.model';
import { IModelStore } from '../../interfaces/store.interface';
import { StoreBackedRepository } from '../store-backed.repository';
import { IBucketRepository } from '../bucket.repository.interface';
export declare class BucketFileRepository extends StoreBackedRepository<IBucket> implements IBucketRepository {
    constructor(store: IModelStore<IBucket>);
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
//# sourceMappingURL=bucket.file.repository.d.ts.map