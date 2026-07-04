import { IRental } from '../../models/rental.model';
import { IModelStore } from '../../interfaces/store.interface';
import { StoreBackedRepository } from '../store-backed.repository';
import { IRentalRepository } from '../rental.repository.interface';

export class RentalFileRepository extends StoreBackedRepository<IRental> implements IRentalRepository {
  constructor(store: IModelStore<IRental>) {
    super(store);
  }

  async findAvailable(): Promise<IRental[]> {
    return this.findBy({ isAvailable: true } as Partial<IRental>);
  }

  async findByLocation(location: string): Promise<IRental[]> {
    return this.findBy({ location } as Partial<IRental>);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<IRental[]> {
    const allRentals = await this.findAll();
    return allRentals.filter((rental) => rental.price >= minPrice && rental.price <= maxPrice);
  }

  async findByOwner(ownerId: string): Promise<IRental[]> {
    return this.findBy({ ownerId } as Partial<IRental>);
  }

  async searchRentals(searchParams: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
  }): Promise<IRental[]> {
    let results = await this.findAll();

    if (searchParams.location) {
      const location = searchParams.location.toLowerCase();
      results = results.filter(
        (rental) =>
          rental.location.toLowerCase().includes(location) ||
          (rental.address ? rental.address.toLowerCase().includes(location) : false)
      );
    }

    if (searchParams.minPrice !== undefined) {
      results = results.filter((rental) => rental.price >= searchParams.minPrice!);
    }

    if (searchParams.maxPrice !== undefined) {
      results = results.filter((rental) => rental.price <= searchParams.maxPrice!);
    }

    if (searchParams.bedrooms !== undefined) {
      results = results.filter((rental) => rental.bedrooms === searchParams.bedrooms);
    }

    if (searchParams.bathrooms !== undefined) {
      results = results.filter((rental) => rental.bathrooms === searchParams.bathrooms);
    }

    if (searchParams.amenities && searchParams.amenities.length > 0) {
      results = results.filter(
        (rental) =>
          Array.isArray(rental.amenities) &&
          searchParams.amenities!.every((amenity) => rental.amenities!.includes(amenity))
      );
    }

    return results.filter((rental) => rental.isAvailable);
  }
}
