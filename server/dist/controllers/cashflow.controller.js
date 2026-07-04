"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowController = exports.cashFlowAttachmentUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const multer_1 = __importDefault(require("multer"));
const attachmentStorageDir = path_1.default.resolve(__dirname, '../../../store/cashflow/attachments');
const allowedFileTypes = new Set(['application/pdf']);
const attachmentStorage = multer_1.default.diskStorage({
    destination: (_req, _file, callback) => {
        fs_1.default.mkdirSync(attachmentStorageDir, { recursive: true });
        callback(null, attachmentStorageDir);
    },
    filename: (_req, file, callback) => {
        const extension = path_1.default.extname(file.originalname);
        callback(null, `${Date.now()}-${(0, crypto_1.randomUUID)()}${extension}`);
    },
});
exports.cashFlowAttachmentUpload = (0, multer_1.default)({
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
class CashFlowController {
    constructor(cashFlowService) {
        this.cashFlowService = cashFlowService;
        this.getAll = async (req, res) => {
            try {
                const userId = req.query.userId;
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
                const offset = req.query.offset ? parseInt(req.query.offset, 10) : undefined;
                const transactions = userId
                    ? await this.cashFlowService.getUserTransactions(userId, limit, offset)
                    : await this.cashFlowService.getAllTransactions(limit, offset);
                res.json(transactions);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.get = async (req, res) => {
            try {
                const userId = req.query.userId;
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
        this.attachFile = async (req, res) => {
            try {
                const uploadedFile = req.file;
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