import { IRental, Rental } from '../models/rental.model';
import { IRentalRepository } from '../repositories/rental.repository.interface';

export class RentalService {
  constructor(private rentalRepository: IRentalRepository) {}

  async getAllRentals(): Promise<IRental[]> {
    return this.rentalRepository.findAll();
  }

  async getAvailableRentals(): Promise<IRental[]> {
    return this.rentalRepository.findAvailable();
  }

  async getRentalById(id: string): Promise<IRental | null> {
    return this.rentalRepository.findById(id);
  }

  async createRental(rentalData: Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>): Promise<IRental> {
    // Validate rental data
    this.validateRentalData(rentalData);
    
    return this.rentalRepository.create(rentalData);
  }

  async updateRental(id: string, updates: Partial<Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IRental | null> {
    const existingRental = await this.rentalRepository.findById(id);
    if (!existingRental) {
      throw new Error(`Rental with id ${id} not found`);
    }

    return this.rentalRepository.update(id, updates);
  }

  async deleteRental(id: string): Promise<boolean> {
    const existingRental = await this.rentalRepository.findById(id);
    if (!existingRental) {
      throw new Error(`Rental with id ${id} not found`);
    }

    return this.rentalRepository.delete(id);
  }

  async searchRentals(searchParams: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
  }): Promise<IRental[]> {
    return this.rentalRepository.searchRentals(searchParams);
  }

  async getRentalsByLocation(location: string): Promise<IRental[]> {
    return this.rentalRepository.findByLocation(location);
  }

  async getRentalsByOwner(ownerId: string): Promise<IRental[]> {
    return this.rentalRepository.findByOwner(ownerId);
  }

  async getRentalsByPriceRange(minPrice: number, maxPrice: number): Promise<IRental[]> {
    return this.rentalRepository.findByPriceRange(minPrice, maxPrice);
  }

  private validateRentalData(data: Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Rental title is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new Error('Rental description is required');
    }

    if (!data.price || data.price <= 0) {
      throw new Error('Rental price must be greater than 0');
    }

    if (!data.location || data.location.trim().length === 0) {
      throw new Error('Rental location is required');
    }

    if (!data.ownerId || data.ownerId.trim().length === 0) {
      throw new Error('Owner ID is required');
    }

    if (data.bedrooms !== undefined && data.bedrooms < 0) {
      throw new Error('Number of bedrooms cannot be negative');
    }

    if (data.bathrooms !== undefined && data.bathrooms < 0) {
      throw new Error('Number of bathrooms cannot be negative');
    }

    if (data.squareFootage !== undefined && data.squareFootage <= 0) {
      throw new Error('Square footage must be greater than 0');
    }
  }
}