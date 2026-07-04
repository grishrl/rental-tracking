"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalFileRepository = void 0;
const store_backed_repository_1 = require("../store-backed.repository");
class RentalFileRepository extends store_backed_repository_1.StoreBackedRepository {
    constructor(store) {
        super(store);
    }
    async findAvailable() {
        return this.findBy({ isAvailable: true });
    }
    async findByLocation(location) {
        return this.findBy({ location });
    }
    async findByPriceRange(minPrice, maxPrice) {
        const allRentals = await this.findAll();
        return allRentals.filter((rental) => rental.price >= minPrice && rental.price <= maxPrice);
    }
    async findByOwner(ownerId) {
        return this.findBy({ ownerId });
    }
    async searchRentals(searchParams) {
        let results = await this.findAll();
        if (searchParams.location) {
            const location = searchParams.location.toLowerCase();
            results = results.filter((rental) => rental.location.toLowerCase().includes(location) ||
                (rental.address ? rental.address.toLowerCase().includes(location) : false));
        }
        if (searchParams.minPrice !== undefined) {
            results = results.filter((rental) => rental.price >= searchParams.minPrice);
        }
        if (searchParams.maxPrice !== undefined) {
            results = results.filter((rental) => rental.price <= searchParams.maxPrice);
        }
        if (searchParams.bedrooms !== undefined) {
            results = results.filter((rental) => rental.bedrooms === searchParams.bedrooms);
        }
        if (searchParams.bathrooms !== undefined) {
            results = results.filter((rental) => rental.bathrooms === searchParams.bathrooms);
        }
        if (searchParams.amenities && searchParams.amenities.length > 0) {
            results = results.filter((rental) => Array.isArray(rental.amenities) &&
                searchParams.amenities.every((amenity) => rental.amenities.includes(amenity)));
        }
        return results.filter((rental) => rental.isAvailable);
    }
}
exports.RentalFileRepository = RentalFileRepository;
//# sourceMappingURL=rental.file.repository.js.map