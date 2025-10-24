import { IRepository } from '../interfaces/repository.interface';
import { IBucket, BucketType, BucketStatus } from '../models/bucket.model';

export interface IBucketRepository extends IRepository<IBucket> {
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