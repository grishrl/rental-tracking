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
  priority: number; // 1-10, higher numbers = higher priority
  ownerId: string;
  
  // Automatic funding rules
  autoFunding?: {
    enabled: boolean;
    percentage?: number; // Percentage of income to allocate
    fixedAmount?: number; // Fixed amount per period
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  };
  
  // Progress tracking
  progress: {
    percentComplete: number;
    projectedCompletionDate?: Date;
    daysToTarget?: number;
    averageMonthlyContribution: number;
    monthsRemaining?: number;
  };
  
  // Metadata
  tags?: string[];
  color?: string; // For UI display
  icon?: string; // For UI display
}

export class Bucket implements IBucket {
  public id: string;
  public name: string;
  public description?: string;
  public type: BucketType;
  public status: BucketStatus;
  public currentAmount: number;
  public targetAmount: number;
  public targetDate?: Date;
  public priority: number;
  public ownerId: string;
  public autoFunding?: {
    enabled: boolean;
    percentage?: number;
    fixedAmount?: number;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  };
  public progress: {
    percentComplete: number;
    projectedCompletionDate?: Date;
    daysToTarget?: number;
    averageMonthlyContribution: number;
    monthsRemaining?: number;
  };
  public tags?: string[];
  public color?: string;
  public icon?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Omit<IBucket, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) {
    this.id = this.generateId();
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.status = data.status;
    this.currentAmount = data.currentAmount || 0;
    this.targetAmount = data.targetAmount;
    this.targetDate = data.targetDate;
    this.priority = data.priority;
    this.ownerId = data.ownerId;
    this.autoFunding = data.autoFunding;
    this.tags = data.tags || [];
    this.color = data.color;
    this.icon = data.icon;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    // Calculate initial progress
    this.progress = this.calculateProgress();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public addFunds(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    this.currentAmount += amount;
    this.progress = this.calculateProgress();
    this.updateTimestamp();
  }

  public removeFunds(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (amount > this.currentAmount) {
      throw new Error('Insufficient funds in bucket');
    }
    this.currentAmount -= amount;
    this.progress = this.calculateProgress();
    this.updateTimestamp();
  }

  public updateTarget(newTarget: number, newDate?: Date): void {
    this.targetAmount = newTarget;
    if (newDate) {
      this.targetDate = newDate;
    }
    this.progress = this.calculateProgress();
    this.updateTimestamp();
  }

  private calculateProgress(): {
    percentComplete: number;
    projectedCompletionDate?: Date;
    daysToTarget?: number;
    averageMonthlyContribution: number;
    monthsRemaining?: number;
  } {
    const percentComplete = Math.min((this.currentAmount / this.targetAmount) * 100, 100);
    
    let daysToTarget: number | undefined;
    let monthsRemaining: number | undefined;
    let projectedCompletionDate: Date | undefined;
    
    if (this.targetDate) {
      const today = new Date();
      daysToTarget = Math.ceil((this.targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Calculate average monthly contribution based on bucket age
    const ageInMonths = Math.max(1, Math.ceil((new Date().getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const averageMonthlyContribution = this.currentAmount / ageInMonths;

    // Calculate projected completion if we have a target date and current contribution rate
    if (this.targetDate && averageMonthlyContribution > 0) {
      const remainingAmount = this.targetAmount - this.currentAmount;
      if (remainingAmount > 0) {
        monthsRemaining = Math.ceil(remainingAmount / averageMonthlyContribution);
        projectedCompletionDate = new Date();
        projectedCompletionDate.setMonth(projectedCompletionDate.getMonth() + monthsRemaining);
      }
    }

    return {
      percentComplete: Math.round(percentComplete * 100) / 100,
      projectedCompletionDate,
      daysToTarget,
      averageMonthlyContribution: Math.round(averageMonthlyContribution * 100) / 100,
      monthsRemaining
    };
  }

  public isOnTrack(): boolean {
    if (!this.targetDate) return true;
    
    const today = new Date();
    const totalDays = Math.ceil((this.targetDate.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((today.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = (daysPassed / totalDays) * 100;
    
    return this.progress.percentComplete >= expectedProgress;
  }

  public getRequiredMonthlyContribution(): number {
    if (!this.targetDate) return 0;
    
    const remainingAmount = this.targetAmount - this.currentAmount;
    const today = new Date();
    const monthsRemaining = Math.max(1, Math.ceil((this.targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    return Math.ceil(remainingAmount / monthsRemaining);
  }

  public toJSON(): IBucket {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      status: this.status,
      currentAmount: this.currentAmount,
      targetAmount: this.targetAmount,
      targetDate: this.targetDate,
      priority: this.priority,
      ownerId: this.ownerId,
      autoFunding: this.autoFunding,
      progress: this.progress,
      tags: this.tags,
      color: this.color,
      icon: this.icon,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}