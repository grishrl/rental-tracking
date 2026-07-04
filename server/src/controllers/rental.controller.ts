import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { RentalService } from '../services/rental.service';

const rentalPhotoStorageDir = path.resolve(__dirname, '../../../store/rental/photos');

const rentalPhotoStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    fs.mkdirSync(rentalPhotoStorageDir, { recursive: true });
    callback(null, rentalPhotoStorageDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

export const rentalPhotoUpload = multer({
  storage: rentalPhotoStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image files are supported'));
      return;
    }

    callback(null, true);
  },
}).array('photos', 10);

const rentalTenantDocStorageDir = path.resolve(__dirname, '../../../store/rental/tenant-documents');

const rentalTenantDocStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    fs.mkdirSync(rentalTenantDocStorageDir, { recursive: true });
    callback(null, rentalTenantDocStorageDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

export const rentalTenantDocUpload = multer({
  storage: rentalTenantDocStorage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
}).array('documents', 10);

export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const rentals = await this.rentalService.getAllRentals();
      res.json(rentals);
    } catch {
      res.status(500).json({ error: 'Failed to fetch rentals' });
    }
  };

  listLegacy = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location, minPrice, maxPrice, bedrooms, bathrooms, amenities } = req.query;

      if (location || minPrice || maxPrice || bedrooms || bathrooms || amenities) {
        const searchParams: {
          location?: string;
          minPrice?: number;
          maxPrice?: number;
          bedrooms?: number;
          bathrooms?: number;
          amenities?: string[];
        } = {};

        if (location) searchParams.location = location as string;
        if (minPrice) searchParams.minPrice = parseInt(minPrice as string, 10);
        if (maxPrice) searchParams.maxPrice = parseInt(maxPrice as string, 10);
        if (bedrooms) searchParams.bedrooms = parseInt(bedrooms as string, 10);
        if (bathrooms) searchParams.bathrooms = parseInt(bathrooms as string, 10);
        if (amenities) {
          searchParams.amenities = Array.isArray(amenities)
            ? (amenities as string[])
            : [amenities as string];
        }

        const rentals = await this.rentalService.searchRentals(searchParams);
        res.json(rentals);
        return;
      }

      const rentals = await this.rentalService.getAvailableRentals();
      res.json(rentals);
    } catch {
      res.status(500).json({ error: 'Failed to fetch rentals' });
    }
  };

  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const rental = await this.rentalService.getRentalById(req.params.id);
      if (!rental) {
        res.status(404).json({ error: 'Rental not found' });
        return;
      }

      res.json(rental);
    } catch {
      res.status(500).json({ error: 'Failed to fetch rental' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const rental = await this.rentalService.createRental(req.body);
      res.status(201).json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  addTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenant = await this.rentalService.addTenantToRental(req.params.id, {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        status: req.body.status,
      });

      res.status(201).json(tenant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getTenantDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const documents = await this.rentalService.getTenantDocuments(req.params.id, req.params.tenantId);
      res.json(documents);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  uploadTenantDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = (req as Request & { files?: Express.Multer.File[] }).files || [];

      if (!files.length) {
        res.status(400).json({ error: 'At least one document file is required' });
        return;
      }

      const documentType = req.body.documentType || 'other';
      const allowedTypes = new Set(['application', 'lease_agreement', 'lease_modification', 'other']);
      const resolvedType = allowedTypes.has(documentType) ? documentType : 'other';

      const updatedRental = await this.rentalService.addTenantDocuments(
        req.params.id,
        req.params.tenantId,
        files.map((file) => ({
          type: resolvedType,
          originalName: file.originalname,
          fileName: file.filename,
          url: `/api/uploads/rental-docs/${file.filename}`,
        }))
      );

      res.status(201).json(updatedRental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const rental = await this.rentalService.updateRental(req.params.id, req.body);
      if (!rental) {
        res.status(404).json({ error: 'Rental not found' });
        return;
      }

      res.json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  uploadPhotos = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = (req as Request & { files?: Express.Multer.File[] }).files || [];

      if (!files.length) {
        res.status(400).json({ error: 'At least one photo file is required' });
        return;
      }

      const uploadedUrls = files.map((file) => `/api/uploads/rentals/${file.filename}`);
      const rental = await this.rentalService.addRentalPhotos(req.params.id, uploadedUrls);
      res.status(201).json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.rentalService.deleteRental(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Rental not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
