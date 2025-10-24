# Cash Flow and Bucket Management System

## Overview

I've created a comprehensive cash flow and bucket management system that allows you to track money flows into virtual "buckets" (like virtual bank accounts) without creating real accounts. Each bucket has target amounts and dates, enabling you to monitor whether you need more funds for specific goals.

## Key Models

### 🪣 **Bucket Model** (`bucket.model.ts`)
Virtual bank accounts for tracking financial goals:

**Core Properties:**
- `name` & `description` - What this bucket is for
- `type` - Category (emergency, savings, investment, expense, project, other)
- `status` - Current state (active, paused, completed, cancelled)
- `currentAmount` & `targetAmount` - Current funds vs. goal
- `targetDate` - When you want to reach the goal
- `priority` (1-10) - Importance ranking

**Auto-funding Configuration:**
```typescript
autoFunding: {
  enabled: boolean;
  percentage?: number;     // % of income to allocate
  fixedAmount?: number;    // Fixed amount per period  
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
}
```

**Progress Tracking:**
- Automatically calculates completion percentage
- Projects completion date based on contribution rate
- Determines if you're on track to meet target date
- Calculates required monthly contribution

### 💸 **CashFlow Model** (`cashflow.model.ts`)
Tracks all money movements:

**Transaction Types:**
- `income` - Money coming in
- `expense` - Money going out  
- `transfer` - Moving between buckets
- `allocation` - Assigning money to buckets

**Rich Categorization:**
- Income: salary, rental_income, investment, business, etc.
- Expenses: rent, utilities, groceries, entertainment, etc.

**Bucket Integration:**
- `bucketId` - Which bucket this affects
- `sourceBucketId` - For transfers between buckets

**Recurring Transactions:**
- Automatic recurring income/expenses
- Flexible scheduling (weekly, monthly, etc.)

## Key Features

### 🎯 **Smart Allocation Suggestions**
The `BucketService.getAllocationSuggestions()` method analyzes your buckets and suggests how to distribute available funds based on:

- **Priority levels** (1-10 scale)
- **Target date urgency** (behind schedule = higher priority)
- **Funding status** (underfunded buckets get priority)
- **Risk assessment** (critical/high/medium/low urgency)

### 📊 **Comprehensive Analytics**

**Bucket Analytics:**
- Overall progress across all buckets
- Overdue bucket detection
- Underfunded bucket identification
- Total current vs. target amounts

**Cash Flow Analytics:**
- Income vs. expenses analysis
- Category breakdown with percentages
- Bucket allocation tracking
- Monthly averages and projections

### 🔄 **Automated Processing**
- Process pending transactions
- Handle bucket balance updates automatically
- Manage transfers between buckets
- Process recurring transactions

## API Endpoints (Ready to Add)

### Bucket Management
```
GET    /api/buckets           - Get user's buckets
POST   /api/buckets           - Create new bucket
PUT    /api/buckets/:id       - Update bucket
DELETE /api/buckets/:id       - Delete bucket
POST   /api/buckets/:id/fund  - Add funds to bucket
POST   /api/buckets/transfer  - Transfer between buckets
GET    /api/buckets/summary   - Get bucket summary
GET    /api/buckets/suggestions - Get allocation suggestions
```

### Cash Flow Management  
```
GET    /api/cashflow               - Get user's transactions
POST   /api/cashflow               - Create transaction
PUT    /api/cashflow/:id           - Update transaction
DELETE /api/cashflow/:id           - Delete transaction
POST   /api/cashflow/:id/process   - Process pending transaction
GET    /api/cashflow/summary       - Get cash flow summary
GET    /api/cashflow/analysis      - Get budget analysis
```

## Usage Examples

### Creating a Bucket
```typescript
const emergencyFund = await bucketService.createBucket({
  name: "Emergency Fund",
  description: "6 months of expenses",
  type: "emergency",
  targetAmount: 15000,
  targetDate: new Date('2024-12-31'),
  priority: 9,
  ownerId: userId,
  autoFunding: {
    enabled: true,
    percentage: 20,  // 20% of income
    frequency: 'monthly'
  }
});
```

### Recording Income and Allocation
```typescript
// Record salary income
const salary = await cashFlowService.createTransaction({
  description: "Monthly Salary",
  amount: 5000,
  type: "income",
  category: "salary",
  userId: userId,
  transactionDate: new Date()
});

// Allocate to emergency fund
const allocation = await cashFlowService.createTransaction({
  description: "Emergency Fund Allocation",
  amount: 1000,
  type: "allocation",
  category: "other_income",
  bucketId: emergencyFund.id,
  userId: userId,
  transactionDate: new Date()
});
```

### Getting Smart Suggestions
```typescript
const suggestions = await bucketService.getAllocationSuggestions(userId, 2000);
// Returns prioritized list of which buckets need funding most
```

## Benefits

✅ **Track Multiple Financial Goals** - Each bucket represents a different savings goal  
✅ **Smart Prioritization** - System suggests which buckets need funding based on urgency and priority  
✅ **Progress Monitoring** - Always know if you're on track to meet your goals  
✅ **Flexible Funding** - Manual allocations, automatic percentages, or fixed amounts  
✅ **Comprehensive Analytics** - Detailed insights into spending patterns and progress  
✅ **Database Agnostic** - Works with any database backend  

This system gives you complete visibility into your financial goals and helps optimize your money allocation decisions!