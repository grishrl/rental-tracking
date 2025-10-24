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
  
  // Transaction metadata
  transactionDate: Date;
  processedDate?: Date;
  referenceNumber?: string;
  
  // Bucket allocation
  bucketId?: string; // Which bucket this transaction affects
  sourceBucketId?: string; // For transfers between buckets
  
  // User and account info
  userId: string;
  externalAccountId?: string; // Reference to external bank account
  
  // Recurring transaction info
  recurring?: {
    enabled: boolean;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
    nextDate?: Date;
    endDate?: Date;
    parentTransactionId?: string; // Reference to the original recurring setup
  };
  
  // Metadata
  tags?: string[];
  notes?: string;
}

export class CashFlow implements ICashFlow {
  public id: string;
  public description: string;
  public amount: number;
  public type: TransactionType;
  public category: TransactionCategory;
  public status: TransactionStatus;
  public transactionDate: Date;
  public processedDate?: Date;
  public referenceNumber?: string;
  public bucketId?: string;
  public sourceBucketId?: string;
  public userId: string;
  public externalAccountId?: string;
  public recurring?: {
    enabled: boolean;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
    nextDate?: Date;
    endDate?: Date;
    parentTransactionId?: string;
  };
  public tags?: string[];
  public notes?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Omit<ICashFlow, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = this.generateId();
    this.description = data.description;
    this.amount = data.amount;
    this.type = data.type;
    this.category = data.category;
    this.status = data.status;
    this.transactionDate = data.transactionDate;
    this.processedDate = data.processedDate;
    this.referenceNumber = data.referenceNumber;
    this.bucketId = data.bucketId;
    this.sourceBucketId = data.sourceBucketId;
    this.userId = data.userId;
    this.externalAccountId = data.externalAccountId;
    this.recurring = data.recurring;
    this.tags = data.tags || [];
    this.notes = data.notes;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public markCompleted(): void {
    this.status = 'completed';
    this.processedDate = new Date();
    this.updateTimestamp();
  }

  public markCancelled(): void {
    this.status = 'cancelled';
    this.updateTimestamp();
  }

  public markFailed(): void {
    this.status = 'failed';
    this.updateTimestamp();
  }

  public isIncome(): boolean {
    return this.type === 'income';
  }

  public isExpense(): boolean {
    return this.type === 'expense';
  }

  public isTransfer(): boolean {
    return this.type === 'transfer';
  }

  public isAllocation(): boolean {
    return this.type === 'allocation';
  }

  public getEffectiveAmount(): number {
    // Returns positive for income/inbound transfers, negative for expenses/outbound transfers
    if (this.isIncome()) return Math.abs(this.amount);
    if (this.isExpense()) return -Math.abs(this.amount);
    // For transfers and allocations, the sign depends on context (handled by service layer)
    return this.amount;
  }

  public toJSON(): ICashFlow {
    return {
      id: this.id,
      description: this.description,
      amount: this.amount,
      type: this.type,
      category: this.category,
      status: this.status,
      transactionDate: this.transactionDate,
      processedDate: this.processedDate,
      referenceNumber: this.referenceNumber,
      bucketId: this.bucketId,
      sourceBucketId: this.sourceBucketId,
      userId: this.userId,
      externalAccountId: this.externalAccountId,
      recurring: this.recurring,
      tags: this.tags,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}