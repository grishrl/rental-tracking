import { IRental, IRentalTenantDocument } from '../models/rental.model';
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
export declare class RentalService {
    private rentalRepository;
    constructor(rentalRepository: IRentalRepository);
    getAllRentals(): Promise<IRental[]>;
    getAvailableRentals(): Promise<IRental[]>;
    getRentalById(id: string): Promise<IRental | null>;
    createRental(rentalData: Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>): Promise<IRental>;
    updateRental(id: string, updates: Partial<Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IRental | null>;
    addRentalPhotos(id: string, photoUrls: string[]): Promise<IRental>;
    deleteRental(id: string): Promise<boolean>;
    searchRentals(searchParams: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        bedrooms?: number;
        bathrooms?: number;
        amenities?: string[];
    }): Promise<IRental[]>;
    getRentalsByLocation(location: string): Promise<IRental[]>;
    getRentalsByOwner(ownerId: string): Promise<IRental[]>;
    getRentalsByPriceRange(minPrice: number, maxPrice: number): Promise<IRental[]>;
    addTenantToRental(rentalId: string, input: AddRentalTenantInput): Promise<IRental>;
    addTenantDocuments(rentalId: string, tenantId: string, docs: AddRentalTenantDocumentInput[]): Promise<IRental>;
    getTenantDocuments(rentalId: string, tenantId: string): Promise<IRentalTenantDocument[]>;
    private validateRentalData;
}
//# sourceMappingURL=rental.service.d.ts.map