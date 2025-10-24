import { BaseEntity } from '../interfaces/repository.interface';
export type TransactionType = 'income' | 'expense' | 'transfer' | 'allocation';
export type TransactionCategory = 'salary' | 'rental_income' | 'investment' | 'business' | 'gift' | 'refund' | 'other_income' | 'rent' | 'utilities' | 'groceries' | 'entertainment' | 'transport' | 'healthcare' | 'insurance' | 'debt_payment' | 'other_expense';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed';
export interface ICashFlow extends BaseEntity {
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    status: TransactionStatus;
    transactionDate: Date;
    processedDate?: Date;
    referenceNumber?: string;
    bucketId?: string;
    sourceBucketId?: string;
    userId: string;
    externalAccountId?: string;
    recurring?: {
        enabled: boolean;
        frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
        nextDate?: Date;
        endDate?: Date;
        parentTransactionId?: string;
    };
    tags?: string[];
    notes?: string;
}
export declare class CashFlow implements ICashFlow {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    status: TransactionStatus;
    transactionDate: Date;
    processedDate?: Date;
    referenceNumber?: string;
    bucketId?: string;
    sourceBucketId?: string;
    userId: string;
    externalAccountId?: string;
    recurring?: {
        enabled: boolean;
        frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
        nextDate?: Date;
        endDate?: Date;
        parentTransactionId?: string;
    };
    tags?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Omit<ICashFlow, 'id' | 'createdAt' | 'updatedAt'>);
    private generateId;
    updateTimestamp(): void;
    markCompleted(): void;
    markCancelled(): void;
    markFailed(): void;
    isIncome(): boolean;
    isExpense(): boolean;
    isTransfer(): boolean;
    isAllocation(): boolean;
    getEffectiveAmount(): number;
    toJSON(): ICashFlow;
}
//# sourceMappingURL=cashflow.model.d.ts.map