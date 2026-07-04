import { randomUUID } from 'crypto';
import {
  IRental,
  IRentalTenant,
  IRentalTenantDocument,
  Rental,
} from '../models/rental.model';
import { IRentalRepository } from '../repositories/rental.repository.interface';

export interface AddRentalTenantInput {
  name: string;
  phoneNumber: string;
  startDate: Date;
  endDate?: Date;
  status?: 'current' | 'past';
}

export interface AddRentalTenantDocumentInput {
  type: 'application' | 'lease_agreement' | 'lease_modification' | 'other';
  originalName: string;
  fileName: string;
  url: string;
}

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

  async addRentalPhotos(id: string, photoUrls: string[]): Promise<IRental> {
    const existingRental = await this.rentalRepository.findById(id);
    if (!existingRental) {
      throw new Error(`Rental with id ${id} not found`);
    }

    const nextImages = [...(existingRental.images || []), ...photoUrls];
    const updatedRental = await this.rentalRepository.update(id, {
      images: nextImages,
    });

    if (!updatedRental) {
      throw new Error(`Failed to update rental photos for id ${id}`);
    }

    return updatedRental;
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

  async addTenantToRental(rentalId: string, input: AddRentalTenantInput): Promise<IRental> {
    const rental = await this.rentalRepository.findById(rentalId);
    if (!rental) {
      throw new Error(`Rental with id ${rentalId} not found`);
    }

    if (!input.name?.trim()) {
      throw new Error('Tenant name is required');
    }

    if (!input.phoneNumber?.trim()) {
      throw new Error('Tenant phone number is required');
    }

    if (!input.startDate) {
      throw new Error('Tenant start date is required');
    }

    const status: 'current' | 'past' = input.endDate ? 'past' : input.status || 'current';

    const nextTenant: IRentalTenant = {
      id: randomUUID(),
      name: input.name.trim(),
      phoneNumber: input.phoneNumber.trim(),
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      status,
      documents: [],
    };

    const updated = await this.rentalRepository.update(rentalId, {
      tenants: [...(rental.tenants || []), nextTenant],
    });

    if (!updated) {
      throw new Error('Failed to add tenant to rental');
    }

    return updated;
  }

  async addTenantDocuments(
    rentalId: string,
    tenantId: string,
    docs: AddRentalTenantDocumentInput[]
  ): Promise<IRental> {
    const rental = await this.rentalRepository.findById(rentalId);
    if (!rental) {
      throw new Error(`Rental with id ${rentalId} not found`);
    }

    const tenant = (rental.tenants || []).find((item) => item.id === tenantId);
    if (!tenant) {
      throw new Error('Tenant not found on this rental');
    }

    const nextDocs: IRentalTenantDocument[] = docs.map((doc) => ({
      id: randomUUID(),
      type: doc.type,
      originalName: doc.originalName,
      fileName: doc.fileName,
      url: doc.url,
      uploadedAt: new Date(),
    }));

    const updatedTenants = (rental.tenants || []).map((item) => {
      if (item.id !== tenantId) {
        return item;
      }

      return {
        ...item,
        documents: [...(item.documents || []), ...nextDocs],
      };
    });

    const updated = await this.rentalRepository.update(rentalId, {
      tenants: updatedTenants,
    });

    if (!updated) {
      throw new Error('Failed to add tenant documents');
    }

    return updated;
  }

  async getTenantDocuments(rentalId: string, tenantId: string): Promise<IRentalTenantDocument[]> {
    const rental = await this.rentalRepository.findById(rentalId);
    if (!rental) {
      throw new Error(`Rental with id ${rentalId} not found`);
    }

    const tenant = (rental.tenants || []).find((item) => item.id === tenantId);
    if (!tenant) {
      throw new Error('Tenant not found on this rental');
    }

    return tenant.documents || [];
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