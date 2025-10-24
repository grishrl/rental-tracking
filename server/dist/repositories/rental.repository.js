"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRepository = void 0;
const memory_repository_1 = require("./memory.repository");
class RentalRepository extends memory_repository_1.InMemoryRepository {
    constructor() {
        super('rentals');
    }
    async findAvailable() {
        return this.findBy({ isAvailable: true });
    }
    async findByLocation(location) {
        return this.findBy({ location });
    }
    async findByPriceRange(minPrice, maxPrice) {
        const allRentals = await this.findAll();
        return allRentals.filter(rental => rental.price >= minPrice && rental.price <= maxPrice);
    }
    async findByOwner(ownerId) {
        return this.findBy({ ownerId });
    }
    async searchRentals(searchParams) {
        let results = await this.findAll();
        if (searchParams.location) {
            results = results.filter(rental => rental.location.toLowerCase().includes(searchParams.location.toLowerCase()) ||
                (rental.address && rental.address.toLowerCase().includes(searchParams.location.toLowerCase())));
        }
        if (searchParams.minPrice !== undefined) {
            results = results.filter(rental => rental.price >= searchParams.minPrice);
        }
        if (searchParams.maxPrice !== undefined) {
            results = results.filter(rental => rental.price <= searchParams.maxPrice);
        }
        if (searchParams.bedrooms !== undefined) {
            results = results.filter(rental => rental.bedrooms === searchParams.bedrooms);
        }
        if (searchParams.bathrooms !== undefined) {
            results = results.filter(rental => rental.bathrooms === searchParams.bathrooms);
        }
        if (searchParams.amenities && searchParams.amenities.length > 0) {
            results = results.filter(rental => rental.amenities && searchParams.amenities.every(amenity => rental.amenities.includes(amenity)));
        }
        return results.filter(rental => rental.isAvailable);
    }
}
exports.RentalRepository = RentalRepository;
//# sourceMappingURL=rental.repository.js.map