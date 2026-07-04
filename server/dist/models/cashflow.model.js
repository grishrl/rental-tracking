"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlow = void 0;
class CashFlow {
    constructor(data) {
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
        this.attachments = data.attachments || [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    updateTimestamp() {
        this.updatedAt = new Date();
    }
    markCompleted() {
        this.status = 'completed';
        this.processedDate = new Date();
        this.updateTimestamp();
    }
    markCancelled() {
        this.status = 'cancelled';
        this.updateTimestamp();
    }
    markFailed() {
        this.status = 'failed';
        this.updateTimestamp();
    }
    isIncome() {
        return this.type === 'income';
    }
    isExpense() {
        return this.type === 'expense';
    }
    isTransfer() {
        return this.type === 'transfer';
    }
    isAllocation() {
        return this.type === 'allocation';
    }
    getEffectiveAmount() {
        // Returns positive for income/inbound transfers, negative for expenses/outbound transfers
        if (this.isIncome())
            return Math.abs(this.amount);
        if (this.isExpense())
            return -Math.abs(this.amount);
        // For transfers and allocations, the sign depends on context (handled by service layer)
        return this.amount;
    }
    toJSON() {
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
            attachments: this.attachments,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.CashFlow = CashFlow;
//# sourceMappingURL=cashflow.model.js.map