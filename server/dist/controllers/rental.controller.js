"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalController = void 0;
class RentalController {
    constructor(rentalService) {
        this.rentalService = rentalService;
        this.getAll = async (_req, res) => {
            try {
                const rentals = await this.rentalService.getAllRentals();
                res.json(rentals);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch rentals' });
            }
        };
        this.listLegacy = async (req, res) => {
            try {
                const { location, minPrice, maxPrice, bedrooms, bathrooms, amenities } = req.query;
                if (location || minPrice || maxPrice || bedrooms || bathrooms || amenities) {
                    const searchParams = {};
                    if (location)
                        searchParams.location = location;
                    if (minPrice)
                        searchParams.minPrice = parseInt(minPrice, 10);
                    if (maxPrice)
                        searchParams.maxPrice = parseInt(maxPrice, 10);
                    if (bedrooms)
                        searchParams.bedrooms = parseInt(bedrooms, 10);
                    if (bathrooms)
                        searchParams.bathrooms = parseInt(bathrooms, 10);
                    if (amenities) {
                        searchParams.amenities = Array.isArray(amenities)
                            ? amenities
                            : [amenities];
                    }
                    const rentals = await this.rentalService.searchRentals(searchParams);
                    res.json(rentals);
                    return;
                }
                const rentals = await this.rentalService.getAvailableRentals();
                res.json(rentals);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch rentals' });
            }
        };
        this.get = async (req, res) => {
            try {
                const rental = await this.rentalService.getRentalById(req.params.id);
                if (!rental) {
                    res.status(404).json({ error: 'Rental not found' });
                    return;
                }
                res.json(rental);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch rental' });
            }
        };
        this.create = async (req, res) => {
            try {
                const rental = await this.rentalService.createRental(req.body);
                res.status(201).json(rental);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const rental = await this.rentalService.updateRental(req.params.id, req.body);
                if (!rental) {
                    res.status(404).json({ error: 'Rental not found' });
                    return;
                }
                res.json(rental);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await this.rentalService.deleteRental(req.params.id);
                if (!deleted) {
                    res.status(404).json({ error: 'Rental not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}
exports.RentalController = RentalController;
//# sourceMappingURL=rental.controller.js.map