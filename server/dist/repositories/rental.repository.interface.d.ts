import { IRepository } from '../interfaces/repository.interface';
import { IRental } from '../models/rental.model';
export interface IRentalRepository extends IRepository<IRental> {
    findAvailable(): Promise<IRental[]>;
    findByLocation(location: string): Promise<IRental[]>;
    findByPriceRange(minPrice: number, maxPrice: number): Promise<IRental[]>;
    findByOwner(ownerId: string): Promise<IRental[]>;
    searchRentals(searchParams: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        bedrooms?: number;
        bathrooms?: number;
        amenities?: string[];
    }): Promise<IRental[]>;
}
//# sourceMappingURL=rental.repository.interface.d.ts.map