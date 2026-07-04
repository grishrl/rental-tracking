import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';

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
