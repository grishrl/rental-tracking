import { Request, Response } from 'express';
import { RenterService } from '../services/renter.service';
export declare class RenterController {
    private readonly renterService;
    constructor(renterService: RenterService);
    getAll: (_req: Request, res: Response) => Promise<void>;
    listLegacy: (req: Request, res: Response) => Promise<void>;
    get: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
    getSummary: (_req: Request, res: Response) => Promise<void>;
    getCurrent: (_req: Request, res: Response) => Promise<void>;
    getProspective: (_req: Request, res: Response) => Promise<void>;
    getLeasesExpiring: (req: Request, res: Response) => Promise<void>;
    getFollowUp: (_req: Request, res: Response) => Promise<void>;
    assignRental: (req: Request, res: Response) => Promise<void>;
    endLease: (req: Request, res: Response) => Promise<void>;
    processApplication: (req: Request, res: Response) => Promise<void>;
    evaluateApplication: (req: Request, res: Response) => Promise<void>;
    addCommunication: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=renter.controller.d.ts.map