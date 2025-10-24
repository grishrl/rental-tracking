import { ICashFlow, TransactionType, TransactionCategory, TransactionStatus } from '../models/cashflow.model';
import { InMemoryRepository } from './memory.repository';
import { ICashFlowRepository } from './cashflow.repository.interface';
export declare class CashFlowRepository extends InMemoryRepository<ICashFlow> implements ICashFlowRepository {
    constructor();
    private getEffectiveAmount;
    findByUser(userId: string): Promise<ICashFlow[]>;
    findByBucket(bucketId: string): Promise<ICashFlow[]>;
    findByType(type: TransactionType): Promise<ICashFlow[]>;
    findByCategory(category: TransactionCategory): Promise<ICashFlow[]>;
    findByStatus(status: TransactionStatus): Promise<ICashFlow[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<ICashFlow[]>;
    findRecurringTransactions(): Promise<ICashFlow[]>;
    findPendingTransactions(): Promise<ICashFlow[]>;
    getTotalIncomeByPeriod(userId: string, startDate: Date, endDate: Date): Promise<number>;
    getTotalExpensesByPeriod(userId: string, startDate: Date, endDate: Date): Promise<number>;
    getNetCashFlowByPeriod(userId: string, startDate: Date, endDate: Date): Promise<number>;
    getCashFlowByCategory(userId: string, startDate: Date, endDate: Date): Promise<{
        category: TransactionCategory;
        total: number;
    }[]>;
    getCashFlowByBucket(userId: string, startDate: Date, endDate: Date): Promise<{
        bucketId: string;
        total: number;
    }[]>;
    getBucketTransactions(bucketId: string, startDate?: Date, endDate?: Date): Promise<ICashFlow[]>;
    getBucketBalance(bucketId: string): Promise<number>;
}
//# sourceMappingURL=cashflow.repository.d.ts.map