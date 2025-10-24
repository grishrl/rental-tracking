import { IBucket, BucketType, BucketStatus } from '../models/bucket.model';
import { InMemoryRepository } from './memory.repository';
import { IBucketRepository } from './bucket.repository.interface';

export class BucketRepository extends InMemoryRepository<IBucket> implements IBucketRepository {
  constructor() {
    super('buckets');
  }

  async findByOwner(ownerId: string): Promise<IBucket[]> {
    return this.findBy({ ownerId } as Partial<IBucket>);
  }

  async findByType(type: BucketType): Promise<IBucket[]> {
    return this.findBy({ type } as Partial<IBucket>);
  }

  async findByStatus(status: BucketStatus): Promise<IBucket[]> {
    return this.findBy({ status } as Partial<IBucket>);
  }

  async findByPriority(minPriority: number, maxPriority: number): Promise<IBucket[]> {
    const allBuckets = await this.findAll();
    return allBuckets.filter(bucket => 
      bucket.priority >= minPriority && bucket.priority <= maxPriority
    );
  }

  async findOverdueBuckets(): Promise<IBucket[]> {
    const allBuckets = await this.findAll();
    const today = new Date();
    
    return allBuckets.filter(bucket => 
      bucket.targetDate && 
      bucket.targetDate < today && 
      bucket.currentAmount < bucket.targetAmount &&
      bucket.status === 'active'
    );
  }

  async findUnderfundedBuckets(): Promise<IBucket[]> {
    const allBuckets = await this.findAll();
    
    return allBuckets.filter(bucket => {
      if (!bucket.targetDate || bucket.status !== 'active') return false;
      
      const today = new Date();
      const totalDays = Math.ceil((bucket.targetDate.getTime() - bucket.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const daysPassed = Math.ceil((today.getTime() - bucket.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const expectedProgress = (daysPassed / totalDays) * bucket.targetAmount;
      
      return bucket.currentAmount < expectedProgress;
    });
  }

  async findByTargetDateRange(startDate: Date, endDate: Date): Promise<IBucket[]> {
    const allBuckets = await this.findAll();
    
    return allBuckets.filter(bucket => 
      bucket.targetDate &&
      bucket.targetDate >= startDate &&
      bucket.targetDate <= endDate
    );
  }

  async getTotalCurrentAmount(ownerId: string): Promise<number> {
    const userBuckets = await this.findByOwner(ownerId);
    return userBuckets.reduce((total, bucket) => total + bucket.currentAmount, 0);
  }

  async getTotalTargetAmount(ownerId: string): Promise<number> {
    const userBuckets = await this.findByOwner(ownerId);
    return userBuckets.reduce((total, bucket) => total + bucket.targetAmount, 0);
  }
}