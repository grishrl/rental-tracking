"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rental = void 0;
class Rental {
    constructor(data) {
        this.id = this.generateId();
        this.title = data.title;
        this.description = data.description;
        this.price = data.price;
        this.location = data.location;
        this.address = data.address;
        this.bedrooms = data.bedrooms;
        this.bathrooms = data.bathrooms;
        this.squareFootage = data.squareFootage;
        this.amenities = data.amenities || [];
        this.images = data.images || [];
        this.ownerId = data.ownerId;
        this.isAvailable = data.isAvailable;
        this.availableFrom = data.availableFrom;
        this.leaseDuration = data.leaseDuration;
        this.petPolicy = data.petPolicy;
        this.utilities = data.utilities;
        this.tenants = data.tenants || [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    updateTimestamp() {
        this.updatedAt = new Date();
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            price: this.price,
            location: this.location,
            address: this.address,
            bedrooms: this.bedrooms,
            bathrooms: this.bathrooms,
            squareFootage: this.squareFootage,
            amenities: this.amenities,
            images: this.images,
            ownerId: this.ownerId,
            isAvailable: this.isAvailable,
            availableFrom: this.availableFrom,
            leaseDuration: this.leaseDuration,
            petPolicy: this.petPolicy,
            utilities: this.utilities,
            tenants: this.tenants,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.Rental = Rental;
//# sourceMappingURL=rental.model.js.map