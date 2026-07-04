"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowService = void 0;
const cashflow_model_1 = require("../models/cashflow.model");
class CashFlowService {
    constructor(cashFlowRepository, bucketRepository) {
        this.cashFlowRepository = cashFlowRepository;
        this.bucketRepository = bucketRepository;
    }
    async createTransaction(transactionData) {
        this.validateTransactionData(transactionData);
        const transaction = new cashflow_model_1.CashFlow({
            ...transactionData,
            status: transactionData.status || 'pending'
        });
        const created = await this.cashFlowRepository.create(transaction.toJSON());
        // Allow immediate bucket updates for completed transactions (for example, bucket allocations).
        if (created.status === 'completed') {
            await this.applyTransactionToBuckets(created);
            const updated = await this.cashFlowRepository.update(created.id, {
                processedDate: created.processedDate || new Date()
            });
            return (updated || created);
        }
        return created;
    }
    async updateTransaction(id, updates) {
        const existingTransaction = await this.cashFlowRepository.findById(id);
        if (!existingTransaction) {
            throw new Error(`Transaction with id ${id} not found`);
        }
        return this.cashFlowRepository.update(id, updates);
    }
    async attachFileToTransaction(id, attachment) {
        const existingTransaction = await this.cashFlowRepository.findById(id);
        if (!existingTransaction) {
            throw new Error(`Transaction with id ${id} not found`);
        }
        const nextAttachment = {
            ...attachment,
            id: this.generateAttachmentId(),
            uploadedAt: new Date(),
        };
        const updated = await this.cashFlowRepository.update(id, {
            attachments: [...(existingTransaction.attachments || []), nextAttachment],
        });
        if (!updated) {
            throw new Error(`Failed to attach file to transaction ${id}`);
        }
        return updated;
    }
    async deleteTransaction(id) {
        const existingTransaction = await this.cashFlowRepository.findById(id);
        if (!existingTransaction) {
            throw new Error(`Transaction with id ${id} not found`);
        }
        // Don't allow deletion of completed transactions that affect buckets
        if (existingTransaction.status === 'completed' && existingTransaction.bucketId) {
            throw new Error('Cannot delete completed transaction that affects a bucket');
        }
        return this.cashFlowRepository.delete(id);
    }
    async processTransaction(id) {
        const transaction = await this.cashFlowRepository.findById(id);
        if (!transaction) {
            throw new Error(`Transaction with id ${id} not found`);
        }
        if (transaction.status !== 'pending') {
            throw new Error('Only pending transactions can be processed');
        }
        await this.applyTransactionToBuckets(transaction);
        return this.cashFlowRepository.update(id, {
            status: 'completed',
            processedDate: new Date()
        });
    }
    async cancelTransaction(id) {
        const transaction = await this.cashFlowRepository.findById(id);
        if (!transaction) {
            throw new Error(`Transaction with id ${id} not found`);
        }
        if (transaction.status === 'completed') {
            throw new Error('Cannot cancel completed transaction');
        }
        return this.cashFlowRepository.update(id, { status: 'cancelled' });
    }
    async getAllTransactions(limit, offset) {
        const transactions = await this.cashFlowRepository.findAll();
        const sorted = transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
        if (offset) {
            return limit ? sorted.slice(offset, offset + limit) : sorted.slice(offset);
        }
        return limit ? sorted.slice(0, limit) : sorted;
    }
    async getTransactionById(id) {
        return this.cashFlowRepository.findById(id);
    }
    async getUserTransactions(userId, limit, offset) {
        const transactions = await this.cashFlowRepository.findByUser(userId);
        // Sort by transaction date descending
        const sorted = transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
        if (offset) {
            return limit ? sorted.slice(offset, offset + limit) : sorted.slice(offset);
        }
        return limit ? sorted.slice(0, limit) : sorted;
    }
    async getBucketTransactions(bucketId, startDate, endDate) {
        return this.cashFlowRepository.getBucketTransactions(bucketId, startDate, endDate);
    }
    async getCashFlowSummary(userId, startDate, endDate) {
        const totalIncome = await this.cashFlowRepository.getTotalIncomeByPeriod(userId, startDate, endDate);
        const totalExpenses = await this.cashFlowRepository.getTotalExpensesByPeriod(userId, startDate, endDate);
        const totalAllocations = (await this.cashFlowRepository.findByType('allocation'))
            .filter(t => t.userId === userId &&
            t.status === 'completed' &&
            t.transactionDate >= startDate &&
            t.transactionDate <= endDate)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const pendingTransactions = (await this.cashFlowRepository.findPendingTransactions()).filter(t => t.userId === userId).length;
        const recurringTransactions = (await this.cashFlowRepository.findRecurringTransactions()).filter(t => t.userId === userId).length;
        return {
            totalIncome: Math.round(totalIncome * 100) / 100,
            totalExpenses: Math.round(totalExpenses * 100) / 100,
            netCashFlow: Math.round((totalIncome - totalExpenses - totalAllocations) * 100) / 100,
            pendingTransactions,
            recurringTransactions
        };
    }
    async getBudgetAnalysis(userId, startDate, endDate) {
        const categoryBreakdown = await this.cashFlowRepository.getCashFlowByCategory(userId, startDate, endDate);
        const bucketBreakdown = await this.cashFlowRepository.getCashFlowByBucket(userId, startDate, endDate);
        const totalAmount = Math.abs(categoryBreakdown.reduce((sum, item) => sum + Math.abs(item.total), 0));
        const categoryWithPercentage = categoryBreakdown.map(item => ({
            category: item.category,
            amount: Math.round(Math.abs(item.total) * 100) / 100,
            percentage: Math.round((Math.abs(item.total) / totalAmount) * 10000) / 100
        }));
        const bucketWithPercentage = await Promise.all(bucketBreakdown.map(async (item) => {
            const bucket = await this.bucketRepository.findById(item.bucketId);
            return {
                bucketId: item.bucketId,
                bucketName: bucket?.name,
                amount: Math.round(Math.abs(item.total) * 100) / 100,
                percentage: Math.round((Math.abs(item.total) / totalAmount) * 10000) / 100
            };
        }));
        // Calculate monthly averages
        const monthsDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        const monthlyAverage = totalAmount / monthsDiff;
        // Project next month based on current trend
        const projectedMonthly = monthlyAverage; // Could be enhanced with trend analysis
        return {
            categoryBreakdown: categoryWithPercentage.sort((a, b) => b.amount - a.amount),
            bucketBreakdown: bucketWithPercentage.sort((a, b) => b.amount - a.amount),
            monthlyAverage: Math.round(monthlyAverage * 100) / 100,
            projectedMonthly: Math.round(projectedMonthly * 100) / 100
        };
    }
    async createRecurringTransaction(transactionData) {
        if (!transactionData.recurring?.enabled) {
            throw new Error('Recurring transaction must have recurring configuration enabled');
        }
        const transaction = await this.createTransaction(transactionData);
        // Calculate next occurrence
        if (transaction.recurring?.frequency) {
            const nextDate = this.calculateNextRecurrenceDate(transaction.transactionDate, transaction.recurring.frequency);
            await this.cashFlowRepository.update(transaction.id, {
                recurring: {
                    ...transaction.recurring,
                    nextDate
                }
            });
        }
        return transaction;
    }
    async processRecurringTransactions() {
        const recurringTransactions = await this.cashFlowRepository.findRecurringTransactions();
        const today = new Date();
        const processedTransactions = [];
        for (const transaction of recurringTransactions) {
            if (transaction.recurring?.nextDate && transaction.recurring.nextDate <= today) {
                // Create new transaction for this occurrence
                const { id, createdAt, updatedAt, ...transactionWithoutIds } = transaction;
                const newTransaction = await this.createTransaction({
                    ...transactionWithoutIds,
                    transactionDate: new Date(),
                    recurring: {
                        ...transaction.recurring,
                        parentTransactionId: transaction.id
                    }
                });
                // Update the next occurrence date
                const nextDate = this.calculateNextRecurrenceDate(today, transaction.recurring.frequency);
                await this.cashFlowRepository.update(transaction.id, {
                    recurring: {
                        ...transaction.recurring,
                        nextDate: transaction.recurring.endDate && nextDate > transaction.recurring.endDate ? undefined : nextDate
                    }
                });
                processedTransactions.push(newTransaction);
            }
        }
        return processedTransactions;
    }
    calculateNextRecurrenceDate(currentDate, frequency) {
        const nextDate = new Date(currentDate);
        switch (frequency) {
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'biweekly':
                nextDate.setDate(nextDate.getDate() + 14);
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'quarterly':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case 'annually':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }
        return nextDate;
    }
    async applyTransactionToBuckets(transaction) {
        // Update bucket balance if transaction is allocated to a bucket
        if (transaction.bucketId && (transaction.type === 'income' || transaction.type === 'allocation')) {
            await this.adjustBucketAmount(transaction.bucketId, Math.abs(transaction.amount));
        }
        // Handle bucket withdrawals
        if (transaction.bucketId && transaction.type === 'expense') {
            await this.adjustBucketAmount(transaction.bucketId, -Math.abs(transaction.amount));
        }
        // Handle transfers between buckets
        if (transaction.type === 'transfer' && transaction.sourceBucketId && transaction.bucketId) {
            const amount = Math.abs(transaction.amount);
            await this.adjustBucketAmount(transaction.sourceBucketId, -amount);
            await this.adjustBucketAmount(transaction.bucketId, amount);
        }
    }
    async adjustBucketAmount(bucketId, delta) {
        const bucket = await this.bucketRepository.findById(bucketId);
        if (!bucket) {
            throw new Error('Source or target bucket not found');
        }
        const nextAmount = bucket.currentAmount + delta;
        if (nextAmount < 0) {
            throw new Error('Insufficient funds in bucket');
        }
        const targetAmount = bucket.targetAmount > 0 ? bucket.targetAmount : 1;
        const percentComplete = Math.round((Math.min(nextAmount / targetAmount, 1) * 100) * 100) / 100;
        await this.bucketRepository.update(bucketId, {
            currentAmount: nextAmount,
            progress: {
                ...(bucket.progress || {}),
                percentComplete,
                averageMonthlyContribution: bucket.progress?.averageMonthlyContribution ?? 0
            }
        });
    }
    validateTransactionData(data) {
        if (!data.description || data.description.trim().length === 0) {
            throw new Error('Transaction description is required');
        }
        if (!data.userId || data.userId.trim().length === 0) {
            throw new Error('User ID is required');
        }
        if (data.amount === 0) {
            throw new Error('Transaction amount cannot be zero');
        }
        if (!data.type) {
            throw new Error('Transaction type is required');
        }
        if (!data.category) {
            throw new Error('Transaction category is required');
        }
        if (data.type === 'transfer' && !data.sourceBucketId) {
            throw new Error('Transfer transactions require a source bucket ID');
        }
        if ((data.type === 'transfer' || data.type === 'allocation') && !data.bucketId) {
            throw new Error('Transfer and allocation transactions require a target bucket ID');
        }
    }
    generateAttachmentId() {
        return Math.random().toString(36).substring(2, 11);
    }
}
exports.CashFlowService = CashFlowService;
//# sourceMappingURL=cashflow.service.js.map