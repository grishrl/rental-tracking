import { IRental } from '../../models/rental.model';
import { IModelStore } from '../../interfaces/store.interface';
import { StoreBackedRepository } from '../store-backed.repository';
import { IRentalRepository } from '../rental.repository.interface';
export declare class RentalFileRepository extends StoreBackedRepository<IRental> implements IRentalRepository {
    constructor(store: IModelStore<IRental>);
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
//# sourceMappingURL=rental.file.repository.d.ts.map