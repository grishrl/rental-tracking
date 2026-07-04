"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalController = exports.rentalTenantDocUpload = exports.rentalPhotoUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const multer_1 = __importDefault(require("multer"));
const rentalPhotoStorageDir = path_1.default.resolve(__dirname, '../../../store/rental/photos');
const rentalPhotoStorage = multer_1.default.diskStorage({
    destination: (_req, _file, callback) => {
        fs_1.default.mkdirSync(rentalPhotoStorageDir, { recursive: true });
        callback(null, rentalPhotoStorageDir);
    },
    filename: (_req, file, callback) => {
        const extension = path_1.default.extname(file.originalname);
        callback(null, `${Date.now()}-${(0, crypto_1.randomUUID)()}${extension}`);
    },
});
exports.rentalPhotoUpload = (0, multer_1.default)({
    storage: rentalPhotoStorage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            callback(new Error('Only image files are supported'));
            return;
        }
        callback(null, true);
    },
}).array('photos', 10);
const rentalTenantDocStorageDir = path_1.default.resolve(__dirname, '../../../store/rental/tenant-documents');
const rentalTenantDocStorage = multer_1.default.diskStorage({
    destination: (_req, _file, callback) => {
        fs_1.default.mkdirSync(rentalTenantDocStorageDir, { recursive: true });
        callback(null, rentalTenantDocStorageDir);
    },
    filename: (_req, file, callback) => {
        const extension = path_1.default.extname(file.originalname);
        callback(null, `${Date.now()}-${(0, crypto_1.randomUUID)()}${extension}`);
    },
});
exports.rentalTenantDocUpload = (0, multer_1.default)({
    storage: rentalTenantDocStorage,
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
}).array('documents', 10);
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
        this.addTenant = async (req, res) => {
            try {
                const tenant = await this.rentalService.addTenantToRental(req.params.id, {
                    name: req.body.name,
                    phoneNumber: req.body.phoneNumber,
                    startDate: new Date(req.body.startDate),
                    endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
                    status: req.body.status,
                });
                res.status(201).json(tenant);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.getTenantDocuments = async (req, res) => {
            try {
                const documents = await this.rentalService.getTenantDocuments(req.params.id, req.params.tenantId);
                res.json(documents);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.uploadTenantDocuments = async (req, res) => {
            try {
                const files = req.files || [];
                if (!files.length) {
                    res.status(400).json({ error: 'At least one document file is required' });
                    return;
                }
                const documentType = req.body.documentType || 'other';
                const allowedTypes = new Set(['application', 'lease_agreement', 'lease_modification', 'other']);
                const resolvedType = allowedTypes.has(documentType) ? documentType : 'other';
                const updatedRental = await this.rentalService.addTenantDocuments(req.params.id, req.params.tenantId, files.map((file) => ({
                    type: resolvedType,
                    originalName: file.originalname,
                    fileName: file.filename,
                    url: `/api/uploads/rental-docs/${file.filename}`,
                })));
                res.status(201).json(updatedRental);
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
        this.uploadPhotos = async (req, res) => {
            try {
                const files = req.files || [];
                if (!files.length) {
                    res.status(400).json({ error: 'At least one photo file is required' });
                    return;
                }
                const uploadedUrls = files.map((file) => `/api/uploads/rentals/${file.filename}`);
                const rental = await this.rentalService.addRentalPhotos(req.params.id, uploadedUrls);
                res.status(201).json(rental);
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