import { ICashFlow, ITransactionAttachment, TransactionCategory } from '../models/cashflow.model';
import { ICashFlowRepository } from '../repositories/cashflow.repository.interface';
import { IBucketRepository } from '../repositories/bucket.repository.interface';
export interface CashFlowSummary {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    pendingTransactions: number;
    recurringTransactions: number;
}
export interface BudgetAnalysis {
    categoryBreakdown: {
        category: TransactionCategory;
        amount: number;
        percentage: number;
    }[];
    bucketBreakdown: {
        bucketId: string;
        bucketName?: string;
        amount: number;
        percentage: number;
    }[];
    monthlyAverage: number;
    projectedMonthly: number;
}
export declare class CashFlowService {
    private cashFlowRepository;
    private bucketRepository;
    constructor(cashFlowRepository: ICashFlowRepository, bucketRepository: IBucketRepository);
    createTransaction(transactionData: Omit<ICashFlow, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICashFlow>;
    updateTransaction(id: string, updates: Partial<Omit<ICashFlow, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ICashFlow | null>;
    attachFileToTransaction(id: string, attachment: Omit<ITransactionAttachment, 'id' | 'uploadedAt'>): Promise<ICashFlow>;
    deleteTransaction(id: string): Promise<boolean>;
    processTransaction(id: string): Promise<ICashFlow>;
    cancelTransaction(id: string): Promise<ICashFlow>;
    getAllTransactions(limit?: number, offset?: number): Promise<ICashFlow[]>;
    getTransactionById(id: string): Promise<ICashFlow | null>;
    getUserTransactions(userId: string, limit?: number, offset?: number): Promise<ICashFlow[]>;
    getBucketTransactions(bucketId: string, startDate?: Date, endDate?: Date): Promise<ICashFlow[]>;
    getCashFlowSummary(userId: string, startDate: Date, endDate: Date): Promise<CashFlowSummary>;
    getBudgetAnalysis(userId: string, startDate: Date, endDate: Date): Promise<BudgetAnalysis>;
    createRecurringTransaction(transactionData: Omit<ICashFlow, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICashFlow>;
    processRecurringTransactions(): Promise<ICashFlow[]>;
    private calculateNextRecurrenceDate;
    private applyTransactionToBuckets;
    private adjustBucketAmount;
    private validateTransactionData;
    private generateAttachmentId;
}
//# sourceMappingURL=cashflow.service.d.ts.map