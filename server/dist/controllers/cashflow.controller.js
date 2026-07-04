"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowController = void 0;
class CashFlowController {
    constructor(cashFlowService) {
        this.cashFlowService = cashFlowService;
        this.getAll = async (req, res) => {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    res.status(400).json({ error: 'userId query parameter is required' });
                    return;
                }
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
                const offset = req.query.offset ? parseInt(req.query.offset, 10) : undefined;
                const transactions = await this.cashFlowService.getUserTransactions(userId, limit, offset);
                res.json(transactions);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.get = async (req, res) => {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    res.status(400).json({ error: 'userId query parameter is required' });
                    return;
                }
                const transactions = await this.cashFlowService.getUserTransactions(userId);
                const transaction = transactions.find((item) => item.id === req.params.id);
                if (!transaction) {
                    res.status(404).json({ error: 'Transaction not found' });
                    return;
                }
                res.json(transaction);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.create = async (req, res) => {
            try {
                const transaction = await this.cashFlowService.createTransaction(req.body);
                res.status(201).json(transaction);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const transaction = await this.cashFlowService.updateTransaction(req.params.id, req.body);
                if (!transaction) {
                    res.status(404).json({ error: 'Transaction not found' });
                    return;
                }
                res.json(transaction);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await this.cashFlowService.deleteTransaction(req.params.id);
                if (!deleted) {
                    res.status(404).json({ error: 'Transaction not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}
exports.CashFlowController = CashFlowController;
//# sourceMappingURL=cashflow.controller.js.map