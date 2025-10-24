import { IBucket, BucketType, BucketStatus } from '../models/bucket.model';
import { IBucketRepository } from '../repositories/bucket.repository.interface';
import { ICashFlowRepository } from '../repositories/cashflow.repository.interface';
export interface BucketSummary {
    totalBuckets: number;
    activeBuckets: number;
    totalCurrentAmount: number;
    totalTargetAmount: number;
    overallProgress: number;
    overdueBuckets: number;
    underfundedBuckets: number;
}
export interface AllocationSuggestion {
    bucketId: string;
    bucketName: string;
    suggestedAmount: number;
    priority: number;
    reason: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
}
export declare class BucketService {
    private bucketRepository;
    private cashFlowRepository;
    constructor(bucketRepository: IBucketRepository, cashFlowRepository: ICashFlowRepository);
    createBucket(bucketData: Omit<IBucket, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): Promise<IBucket>;
    updateBucket(id: string, updates: Partial<Omit<IBucket, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IBucket | null>;
    deleteBucket(id: string): Promise<boolean>;
    getBucketById(id: string): Promise<IBucket | null>;
    getUserBuckets(userId: string): Promise<IBucket[]>;
    getBucketsByType(type: BucketType): Promise<IBucket[]>;
    getBucketsByStatus(status: BucketStatus): Promise<IBucket[]>;
    addFundsToBucket(bucketId: string, amount: number, transactionDescription?: string): Promise<IBucket>;
    removeFundsFromBucket(bucketId: string, amount: number, transactionDescription?: string): Promise<IBucket>;
    transferFunds(fromBucketId: string, toBucketId: string, amount: number): Promise<{
        fromBucket: IBucket;
        toBucket: IBucket;
    }>;
    getBucketSummary(userId: string): Promise<BucketSummary>;
    getAllocationSuggestions(userId: string, availableAmount: number): Promise<AllocationSuggestion[]>;
    private validateBucketData;
}
//# sourceMappingURL=bucket.service.d.ts.map