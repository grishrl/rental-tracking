import { Request, Response } from 'express';
import { CashFlowService } from '../services/cashflow.service';
export declare class CashFlowController {
    private readonly cashFlowService;
    constructor(cashFlowService: CashFlowService);
    getAll: (req: Request, res: Response) => Promise<void>;
    get: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=cashflow.controller.d.ts.map