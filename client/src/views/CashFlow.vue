<template>
  <v-container fluid>
    <!-- Page Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h3 mb-2">Cash Flow Management</h1>
        <p class="text-subtitle-1 text-grey-700">Track your income, expenses, and bucket allocations</p>
      </v-col>
    </v-row>

    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="success" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon large class="mr-3">mdi-trending-up</v-icon>
              <div>
                <h3 class="text-h4">${{ summary.totalIncome.toLocaleString() }}</h3>
                <p class="mb-0">Total Income</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="error" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon large class="mr-3">mdi-trending-down</v-icon>
              <div>
                <h3 class="text-h4">${{ summary.totalExpenses.toLocaleString() }}</h3>
                <p class="mb-0">Total Expenses</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card :color="summary.netCashFlow >= 0 ? 'primary' : 'warning'" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon large class="mr-3">mdi-cash</v-icon>
              <div>
                <h3 class="text-h4">${{ summary.netCashFlow.toLocaleString() }}</h3>
                <p class="mb-0">Net Cash Flow</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="info" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon large class="mr-3">mdi-clock-outline</v-icon>
              <div>
                <h3 class="text-h4">{{ summary.pendingTransactions }}</h3>
                <p class="mb-0">Pending Transactions</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-btn 
                  color="primary" 
                  block 
                  large
                  @click="showAddTransactionDialog = true"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Transaction
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn 
                  color="secondary" 
                  block 
                  large
                  @click="showCreateBucketDialog = true"
                >
                  <v-icon left>mdi-bucket</v-icon>
                  Create Bucket
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn 
                  color="success" 
                  block 
                  large
                  @click="showAllocateFundsDialog = true"
                >
                  <v-icon left>mdi-bank-transfer</v-icon>
                  Allocate Funds
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn 
                  color="info" 
                  block 
                  large
                  @click="exportData"
                >
                  <v-icon left>mdi-download</v-icon>
                  Export Data
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Buckets Overview -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-bucket</v-icon>
            Financial Buckets
            <v-spacer></v-spacer>
            <v-btn small color="primary" @click="showCreateBucketDialog = true">
              <v-icon left small>mdi-plus</v-icon>
              Add Bucket
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row v-if="buckets.length === 0">
              <v-col cols="12" class="text-center py-8">
                <v-icon size="80" color="grey lighten-2">mdi-bucket-outline</v-icon>
                <p class="text-h6 mt-4 text-grey">No buckets created yet</p>
                <v-btn color="primary" @click="showCreateBucketDialog = true">
                  Create Your First Bucket
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-for="bucket in buckets" :key="bucket.id" cols="12" md="6" lg="4">
                <v-card outlined>
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-avatar :color="bucket.color || 'primary'" size="32" class="mr-3">
                        <v-icon dark>{{ bucket.icon || 'mdi-bucket' }}</v-icon>
                      </v-avatar>
                      <div>
                        <h4>{{ bucket.name }}</h4>
                        <p class="text-caption mb-0 text-grey">{{ bucket.type.toUpperCase() }}</p>
                      </div>
                    </div>
                    
                    <v-progress-linear
                      :value="bucket.progress?.percentComplete || 0"
                      height="8"
                      :color="bucket.progress?.percentComplete >= 100 ? 'success' : 'primary'"
                      class="mb-2"
                    ></v-progress-linear>
                    
                    <div class="d-flex justify-space-between text-body-2">
                      <span>${{ bucket.currentAmount.toLocaleString() }}</span>
                      <span>${{ bucket.targetAmount.toLocaleString() }}</span>
                    </div>
                    
                    <p class="text-caption text-grey mt-1">
                      {{ Math.round(bucket.progress?.percentComplete || 0) }}% complete
                    </p>
                    
                    <v-btn
                      small
                      color="primary"
                      block
                      @click="addFundsToBucket(bucket)"
                    >
                      <v-icon left small>mdi-plus</v-icon>
                      Add Funds
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-pie</v-icon>
            Allocation Overview
          </v-card-title>
          <v-card-text>
            <div v-if="buckets.length === 0" class="text-center py-4">
              <p class="text-grey">Create buckets to see allocation</p>
            </div>
            <div v-else>
              <!-- Simple allocation breakdown -->
              <div v-for="bucket in buckets" :key="bucket.id" class="mb-3">
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-body-2">{{ bucket.name }}</span>
                  <span class="text-body-2 font-weight-bold">
                    ${{ bucket.currentAmount.toLocaleString() }}
                  </span>
                </div>
                <v-progress-linear
                  :value="(bucket.currentAmount / getTotalBucketAmount()) * 100"
                  height="4"
                  :color="bucket.color || 'primary'"
                ></v-progress-linear>
              </div>
              
              <v-divider class="my-3"></v-divider>
              
              <div class="d-flex justify-space-between">
                <span class="font-weight-bold">Total Allocated:</span>
                <span class="font-weight-bold">${{ getTotalBucketAmount().toLocaleString() }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cash Flow Calendar -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-calendar</v-icon>
            Cash Flow Calendar
            <v-spacer></v-spacer>
            
            <!-- Calendar Navigation -->
            <div class="d-flex align-center mr-4">
              <v-btn 
                icon 
                variant="text" 
                @click="previousMonth"
                :title="calendarView === 'month' ? 'Previous Month' : 'Previous Week'"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              
              <span class="mx-3 text-h6">
                {{ formatCalendarTitle() }}
              </span>
              
              <v-btn 
                icon 
                variant="text" 
                @click="nextMonth"
                :title="calendarView === 'month' ? 'Next Month' : 'Next Week'"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              
              <v-btn 
                variant="text" 
                size="small" 
                class="ml-2"
                @click="goToToday"
              >
                Today
              </v-btn>
            </div>
            
            <v-btn-toggle v-model="calendarView" mandatory>
              <v-btn value="month" size="small">
                <v-icon>mdi-calendar-month</v-icon>
                Month
              </v-btn>
              <v-btn value="week" size="small">
                <v-icon>mdi-calendar-week</v-icon>
                Week
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <v-calendar
              ref="calendar"
              v-model="calendarDate"
              :type="calendarView"
              :events="calendarEvents"
              :event-color="getEventColor"
              @click:event="showEventDetails"
              @click:date="addEventForDate"
              class="mb-4"
            >
              <template v-slot:event="{ event }">
                <div class="pl-1">
                  <div class="d-flex align-center">
                    <v-icon 
                      :color="event.type === 'income' ? 'success' : event.type === 'expense' ? 'error' : 'primary'" 
                      size="small" 
                      class="mr-1"
                    >
                      {{ getEventIcon(event.type) }}
                    </v-icon>
                    <span class="text-caption font-weight-bold">
                      {{ event.type === 'income' ? '+' : '-' }}${{ Math.abs(event.amount).toLocaleString() }}
                    </span>
                  </div>
                  <div class="text-caption text-truncate">
                    {{ event.name }}
                  </div>
                </div>
              </template>
            </v-calendar>
            
            <!-- Calendar Legend -->
            <v-row class="mt-3">
              <v-col cols="12">
                <div class="d-flex flex-wrap gap-3">
                  <v-chip
                    size="small"
                    color="success"
                    variant="outlined"
                    prepend-icon="mdi-trending-up"
                  >
                    Income
                  </v-chip>
                  <v-chip
                    size="small"
                    color="error"
                    variant="outlined"
                    prepend-icon="mdi-trending-down"
                  >
                    Expenses
                  </v-chip>
                  <v-chip
                    size="small"
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-bank-transfer"
                  >
                    Transfers
                  </v-chip>
                  <v-chip
                    size="small"
                    color="info"
                    variant="outlined"
                    prepend-icon="mdi-bucket"
                  >
                    Allocations
                  </v-chip>
                </div>
              </v-col>
            </v-row>
            
            <!-- Calendar Summary for Selected Date -->
            <v-card 
              v-if="selectedDateSummary" 
              variant="outlined" 
              class="mt-4"
            >
              <v-card-subtitle>
                {{ formatSelectedDate() }} Summary
              </v-card-subtitle>
              <v-card-text>
                <v-row>
                  <v-col cols="6" md="3">
                    <div class="text-center">
                      <v-icon color="success" size="large">mdi-trending-up</v-icon>
                      <div class="text-h6 text-success">
                        +${{ selectedDateSummary.income.toLocaleString() }}
                      </div>
                      <div class="text-caption">Income</div>
                    </div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="text-center">
                      <v-icon color="error" size="large">mdi-trending-down</v-icon>
                      <div class="text-h6 text-error">
                        -${{ selectedDateSummary.expenses.toLocaleString() }}
                      </div>
                      <div class="text-caption">Expenses</div>
                    </div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="text-center">
                      <v-icon color="primary" size="large">mdi-bank-transfer</v-icon>
                      <div class="text-h6 text-primary">
                        ${{ selectedDateSummary.transfers.toLocaleString() }}
                      </div>
                      <div class="text-caption">Transfers</div>
                    </div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="text-center">
                      <v-icon 
                        :color="selectedDateSummary.net >= 0 ? 'success' : 'error'" 
                        size="large"
                      >
                        mdi-cash
                      </v-icon>
                      <div 
                        class="text-h6" 
                        :class="selectedDateSummary.net >= 0 ? 'text-success' : 'text-error'"
                      >
                        {{ selectedDateSummary.net >= 0 ? '+' : '' }}${{ selectedDateSummary.net.toLocaleString() }}
                      </div>
                      <div class="text-caption">Net</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Transactions -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-history</v-icon>
            Recent Transactions
            <v-spacer></v-spacer>
            <v-btn small color="primary" @click="showAddTransactionDialog = true">
              <v-icon left small>mdi-plus</v-icon>
              Add Transaction
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="transactionHeaders"
              :items="transactions"
              :loading="loadingTransactions"
              :items-per-page="10"
              class="elevation-0"
            >
              <template v-slot:item.amount="{ item }">
                <span :class="getAmountColor(item)">
                  {{ formatAmount(item) }}
                </span>
              </template>
              
              <template v-slot:item.type="{ item }">
                <v-chip 
                  small 
                  :color="getTypeColor(item.type)"
                  dark
                >
                  {{ item.type.toUpperCase() }}
                </v-chip>
              </template>
              
              <template v-slot:item.status="{ item }">
                <v-chip 
                  small 
                  :color="getStatusColor(item.status)"
                  dark
                >
                  {{ item.status.toUpperCase() }}
                </v-chip>
              </template>
              
              <template v-slot:item.transactionDate="{ item }">
                {{ new Date(item.transactionDate).toLocaleDateString() }}
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-btn icon small @click="viewTransaction(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small @click="editTransaction(item)" v-if="item.status === 'pending'">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              
              <template v-slot:no-data>
                <div class="text-center py-8">
                  <v-icon size="80" color="grey lighten-2">mdi-cash-remove</v-icon>
                  <p class="text-h6 mt-4 text-grey">No transactions yet</p>
                  <v-btn color="primary" @click="showAddTransactionDialog = true">
                    Add Your First Transaction
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Transaction Dialog -->
    <v-dialog v-model="showAddTransactionDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Add New Transaction
        </v-card-title>
        <v-card-text>
          <v-form ref="transactionForm" v-model="transactionFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newTransaction.description"
                  label="Description"
                  :rules="[v => !!v || 'Description is required']"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="newTransaction.amount"
                  label="Amount"
                  type="number"
                  prefix="$"
                  :rules="[v => !!v || 'Amount is required', v => v > 0 || 'Amount must be positive']"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="newTransaction.type"
                  :items="transactionTypes"
                  item-title="text"
                  item-value="value"
                  label="Transaction Type"
                  :rules="[v => !!v || 'Type is required']"
                  required
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="newTransaction.category"
                  :items="getTransactionCategories()"
                  item-title="text"
                  item-value="value"
                  label="Category"
                  :rules="[v => !!v || 'Category is required']"
                  required
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newTransaction.transactionDate"
                  label="Transaction Date"
                  type="date"
                  :rules="[v => !!v || 'Date is required']"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" v-if="newTransaction.type === 'allocation'">
                <v-select
                  v-model="newTransaction.bucketId"
                  :items="bucketItems"
                  label="Target Bucket"
                  :rules="[v => !!v || 'Bucket is required for allocation']"
                ></v-select>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="newTransaction.notes"
                  label="Notes (Optional)"
                  rows="2"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeTransactionDialog">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="addTransaction"
            :disabled="!transactionFormValid"
            :loading="addingTransaction"
          >
            Add Transaction
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Bucket Dialog -->
    <v-dialog v-model="showCreateBucketDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-bucket</v-icon>
          Create New Bucket
        </v-card-title>
        <v-card-text>
          <v-form ref="bucketForm" v-model="bucketFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newBucket.name"
                  label="Bucket Name"
                  :rules="[v => !!v || 'Name is required']"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="newBucket.type"
                  :items="bucketTypes"
                  item-title="text"
                  item-value="value"
                  label="Bucket Type"
                  :rules="[v => !!v || 'Type is required']"
                  required
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="newBucket.targetAmount"
                  label="Target Amount"
                  type="number"
                  prefix="$"
                  :rules="[v => !!v || 'Target amount is required', v => v > 0 || 'Amount must be positive']"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newBucket.targetDate"
                  label="Target Date (Optional)"
                  type="date"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="newBucket.description"
                  label="Description (Optional)"
                  rows="2"
                ></v-textarea>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-slider
                  v-model="newBucket.priority"
                  label="Priority"
                  min="1"
                  max="10"
                  step="1"
                  thumb-label="always"
                ></v-slider>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="newBucket.color"
                  hide-inputs
                  mode="hexa"
                  class="ma-2"
                ></v-color-picker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeBucketDialog">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="createBucket"
            :disabled="!bucketFormValid"
            :loading="creatingBucket"
          >
            Create Bucket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CashFlow',
  emits: ['show-snackbar'],
  data() {
    return {
      // Loading states
      loading: true,
      loadingTransactions: false,
      addingTransaction: false,
      creatingBucket: false,
      
      // Dialog states
      showAddTransactionDialog: false,
      showCreateBucketDialog: false,
      showAllocateFundsDialog: false,
      
      // Form validation
      transactionFormValid: false,
      bucketFormValid: false,
      
      // Data
      summary: {
        totalIncome: 0,
        totalExpenses: 0,
        netCashFlow: 0,
        pendingTransactions: 0
      },
      buckets: [],
      transactions: [],
      
      // Calendar data
      calendarDate: new Date().toISOString().substr(0, 10),
      calendarView: 'month',
      calendarEvents: [],
      selectedDate: null,
      selectedDateSummary: null,
      
      // Form data
      newTransaction: {
        description: '',
        amount: null,
        type: 'income',
        category: '',
        bucketId: null,
        notes: '',
        transactionDate: new Date().toISOString().substr(0, 10)
      },
      
      newBucket: {
        name: '',
        description: '',
        type: 'savings',
        targetAmount: null,
        targetDate: '',
        priority: 5,
        color: '#1976D2'
      },
      
      // Options
      transactionTypes: [
        { text: 'Income', value: 'income' },
        { text: 'Expense', value: 'expense' },
        { text: 'Transfer', value: 'transfer' },
        { text: 'Allocation', value: 'allocation' }
      ],
      
      bucketTypes: [
        { text: 'Emergency Fund', value: 'emergency' },
        { text: 'Savings', value: 'savings' },
        { text: 'Investment', value: 'investment' },
        { text: 'Expense Fund', value: 'expense' },
        { text: 'Project Fund', value: 'project' },
        { text: 'Other', value: 'other' }
      ],
      
      // Table headers
      transactionHeaders: [
        { text: 'Date', value: 'transactionDate', sortable: true },
        { text: 'Description', value: 'description' },
        { text: 'Type', value: 'type' },
        { text: 'Category', value: 'category' },
        { text: 'Amount', value: 'amount', align: 'end' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  
  computed: {
    bucketItems() {
      return this.buckets.map(bucket => ({
        text: bucket.name,
        value: bucket.id
      }))
    }
  },
  
  async mounted() {
    await this.loadData()
  },
  
  methods: {
    async loadData() {
      this.loading = true
      try {
        // Load summary, buckets, and transactions
        // Note: These endpoints would need to be implemented in the backend
        await Promise.all([
          this.loadSummary(),
          this.loadBuckets(),
          this.loadTransactions()
        ])
      } catch (error) {
        console.error('Error loading cash flow data:', error)
        this.$emit('show-snackbar', {
          message: 'Error loading cash flow data',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
      
      // Load calendar events after data is loaded
      this.loadCalendarEvents()
    },
    
    loadCalendarEvents() {
      // Convert transactions to calendar events
      this.calendarEvents = this.transactions.map(transaction => ({
        name: transaction.description,
        start: transaction.transactionDate.split('T')[0],
        end: transaction.transactionDate.split('T')[0],
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        status: transaction.status,
        id: transaction.id,
        timed: false
      }))
      
      // Add bucket target dates as events
      this.buckets.forEach(bucket => {
        if (bucket.targetDate) {
          this.calendarEvents.push({
            name: `${bucket.name} Target`,
            start: bucket.targetDate.split('T')[0],
            end: bucket.targetDate.split('T')[0],
            type: 'bucket-target',
            amount: bucket.targetAmount,
            category: 'bucket',
            status: 'target',
            id: `bucket-${bucket.id}`,
            timed: false
          })
        }
      })
    },
    
    async loadSummary() {
      // Mock data for now - replace with actual API call
      this.summary = {
        totalIncome: 12500.00,
        totalExpenses: 8750.00,
        netCashFlow: 3750.00,
        pendingTransactions: 3
      }
    },
    
    async loadBuckets() {
      // Mock data for now - replace with actual API call
      const getDateOffset = (days) => new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toISOString()
      
      this.buckets = [
        {
          id: '1',
          name: 'Emergency Fund',
          type: 'emergency',
          currentAmount: 2500,
          targetAmount: 10000,
          priority: 9,
          color: '#F44336',
          icon: 'mdi-shield-alert',
          progress: { percentComplete: 25 },
          targetDate: getDateOffset(90)
        },
        {
          id: '2',
          name: 'Vacation Fund',
          type: 'savings',
          currentAmount: 1200,
          targetAmount: 5000,
          priority: 6,
          color: '#4CAF50',
          icon: 'mdi-airplane',
          progress: { percentComplete: 24 },
          targetDate: getDateOffset(180)
        },
        {
          id: '3',
          name: 'Car Maintenance',
          type: 'expense',
          currentAmount: 800,
          targetAmount: 2000,
          priority: 7,
          color: '#FF9800',
          icon: 'mdi-car',
          progress: { percentComplete: 40 },
          targetDate: getDateOffset(60)
        }
      ]
    },
    
    async loadTransactions() {
      this.loadingTransactions = true
      try {
        // Mock data for now - replace with actual API call
        const today = new Date()
        const getDateOffset = (days) => new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toISOString()
        
        this.transactions = [
          {
            id: '1',
            description: 'Monthly Salary',
            amount: 5000,
            type: 'income',
            category: 'salary',
            status: 'completed',
            transactionDate: today.toISOString(),
            bucketId: null
          },
          {
            id: '2',
            description: 'Grocery Shopping',
            amount: 150,
            type: 'expense',
            category: 'groceries',
            status: 'completed',
            transactionDate: getDateOffset(-1),
            bucketId: null
          },
          {
            id: '3',
            description: 'Emergency Fund Allocation',
            amount: 500,
            type: 'allocation',
            category: 'other_income',
            status: 'pending',
            transactionDate: getDateOffset(2),
            bucketId: '1'
          },
          {
            id: '4',
            description: 'Rent Payment',
            amount: 1200,
            type: 'expense',
            category: 'rent',
            status: 'completed',
            transactionDate: getDateOffset(-3),
            bucketId: null
          },
          {
            id: '5',
            description: 'Freelance Project',
            amount: 800,
            type: 'income',
            category: 'business',
            status: 'completed',
            transactionDate: getDateOffset(-5),
            bucketId: null
          },
          {
            id: '6',
            description: 'Vacation Fund Transfer',
            amount: 300,
            type: 'allocation',
            category: 'other_income',
            status: 'pending',
            transactionDate: getDateOffset(7),
            bucketId: '2'
          },
          {
            id: '7',
            description: 'Utility Bills',
            amount: 180,
            type: 'expense',
            category: 'utilities',
            status: 'completed',
            transactionDate: getDateOffset(-2),
            bucketId: null
          },
          {
            id: '8',
            description: 'Investment Dividend',
            amount: 250,
            type: 'income',
            category: 'investment',
            status: 'completed',
            transactionDate: getDateOffset(-7),
            bucketId: null
          }
        ]
      } finally {
        this.loadingTransactions = false
      }
    },
    
    getTransactionCategories() {
      const incomeCategories = [
        { text: 'Salary', value: 'salary' },
        { text: 'Rental Income', value: 'rental_income' },
        { text: 'Investment', value: 'investment' },
        { text: 'Business', value: 'business' },
        { text: 'Gift', value: 'gift' },
        { text: 'Other Income', value: 'other_income' }
      ]
      
      const expenseCategories = [
        { text: 'Rent', value: 'rent' },
        { text: 'Utilities', value: 'utilities' },
        { text: 'Groceries', value: 'groceries' },
        { text: 'Entertainment', value: 'entertainment' },
        { text: 'Transport', value: 'transport' },
        { text: 'Healthcare', value: 'healthcare' },
        { text: 'Insurance', value: 'insurance' },
        { text: 'Debt Payment', value: 'debt_payment' },
        { text: 'Other Expense', value: 'other_expense' }
      ]
      
      if (this.newTransaction.type === 'income' || this.newTransaction.type === 'allocation') {
        return incomeCategories
      } else {
        return expenseCategories
      }
    },
    
    getTotalBucketAmount() {
      return this.buckets.reduce((total, bucket) => total + bucket.currentAmount, 0)
    },
    
    getAmountColor(item) {
      if (item.type === 'income' || item.type === 'allocation') {
        return 'text-success font-weight-bold'
      } else if (item.type === 'expense') {
        return 'text-error font-weight-bold'
      }
      return 'font-weight-bold'
    },
    
    formatAmount(item) {
      const sign = (item.type === 'income' || item.type === 'allocation') ? '+' : '-'
      return `${sign}$${Math.abs(item.amount).toLocaleString()}`
    },
    
    getTypeColor(type) {
      const colors = {
        income: 'success',
        expense: 'error',
        transfer: 'info',
        allocation: 'primary'
      }
      return colors[type] || 'grey'
    },
    
    getStatusColor(status) {
      const colors = {
        completed: 'success',
        pending: 'warning',
        cancelled: 'error',
        failed: 'error'
      }
      return colors[status] || 'grey'
    },
    
    async addTransaction() {
      if (!this.$refs.transactionForm.validate()) return
      
      this.addingTransaction = true
      try {
        // Create transaction object
        const transaction = {
          ...this.newTransaction,
          transactionDate: this.newTransaction.transactionDate || new Date().toISOString(),
          status: 'pending',
          userId: 'mock-user-id' // Replace with actual user ID
        }
        
        // TODO: Replace with actual API call
        // const response = await axios.post('/api/cashflow', transaction)
        
        // For now, just add to local array
        this.transactions.unshift({
          ...transaction,
          id: Date.now().toString()
        })
        
        this.closeTransactionDialog()
        this.$emit('show-snackbar', {
          message: 'Transaction added successfully',
          color: 'success'
        })
        
        // Reload data
        await this.loadData()
      } catch (error) {
        console.error('Error adding transaction:', error)
        this.$emit('show-snackbar', {
          message: 'Error adding transaction',
          color: 'error'
        })
      } finally {
        this.addingTransaction = false
      }
    },
    
    async createBucket() {
      if (!this.$refs.bucketForm.validate()) return
      
      this.creatingBucket = true
      try {
        // Create bucket object
        const bucket = {
          ...this.newBucket,
          ownerId: 'mock-user-id', // Replace with actual user ID
          status: 'active',
          currentAmount: 0
        }
        
        if (bucket.targetDate) {
          bucket.targetDate = new Date(bucket.targetDate)
        }
        
        // TODO: Replace with actual API call
        // const response = await axios.post('/api/buckets', bucket)
        
        // For now, just add to local array
        this.buckets.push({
          ...bucket,
          id: Date.now().toString(),
          progress: { percentComplete: 0 }
        })
        
        this.closeBucketDialog()
        this.$emit('show-snackbar', {
          message: 'Bucket created successfully',
          color: 'success'
        })
      } catch (error) {
        console.error('Error creating bucket:', error)
        this.$emit('show-snackbar', {
          message: 'Error creating bucket',
          color: 'error'
        })
      } finally {
        this.creatingBucket = false
      }
    },
    
    addFundsToBucket(bucket) {
      // Open allocation dialog with bucket pre-selected
      this.newTransaction = {
        description: `Add funds to ${bucket.name}`,
        amount: null,
        type: 'allocation',
        category: 'other_income',
        bucketId: bucket.id,
        notes: '',
        transactionDate: new Date().toISOString().substr(0, 10)
      }
      this.showAddTransactionDialog = true
    },
    
    closeTransactionDialog() {
      this.showAddTransactionDialog = false
      this.newTransaction = {
        description: '',
        amount: null,
        type: 'income',
        category: '',
        bucketId: null,
        notes: '',
        transactionDate: new Date().toISOString().substr(0, 10)
      }
      this.$refs.transactionForm?.resetValidation()
    },
    
    closeBucketDialog() {
      this.showCreateBucketDialog = false
      this.newBucket = {
        name: '',
        description: '',
        type: 'savings',
        targetAmount: null,
        targetDate: '',
        priority: 5,
        color: '#1976D2'
      }
      this.$refs.bucketForm?.resetValidation()
    },
    
    viewTransaction(transaction) {
      // TODO: Implement transaction detail view
      console.log('View transaction:', transaction)
    },
    
    editTransaction(transaction) {
      // TODO: Implement transaction editing
      console.log('Edit transaction:', transaction)
    },
    
    exportData() {
      // TODO: Implement data export functionality
      this.$emit('show-snackbar', {
        message: 'Export functionality coming soon',
        color: 'info'
      })
    },
    
    // Calendar Methods
    getEventColor(event) {
      const colors = {
        income: 'success',
        expense: 'error',
        transfer: 'info',
        allocation: 'primary',
        'bucket-target': 'warning'
      }
      return colors[event.type] || 'grey'
    },
    
    getEventIcon(type) {
      const icons = {
        income: 'mdi-trending-up',
        expense: 'mdi-trending-down',
        transfer: 'mdi-bank-transfer',
        allocation: 'mdi-bucket',
        'bucket-target': 'mdi-flag'
      }
      return icons[type] || 'mdi-cash'
    },
    
    showEventDetails(event) {
      const eventData = event.event
      this.selectedDate = event.date
      this.calculateSelectedDateSummary(event.date)
      
      // Show event details (could be expanded to show a dialog)
      console.log('Event details:', eventData)
      this.$emit('show-snackbar', {
        message: `${eventData.name}: ${eventData.type === 'income' ? '+' : eventData.type === 'expense' ? '-' : ''}$${eventData.amount}`,
        color: this.getEventColor(eventData),
        timeout: 3000
      })
    },
    
    addEventForDate(date) {
      this.selectedDate = date.date
      this.calculateSelectedDateSummary(date.date)
      
      // Pre-fill transaction form with selected date
      this.newTransaction = {
        description: '',
        amount: null,
        type: 'income',
        category: '',
        bucketId: null,
        notes: '',
        transactionDate: date.date
      }
      this.showAddTransactionDialog = true
    },
    
    calculateSelectedDateSummary(date) {
      const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0]
      const dayEvents = this.calendarEvents.filter(event => event.start === dateString)
      
      let income = 0
      let expenses = 0
      let transfers = 0
      let allocations = 0
      
      dayEvents.forEach(event => {
        if (event.type === 'income') {
          income += event.amount
        } else if (event.type === 'expense') {
          expenses += event.amount
        } else if (event.type === 'transfer') {
          transfers += event.amount
        } else if (event.type === 'allocation') {
          allocations += event.amount
        }
      })
      
      this.selectedDateSummary = {
        date: dateString,
        income,
        expenses,
        transfers,
        allocations,
        net: income - expenses
      }
    },
    
    formatSelectedDate() {
      if (!this.selectedDateSummary) return ''
      return new Date(this.selectedDateSummary.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    // Calendar Navigation Methods
    previousMonth() {
      const currentDate = new Date(this.calendarDate)
      if (this.calendarView === 'month') {
        currentDate.setMonth(currentDate.getMonth() - 1)
      } else {
        // For week view, go back one week
        currentDate.setDate(currentDate.getDate() - 7)
      }
      this.calendarDate = currentDate.toISOString().substr(0, 10)
    },
    
    nextMonth() {
      const currentDate = new Date(this.calendarDate)
      if (this.calendarView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + 1)
      } else {
        // For week view, go forward one week
        currentDate.setDate(currentDate.getDate() + 7)
      }
      this.calendarDate = currentDate.toISOString().substr(0, 10)
    },
    
    goToToday() {
      this.calendarDate = new Date().toISOString().substr(0, 10)
    },
    
    formatCalendarTitle() {
      const date = new Date(this.calendarDate)
      if (this.calendarView === 'month') {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      } else {
        // For week view, show the week range
        const startOfWeek = new Date(date)
        const day = startOfWeek.getDay()
        const diff = startOfWeek.getDate() - day
        startOfWeek.setDate(diff)
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} ${startOfWeek.getDate()}-${endOfWeek.getDate()}`
        } else {
          return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        }
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.text-h3 {
  font-weight: 300;
}

.v-progress-linear {
  border-radius: 4px;
}
</style>