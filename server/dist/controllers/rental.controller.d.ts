import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';
export declare const rentalPhotoUpload: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const rentalTenantDocUpload: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare class RentalController {
    private readonly rentalService;
    constructor(rentalService: RentalService);
    getAll: (_req: Request, res: Response) => Promise<void>;
    listLegacy: (req: Request, res: Response) => Promise<void>;
    get: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    addTenant: (req: Request, res: Response) => Promise<void>;
    getTenantDocuments: (req: Request, res: Response) => Promise<void>;
    uploadTenantDocuments: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    uploadPhotos: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=rental.controller.d.ts.map