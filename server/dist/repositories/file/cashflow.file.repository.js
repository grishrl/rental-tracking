"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowFileRepository = void 0;
const store_backed_repository_1 = require("../store-backed.repository");
class CashFlowFileRepository extends store_backed_repository_1.StoreBackedRepository {
    constructor(store) {
        super(store);
    }
    getEffectiveAmount(transaction) {
        if (transaction.type === 'income')
            return Math.abs(transaction.amount);
        if (transaction.type === 'expense')
            return -Math.abs(transaction.amount);
        return transaction.amount;
    }
    async findByUser(userId) {
        return this.findBy({ userId });
    }
    async findByBucket(bucketId) {
        return this.findBy({ bucketId });
    }
    async findByType(type) {
        return this.findBy({ type });
    }
    async findByCategory(category) {
        return this.findBy({ category });
    }
    async findByStatus(status) {
        return this.findBy({ status });
    }
    async findByDateRange(startDate, endDate) {
        const allTransactions = await this.findAll();
        return allTransactions.filter((transaction) => transaction.transactionDate >= startDate && transaction.transactionDate <= endDate);
    }
    async findRecurringTransactions() {
        const allTransactions = await this.findAll();
        return allTransactions.filter((transaction) => transaction.recurring?.enabled === true);
    }
    async findPendingTransactions() {
        return this.findByStatus('pending');
    }
    async getTotalIncomeByPeriod(userId, startDate, endDate) {
        const userTransactions = await this.findByUser(userId);
        return userTransactions
            .filter((transaction) => transaction.type === 'income' &&
            transaction.status === 'completed' &&
            transaction.transactionDate >= startDate &&
            transaction.transactionDate <= endDate)
            .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
    }
    async getTotalExpensesByPeriod(userId, startDate, endDate) {
        const userTransactions = await this.findByUser(userId);
        return userTransactions
            .filter((transaction) => transaction.type === 'expense' &&
            transaction.status === 'completed' &&
            transaction.transactionDate >= startDate &&
            transaction.transactionDate <= endDate)
            .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
    }
    async getNetCashFlowByPeriod(userId, startDate, endDate) {
        const totalIncome = await this.getTotalIncomeByPeriod(userId, startDate, endDate);
        const totalExpenses = await this.getTotalExpensesByPeriod(userId, startDate, endDate);
        return totalIncome - totalExpenses;
    }
    async getCashFlowByCategory(userId, startDate, endDate) {
        const userTransactions = await this.findByUser(userId);
        const filteredTransactions = userTransactions.filter((transaction) => transaction.status === 'completed' &&
            transaction.transactionDate >= startDate &&
            transaction.transactionDate <= endDate);
        const categoryTotals = new Map();
        filteredTransactions.forEach((transaction) => {
            const current = categoryTotals.get(transaction.category) || 0;
            const effectiveAmount = this.getEffectiveAmount(transaction);
            categoryTotals.set(transaction.category, current + effectiveAmount);
        });
        return Array.from(categoryTotals.entries()).map(([category, total]) => ({
            category,
            total: Math.round(total * 100) / 100,
        }));
    }
    async getCashFlowByBucket(userId, startDate, endDate) {
        const userTransactions = await this.findByUser(userId);
        const filteredTransactions = userTransactions.filter((transaction) => !!transaction.bucketId &&
            transaction.status === 'completed' &&
            transaction.transactionDate >= startDate &&
            transaction.transactionDate <= endDate);
        const bucketTotals = new Map();
        filteredTransactions.forEach((transaction) => {
            if (!transaction.bucketId) {
                return;
            }
            const current = bucketTotals.get(transaction.bucketId) || 0;
            const effectiveAmount = this.getEffectiveAmount(transaction);
            bucketTotals.set(transaction.bucketId, current + effectiveAmount);
        });
        return Array.from(bucketTotals.entries()).map(([bucketId, total]) => ({
            bucketId,
            total: Math.round(total * 100) / 100,
        }));
    }
    async getBucketTransactions(bucketId, startDate, endDate) {
        let transactions = await this.findByBucket(bucketId);
        if (startDate && endDate) {
            transactions = transactions.filter((transaction) => transaction.transactionDate >= startDate && transaction.transactionDate <= endDate);
        }
        return transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
    }
    async getBucketBalance(bucketId) {
        const transactions = await this.getBucketTransactions(bucketId);
        return transactions
            .filter((transaction) => transaction.status === 'completed')
            .reduce((balance, transaction) => balance + this.getEffectiveAmount(transaction), 0);
    }
}
exports.CashFlowFileRepository = CashFlowFileRepository;
//# sourceMappingURL=cashflow.file.repository.js.map