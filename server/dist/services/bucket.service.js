"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketService = void 0;
const bucket_model_1 = require("../models/bucket.model");
class BucketService {
    constructor(bucketRepository, cashFlowRepository) {
        this.bucketRepository = bucketRepository;
        this.cashFlowRepository = cashFlowRepository;
    }
    async createBucket(bucketData) {
        this.validateBucketData(bucketData);
        // Set default values
        const bucket = new bucket_model_1.Bucket({
            ...bucketData,
            currentAmount: bucketData.currentAmount || 0,
            status: bucketData.status || 'active',
            priority: bucketData.priority || 5
        });
        return this.bucketRepository.create(bucket.toJSON());
    }
    async updateBucket(id, updates) {
        const existingBucket = await this.bucketRepository.findById(id);
        if (!existingBucket) {
            throw new Error(`Bucket with id ${id} not found`);
        }
        // Recalculate progress if target or current amount changed
        if (updates.targetAmount || updates.currentAmount !== undefined) {
            const bucket = new bucket_model_1.Bucket(existingBucket);
            if (updates.targetAmount)
                bucket.updateTarget(updates.targetAmount, updates.targetDate);
            if (updates.currentAmount !== undefined) {
                const difference = updates.currentAmount - bucket.currentAmount;
                if (difference > 0) {
                    bucket.addFunds(difference);
                }
                else if (difference < 0) {
                    bucket.removeFunds(Math.abs(difference));
                }
            }
            updates.progress = bucket.progress;
        }
        return this.bucketRepository.update(id, updates);
    }
    async deleteBucket(id) {
        // Check if bucket has transactions
        const transactions = await this.cashFlowRepository.getBucketTransactions(id);
        if (transactions.length > 0) {
            throw new Error('Cannot delete bucket with existing transactions');
        }
        return this.bucketRepository.delete(id);
    }
    async getBucketById(id) {
        return this.bucketRepository.findById(id);
    }
    async getUserBuckets(userId) {
        const buckets = await this.bucketRepository.findByOwner(userId);
        return buckets.sort((a, b) => b.priority - a.priority);
    }
    async getBucketsByType(type) {
        return this.bucketRepository.findByType(type);
    }
    async getBucketsByStatus(status) {
        return this.bucketRepository.findByStatus(status);
    }
    async addFundsToBucket(bucketId, amount, transactionDescription) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        const bucket = await this.bucketRepository.findById(bucketId);
        if (!bucket) {
            throw new Error(`Bucket with id ${bucketId} not found`);
        }
        // Update bucket amount
        const bucketInstance = new bucket_model_1.Bucket(bucket);
        bucketInstance.addFunds(amount);
        return this.bucketRepository.update(bucketId, {
            currentAmount: bucketInstance.currentAmount,
            progress: bucketInstance.progress
        });
    }
    async removeFundsFromBucket(bucketId, amount, transactionDescription) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        const bucket = await this.bucketRepository.findById(bucketId);
        if (!bucket) {
            throw new Error(`Bucket with id ${bucketId} not found`);
        }
        if (amount > bucket.currentAmount) {
            throw new Error('Insufficient funds in bucket');
        }
        // Update bucket amount
        const bucketInstance = new bucket_model_1.Bucket(bucket);
        bucketInstance.removeFunds(amount);
        return this.bucketRepository.update(bucketId, {
            currentAmount: bucketInstance.currentAmount,
            progress: bucketInstance.progress
        });
    }
    async transferFunds(fromBucketId, toBucketId, amount) {
        const fromBucket = await this.removeFundsFromBucket(fromBucketId, amount, `Transfer to bucket ${toBucketId}`);
        const toBucket = await this.addFundsToBucket(toBucketId, amount, `Transfer from bucket ${fromBucketId}`);
        return { fromBucket, toBucket };
    }
    async getBucketSummary(userId) {
        const buckets = await this.bucketRepository.findByOwner(userId);
        const activeBuckets = buckets.filter(b => b.status === 'active');
        const overdueBuckets = await this.bucketRepository.findOverdueBuckets();
        const underfundedBuckets = await this.bucketRepository.findUnderfundedBuckets();
        const totalCurrentAmount = buckets.reduce((sum, bucket) => sum + bucket.currentAmount, 0);
        const totalTargetAmount = buckets.reduce((sum, bucket) => sum + bucket.targetAmount, 0);
        const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
        return {
            totalBuckets: buckets.length,
            activeBuckets: activeBuckets.length,
            totalCurrentAmount: Math.round(totalCurrentAmount * 100) / 100,
            totalTargetAmount: Math.round(totalTargetAmount * 100) / 100,
            overallProgress: Math.round(overallProgress * 100) / 100,
            overdueBuckets: overdueBuckets.filter(b => b.ownerId === userId).length,
            underfundedBuckets: underfundedBuckets.filter(b => b.ownerId === userId).length
        };
    }
    async getAllocationSuggestions(userId, availableAmount) {
        const buckets = await this.bucketRepository.findByOwner(userId);
        const activeBuckets = buckets.filter(b => b.status === 'active');
        const suggestions = [];
        for (const bucket of activeBuckets) {
            const bucketInstance = new bucket_model_1.Bucket(bucket);
            const isOnTrack = bucketInstance.isOnTrack();
            const requiredMonthly = bucketInstance.getRequiredMonthlyContribution();
            const remainingAmount = bucket.targetAmount - bucket.currentAmount;
            let urgency = 'low';
            let reason = '';
            let suggestedAmount = 0;
            if (remainingAmount <= 0) {
                continue; // Skip completed buckets
            }
            if (!isOnTrack) {
                urgency = bucket.targetDate && bucket.targetDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'critical' : 'high';
                reason = 'Behind schedule for target date';
                suggestedAmount = Math.min(requiredMonthly, remainingAmount, availableAmount * 0.3);
            }
            else if (bucket.priority >= 8) {
                urgency = 'high';
                reason = 'High priority bucket';
                suggestedAmount = Math.min(requiredMonthly * 1.2, remainingAmount, availableAmount * 0.25);
            }
            else if (bucket.priority >= 6) {
                urgency = 'medium';
                reason = 'Medium priority bucket';
                suggestedAmount = Math.min(requiredMonthly, remainingAmount, availableAmount * 0.2);
            }
            else {
                urgency = 'low';
                reason = 'Low priority bucket';
                suggestedAmount = Math.min(requiredMonthly * 0.8, remainingAmount, availableAmount * 0.1);
            }
            suggestions.push({
                bucketId: bucket.id,
                bucketName: bucket.name,
                suggestedAmount: Math.round(suggestedAmount * 100) / 100,
                priority: bucket.priority,
                reason,
                urgency
            });
        }
        // Sort by urgency and priority
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return suggestions.sort((a, b) => {
            const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
            return urgencyDiff !== 0 ? urgencyDiff : b.priority - a.priority;
        });
    }
    validateBucketData(data) {
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Bucket name is required');
        }
        if (!data.ownerId || data.ownerId.trim().length === 0) {
            throw new Error('Owner ID is required');
        }
        if (data.targetAmount <= 0) {
            throw new Error('Target amount must be greater than 0');
        }
        if (data.currentAmount && data.currentAmount < 0) {
            throw new Error('Current amount cannot be negative');
        }
        if (data.priority && (data.priority < 1 || data.priority > 10)) {
            throw new Error('Priority must be between 1 and 10');
        }
        if (data.targetDate && data.targetDate <= new Date()) {
            throw new Error('Target date must be in the future');
        }
    }
}
exports.BucketService = BucketService;
//# sourceMappingURL=bucket.service.js.map