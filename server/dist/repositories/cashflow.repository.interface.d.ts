import { IRepository } from '../interfaces/repository.interface';
import { ICashFlow, TransactionType, TransactionCategory, TransactionStatus } from '../models/cashflow.model';
export interface ICashFlowRepository extends IRepository<ICashFlow> {
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
//# sourceMappingURL=cashflow.repository.interface.d.ts.map