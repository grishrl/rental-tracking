import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';
export declare class RentalController {
    private readonly rentalService;
    constructor(rentalService: RentalService);
    getAll: (_req: Request, res: Response) => Promise<void>;
    listLegacy: (req: Request, res: Response) => Promise<void>;
    get: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=rental.controller.d.ts.map