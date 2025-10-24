import { BaseEntity } from '../interfaces/repository.interface';
export type BucketType = 'emergency' | 'savings' | 'investment' | 'expense' | 'project' | 'other';
export type BucketStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export interface IBucket extends BaseEntity {
    name: string;
    description?: string;
    type: BucketType;
    status: BucketStatus;
    currentAmount: number;
    targetAmount: number;
    targetDate?: Date;
    priority: number;
    ownerId: string;
    autoFunding?: {
        enabled: boolean;
        percentage?: number;
        fixedAmount?: number;
        frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    };
    progress: {
        percentComplete: number;
        projectedCompletionDate?: Date;
        daysToTarget?: number;
        averageMonthlyContribution: number;
        monthsRemaining?: number;
    };
    tags?: string[];
    color?: string;
    icon?: string;
}
export declare class Bucket implements IBucket {
    id: string;
    name: string;
    description?: string;
    type: BucketType;
    status: BucketStatus;
    currentAmount: number;
    targetAmount: number;
    targetDate?: Date;
    priority: number;
    ownerId: string;
    autoFunding?: {
        enabled: boolean;
        percentage?: number;
        fixedAmount?: number;
        frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    };
    progress: {
        percentComplete: number;
        projectedCompletionDate?: Date;
        daysToTarget?: number;
        averageMonthlyContribution: number;
        monthsRemaining?: number;
    };
    tags?: string[];
    color?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Omit<IBucket, 'id' | 'createdAt' | 'updatedAt' | 'progress'>);
    private generateId;
    updateTimestamp(): void;
    addFunds(amount: number): void;
    removeFunds(amount: number): void;
    updateTarget(newTarget: number, newDate?: Date): void;
    private calculateProgress;
    isOnTrack(): boolean;
    getRequiredMonthlyContribution(): number;
    toJSON(): IBucket;
}
//# sourceMappingURL=bucket.model.d.ts.map