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
        return this.cashFlowRepository.create(transaction.toJSON());
    }
    async updateTransaction(id, updates) {
        const existingTransaction = await this.cashFlowRepository.findById(id);
        if (!existingTransaction) {
            throw new Error(`Transaction with id ${id} not found`);
        }
        return this.cashFlowRepository.update(id, updates);
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
        // Update bucket balance if transaction is allocated to a bucket
        if (transaction.bucketId && (transaction.type === 'income' || transaction.type === 'allocation')) {
            const bucket = await this.bucketRepository.findById(transaction.bucketId);
            if (bucket) {
                const amount = Math.abs(transaction.amount);
                await this.bucketRepository.update(transaction.bucketId, {
                    currentAmount: bucket.currentAmount + amount
                });
            }
        }
        // Handle bucket withdrawals
        if (transaction.bucketId && transaction.type === 'expense') {
            const bucket = await this.bucketRepository.findById(transaction.bucketId);
            if (bucket) {
                const amount = Math.abs(transaction.amount);
                if (bucket.currentAmount < amount) {
                    throw new Error('Insufficient funds in bucket');
                }
                await this.bucketRepository.update(transaction.bucketId, {
                    currentAmount: bucket.currentAmount - amount
                });
            }
        }
        // Handle transfers between buckets
        if (transaction.type === 'transfer' && transaction.sourceBucketId && transaction.bucketId) {
            const sourceBucket = await this.bucketRepository.findById(transaction.sourceBucketId);
            const targetBucket = await this.bucketRepository.findById(transaction.bucketId);
            if (!sourceBucket || !targetBucket) {
                throw new Error('Source or target bucket not found');
            }
            const amount = Math.abs(transaction.amount);
            if (sourceBucket.currentAmount < amount) {
                throw new Error('Insufficient funds in source bucket');
            }
            await this.bucketRepository.update(transaction.sourceBucketId, {
                currentAmount: sourceBucket.currentAmount - amount
            });
            await this.bucketRepository.update(transaction.bucketId, {
                currentAmount: targetBucket.currentAmount + amount
            });
        }
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
        const pendingTransactions = (await this.cashFlowRepository.findPendingTransactions()).filter(t => t.userId === userId).length;
        const recurringTransactions = (await this.cashFlowRepository.findRecurringTransactions()).filter(t => t.userId === userId).length;
        return {
            totalIncome: Math.round(totalIncome * 100) / 100,
            totalExpenses: Math.round(totalExpenses * 100) / 100,
            netCashFlow: Math.round((totalIncome - totalExpenses) * 100) / 100,
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
}
exports.CashFlowService = CashFlowService;
//# sourceMappingURL=cashflow.service.js.map