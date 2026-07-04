"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const container_1 = require("./container/container");
const domain_routes_1 = require("./routes/domain.routes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let rentalService;
let userService;
let renterService;
let bucketService;
let cashFlowService;
// Seed some sample data
const seedData = async () => {
    try {
        // Create sample users
        const landlord = await userService.createUser({
            email: 'landlord@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'landlord',
            isActive: true,
            phoneNumber: '+1-555-0123'
        });
        const tenant = await userService.createUser({
            email: 'tenant@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'tenant',
            isActive: true,
            phoneNumber: '+1-555-0124'
        });
        // Create sample rentals
        await rentalService.createRental({
            title: 'Cozy Downtown Apartment',
            description: 'Beautiful 2-bedroom apartment in the heart of the city with modern amenities and great views.',
            price: 1200,
            location: 'Downtown',
            address: '123 Main St, Downtown',
            bedrooms: 2,
            bathrooms: 1,
            squareFootage: 850,
            amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Gym'],
            images: ['https://via.placeholder.com/300x200'],
            ownerId: landlord.id,
            isAvailable: true,
            availableFrom: new Date(),
            leaseDuration: 12,
            petPolicy: 'deposit-required',
            utilities: {
                electricity: true,
                water: true,
                gas: false,
                internet: true,
                cable: false
            }
        });
        await rentalService.createRental({
            title: 'Suburban Family Home',
            description: 'Spacious 3-bedroom house with garden, perfect for families.',
            price: 1800,
            location: 'Suburbs',
            address: '456 Oak Ave, Suburbia',
            bedrooms: 3,
            bathrooms: 2,
            squareFootage: 1200,
            amenities: ['Garden', 'Garage', 'Fireplace', 'Laundry'],
            images: ['https://via.placeholder.com/300x200'],
            ownerId: landlord.id,
            isAvailable: true,
            availableFrom: new Date(),
            leaseDuration: 12,
            petPolicy: 'allowed',
            utilities: {
                electricity: true,
                water: true,
                gas: true,
                internet: false,
                cable: false
            }
        });
        await rentalService.createRental({
            title: 'Modern Studio Loft',
            description: 'Contemporary studio with city views and modern appliances.',
            price: 900,
            location: 'City Center',
            address: '789 High St, City Center',
            bedrooms: 0,
            bathrooms: 1,
            squareFootage: 500,
            amenities: ['City View', 'Modern Kitchen', 'WiFi', 'Security'],
            images: ['https://via.placeholder.com/300x200'],
            ownerId: landlord.id,
            isAvailable: true,
            availableFrom: new Date(),
            leaseDuration: 6,
            petPolicy: 'not-allowed',
            utilities: {
                electricity: true,
                water: true,
                gas: false,
                internet: true,
                cable: true
            }
        });
        // Create sample renters
        const prospectiveRenter = await renterService.createRenter({
            firstName: 'Alice',
            lastName: 'Johnson',
            dateOfBirth: new Date('1990-05-15'),
            email: 'alice.johnson@example.com',
            phoneNumber: '+1-555-0125',
            currentAddress: {
                street: '456 Oak Street',
                city: 'Current City',
                state: 'CA',
                zipCode: '90210',
                country: 'USA'
            },
            status: 'prospective',
            applicationStatus: 'pending',
            applicationDate: new Date(),
            totalMonthlyIncome: 4500,
            currentEmployment: {
                employerName: 'Tech Corp',
                position: 'Software Developer',
                type: 'full-time',
                monthlyIncome: 4500,
                startDate: new Date('2022-01-15'),
                isCurrentJob: true
            },
            emergencyContacts: [
                {
                    name: 'Bob Johnson',
                    relationship: 'Brother',
                    phoneNumber: '+1-555-0126'
                }
            ],
            references: [
                {
                    name: 'Previous Landlord',
                    relationship: 'previous_landlord',
                    phoneNumber: '+1-555-0127',
                    email: 'landlord@example.com',
                    yearsKnown: 2
                }
            ],
            rentalHistory: [
                {
                    address: '123 Previous St',
                    landlordName: 'Previous Landlord',
                    landlordPhone: '+1-555-0127',
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2022-12-31'),
                    monthlyRent: 1000,
                    reference: 'positive'
                }
            ],
            creditInfo: {
                creditScore: 720,
                creditScoreDate: new Date(),
                hasDeclarations: false,
                bankruptcyHistory: false,
                evictionHistory: false,
                criminalBackground: false
            },
            preferences: {
                maxRent: 1500,
                preferredMoveInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                leaseDuration: 12,
                petOwner: false,
                smokingStatus: 'non-smoker'
            },
            preferredContactMethod: 'email'
        });
        const currentRenter = await renterService.createRenter({
            firstName: 'Bob',
            lastName: 'Smith',
            dateOfBirth: new Date('1985-08-22'),
            email: 'bob.smith@example.com',
            phoneNumber: '+1-555-0128',
            currentAddress: {
                street: '123 Main St',
                city: 'Downtown',
                state: 'CA',
                zipCode: '90210',
                country: 'USA'
            },
            status: 'current',
            applicationStatus: 'approved',
            applicationDate: new Date('2023-01-15'),
            moveInDate: new Date('2023-02-01'),
            leaseStartDate: new Date('2023-02-01'),
            leaseEndDate: new Date('2024-02-01'),
            monthlyRent: 1200,
            securityDeposit: 2400,
            totalMonthlyIncome: 5200,
            currentEmployment: {
                employerName: 'Finance Inc',
                position: 'Accountant',
                type: 'full-time',
                monthlyIncome: 5200,
                startDate: new Date('2020-03-01'),
                isCurrentJob: true
            },
            emergencyContacts: [
                {
                    name: 'Sarah Smith',
                    relationship: 'Spouse',
                    phoneNumber: '+1-555-0129'
                }
            ],
            references: [
                {
                    name: 'HR Department',
                    relationship: 'employer',
                    phoneNumber: '+1-555-0130',
                    email: 'hr@financeinc.com',
                    yearsKnown: 3
                }
            ],
            rentalHistory: [],
            creditInfo: {
                creditScore: 780,
                creditScoreDate: new Date(),
                hasDeclarations: false,
                bankruptcyHistory: false,
                evictionHistory: false,
                criminalBackground: false
            },
            preferredContactMethod: 'phone'
        });
        console.log('Sample data seeded successfully');
    }
    catch (error) {
        console.log('Data already exists or error seeding:', error);
    }
};
// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});
// Initialize and start server
const startServer = async () => {
    await (0, container_1.initializeContainer)();
    rentalService = container_1.container.get('RentalService');
    userService = container_1.container.get('UserService');
    renterService = container_1.container.get('RenterService');
    bucketService = container_1.container.get('BucketService');
    cashFlowService = container_1.container.get('CashFlowService');
    app.use('/api', (0, domain_routes_1.createDomainRouter)({
        userService,
        rentalService,
        renterService,
        bucketService,
        cashFlowService,
    }));
    await seedData();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer();
const handleShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down...`);
    await (0, container_1.closeContainer)();
    process.exit(0);
};
process.on('SIGINT', () => {
    void handleShutdown('SIGINT');
});
process.on('SIGTERM', () => {
    void handleShutdown('SIGTERM');
});
//# sourceMappingURL=index.js.map