import { Request, Response } from 'express';
import { BucketService } from '../services/bucket.service';
export declare class BucketController {
    private readonly bucketService;
    constructor(bucketService: BucketService);
    getAll: (req: Request, res: Response) => Promise<void>;
    get: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=bucket.controller.d.ts.map