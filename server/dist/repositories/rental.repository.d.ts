import { IRental } from '../models/rental.model';
import { InMemoryRepository } from './memory.repository';
import { IRentalRepository } from './rental.repository.interface';
export declare class RentalRepository extends InMemoryRepository<IRental> implements IRentalRepository {
    constructor();
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
//# sourceMappingURL=rental.repository.d.ts.map