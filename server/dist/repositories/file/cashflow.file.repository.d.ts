import { ICashFlow, TransactionCategory, TransactionStatus, TransactionType } from '../../models/cashflow.model';
import { IModelStore } from '../../interfaces/store.interface';
import { StoreBackedRepository } from '../store-backed.repository';
import { ICashFlowRepository } from '../cashflow.repository.interface';
export declare class CashFlowFileRepository extends StoreBackedRepository<ICashFlow> implements ICashFlowRepository {
    constructor(store: IModelStore<ICashFlow>);
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
//# sourceMappingURL=cashflow.file.repository.d.ts.map