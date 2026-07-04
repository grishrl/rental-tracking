import { Request, Response } from 'express';
import { CashFlowService } from '../services/cashflow.service';

export class CashFlowController {
  constructor(private readonly cashFlowService: CashFlowService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string | undefined;
      if (!userId) {
        res.status(400).json({ error: 'userId query parameter is required' });
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

      const transactions = await this.cashFlowService.getUserTransactions(userId, limit, offset);
      res.json(transactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string | undefined;
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
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const transaction = await this.cashFlowService.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const transaction = await this.cashFlowService.updateTransaction(req.params.id, req.body);
      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.cashFlowService.deleteTransaction(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
