import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { CashFlowService } from '../services/cashflow.service';

const attachmentStorageDir = path.resolve(__dirname, '../../../store/cashflow/attachments');
const allowedFileTypes = new Set(['application/pdf']);

const attachmentStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    fs.mkdirSync(attachmentStorageDir, { recursive: true });
    callback(null, attachmentStorageDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

export const cashFlowAttachmentUpload = multer({
  storage: attachmentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const isImage = file.mimetype.startsWith('image/');
    const isPdf = allowedFileTypes.has(file.mimetype);

    if (!isImage && !isPdf) {
      callback(new Error('Only images and PDF files are supported'));
      return;
    }

    callback(null, true);
  },
}).single('file');

export class CashFlowController {
  constructor(private readonly cashFlowService: CashFlowService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string | undefined;

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

      const transactions = userId
        ? await this.cashFlowService.getUserTransactions(userId, limit, offset)
        : await this.cashFlowService.getAllTransactions(limit, offset);

      res.json(transactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string | undefined;
      const transaction = await this.cashFlowService.getTransactionById(req.params.id);

      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      if (userId && transaction.userId !== userId) {
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

  attachFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;

      if (!uploadedFile) {
        res.status(400).json({ error: 'Attachment file is required' });
        return;
      }

      const updatedTransaction = await this.cashFlowService.attachFileToTransaction(req.params.id, {
        fileName: uploadedFile.filename,
        originalName: uploadedFile.originalname,
        mimeType: uploadedFile.mimetype,
        size: uploadedFile.size,
        url: `/api/uploads/transactions/${uploadedFile.filename}`,
      });

      res.status(201).json(updatedTransaction);
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
