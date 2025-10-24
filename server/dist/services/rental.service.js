"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalService = void 0;
class RentalService {
    constructor(rentalRepository) {
        this.rentalRepository = rentalRepository;
    }
    async getAllRentals() {
        return this.rentalRepository.findAll();
    }
    async getAvailableRentals() {
        return this.rentalRepository.findAvailable();
    }
    async getRentalById(id) {
        return this.rentalRepository.findById(id);
    }
    async createRental(rentalData) {
        // Validate rental data
        this.validateRentalData(rentalData);
        return this.rentalRepository.create(rentalData);
    }
    async updateRental(id, updates) {
        const existingRental = await this.rentalRepository.findById(id);
        if (!existingRental) {
            throw new Error(`Rental with id ${id} not found`);
        }
        return this.rentalRepository.update(id, updates);
    }
    async deleteRental(id) {
        const existingRental = await this.rentalRepository.findById(id);
        if (!existingRental) {
            throw new Error(`Rental with id ${id} not found`);
        }
        return this.rentalRepository.delete(id);
    }
    async searchRentals(searchParams) {
        return this.rentalRepository.searchRentals(searchParams);
    }
    async getRentalsByLocation(location) {
        return this.rentalRepository.findByLocation(location);
    }
    async getRentalsByOwner(ownerId) {
        return this.rentalRepository.findByOwner(ownerId);
    }
    async getRentalsByPriceRange(minPrice, maxPrice) {
        return this.rentalRepository.findByPriceRange(minPrice, maxPrice);
    }
    validateRentalData(data) {
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
exports.RentalService = RentalService;
//# sourceMappingURL=rental.service.js.map