import { ICashFlow, TransactionType, TransactionCategory, TransactionStatus } from '../models/cashflow.model';
import { InMemoryRepository } from './memory.repository';
import { ICashFlowRepository } from './cashflow.repository.interface';

export class CashFlowRepository extends InMemoryRepository<ICashFlow> implements ICashFlowRepository {
  constructor() {
    super('cashflows');
  }

  private getEffectiveAmount(transaction: ICashFlow): number {
    // Returns positive for income/inbound transfers, negative for expenses/outbound transfers
    if (transaction.type === 'income') return Math.abs(transaction.amount);
    if (transaction.type === 'expense') return -Math.abs(transaction.amount);
    // For transfers and allocations, the sign depends on context
    return transaction.amount;
  }

  async findByUser(userId: string): Promise<ICashFlow[]> {
    return this.findBy({ userId } as Partial<ICashFlow>);
  }

  async findByBucket(bucketId: string): Promise<ICashFlow[]> {
    return this.findBy({ bucketId } as Partial<ICashFlow>);
  }

  async findByType(type: TransactionType): Promise<ICashFlow[]> {
    return this.findBy({ type } as Partial<ICashFlow>);
  }

  async findByCategory(category: TransactionCategory): Promise<ICashFlow[]> {
    return this.findBy({ category } as Partial<ICashFlow>);
  }

  async findByStatus(status: TransactionStatus): Promise<ICashFlow[]> {
    return this.findBy({ status } as Partial<ICashFlow>);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ICashFlow[]> {
    const allTransactions = await this.findAll();
    
    return allTransactions.filter(transaction => 
      transaction.transactionDate >= startDate && 
      transaction.transactionDate <= endDate
    );
  }

  async findRecurringTransactions(): Promise<ICashFlow[]> {
    const allTransactions = await this.findAll();
    
    return allTransactions.filter(transaction => 
      transaction.recurring?.enabled === true
    );
  }

  async findPendingTransactions(): Promise<ICashFlow[]> {
    return this.findByStatus('pending');
  }

  async getTotalIncomeByPeriod(userId: string, startDate: Date, endDate: Date): Promise<number> {
    const userTransactions = await this.findByUser(userId);
    
    return userTransactions
      .filter(transaction => 
        transaction.type === 'income' &&
        transaction.status === 'completed' &&
        transaction.transactionDate >= startDate &&
        transaction.transactionDate <= endDate
      )
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  }

  async getTotalExpensesByPeriod(userId: string, startDate: Date, endDate: Date): Promise<number> {
    const userTransactions = await this.findByUser(userId);
    
    return userTransactions
      .filter(transaction => 
        transaction.type === 'expense' &&
        transaction.status === 'completed' &&
        transaction.transactionDate >= startDate &&
        transaction.transactionDate <= endDate
      )
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  }

  async getNetCashFlowByPeriod(userId: string, startDate: Date, endDate: Date): Promise<number> {
    const totalIncome = await this.getTotalIncomeByPeriod(userId, startDate, endDate);
    const totalExpenses = await this.getTotalExpensesByPeriod(userId, startDate, endDate);
    
    return totalIncome - totalExpenses;
  }

  async getCashFlowByCategory(userId: string, startDate: Date, endDate: Date): Promise<{ category: TransactionCategory; total: number }[]> {
    const userTransactions = await this.findByUser(userId);
    
    const filteredTransactions = userTransactions.filter(transaction => 
      transaction.status === 'completed' &&
      transaction.transactionDate >= startDate &&
      transaction.transactionDate <= endDate
    );

    const categoryTotals = new Map<TransactionCategory, number>();
    
    filteredTransactions.forEach(transaction => {
      const current = categoryTotals.get(transaction.category) || 0;
      const effectiveAmount = this.getEffectiveAmount(transaction);
      categoryTotals.set(transaction.category, current + effectiveAmount);
    });

    return Array.from(categoryTotals.entries()).map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100
    }));
  }

  async getCashFlowByBucket(userId: string, startDate: Date, endDate: Date): Promise<{ bucketId: string; total: number }[]> {
    const userTransactions = await this.findByUser(userId);
    
    const filteredTransactions = userTransactions.filter(transaction => 
      transaction.bucketId &&
      transaction.status === 'completed' &&
      transaction.transactionDate >= startDate &&
      transaction.transactionDate <= endDate
    );

    const bucketTotals = new Map<string, number>();
    
    filteredTransactions.forEach(transaction => {
      if (!transaction.bucketId) return;
      
      const current = bucketTotals.get(transaction.bucketId) || 0;
      const effectiveAmount = this.getEffectiveAmount(transaction);
      bucketTotals.set(transaction.bucketId, current + effectiveAmount);
    });

    return Array.from(bucketTotals.entries()).map(([bucketId, total]) => ({
      bucketId,
      total: Math.round(total * 100) / 100
    }));
  }

  async getBucketTransactions(bucketId: string, startDate?: Date, endDate?: Date): Promise<ICashFlow[]> {
    let transactions = await this.findByBucket(bucketId);
    
    if (startDate && endDate) {
      transactions = transactions.filter(transaction => 
        transaction.transactionDate >= startDate && 
        transaction.transactionDate <= endDate
      );
    }

    return transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
  }

  async getBucketBalance(bucketId: string): Promise<number> {
    const transactions = await this.getBucketTransactions(bucketId);
    
    return transactions
      .filter(transaction => transaction.status === 'completed')
      .reduce((balance, transaction) => {
        const effectiveAmount = this.getEffectiveAmount(transaction);
        return balance + effectiveAmount;
      }, 0);
  }
}