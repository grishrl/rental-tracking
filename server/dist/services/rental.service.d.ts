import { IRental } from '../models/rental.model';
import { IRentalRepository } from '../repositories/rental.repository.interface';
export declare class RentalService {
    private rentalRepository;
    constructor(rentalRepository: IRentalRepository);
    getAllRentals(): Promise<IRental[]>;
    getAvailableRentals(): Promise<IRental[]>;
    getRentalById(id: string): Promise<IRental | null>;
    createRental(rentalData: Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>): Promise<IRental>;
    updateRental(id: string, updates: Partial<Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IRental | null>;
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
    private validateRentalData;
}
//# sourceMappingURL=rental.service.d.ts.map