import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { container } from './container/container';
import { RentalService } from './services/rental.service';
import { UserService } from './services/user.service';
import { RenterService } from './services/renter.service';
import { Rental } from './models/rental.model';
import { User } from './models/user.model';
import { Renter } from './models/renter.model';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Get services from container
const rentalService = container.get<RentalService>('RentalService');
const userService = container.get<UserService>('UserService');
const renterService = container.get<RenterService>('RenterService');

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
  } catch (error) {
    console.log('Data already exists or error seeding:', error);
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// Rental routes
app.get('/api/rentals', async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities
    } = req.query;

    let rentals;

    if (location || minPrice || maxPrice || bedrooms || bathrooms || amenities) {
      // Search with filters
      const searchParams: any = {};
      
      if (location) searchParams.location = location as string;
      if (minPrice) searchParams.minPrice = parseInt(minPrice as string);
      if (maxPrice) searchParams.maxPrice = parseInt(maxPrice as string);
      if (bedrooms) searchParams.bedrooms = parseInt(bedrooms as string);
      if (bathrooms) searchParams.bathrooms = parseInt(bathrooms as string);
      if (amenities) {
        searchParams.amenities = Array.isArray(amenities) 
          ? amenities as string[]
          : [amenities as string];
      }

      rentals = await rentalService.searchRentals(searchParams);
    } else {
      // Get all available rentals
      rentals = await rentalService.getAvailableRentals();
    }

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rentals' });
  }
});

app.get('/api/rentals/:id', async (req, res) => {
  try {
    const rental = await rentalService.getRentalById(req.params.id);
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rental' });
  }
});

app.post('/api/rentals', async (req, res) => {
  try {
    const rental = await rentalService.createRental(req.body);
    res.status(201).json(rental);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/rentals/:id', async (req, res) => {
  try {
    const rental = await rentalService.updateRental(req.params.id, req.body);
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    res.json(rental);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/rentals/:id', async (req, res) => {
  try {
    const deleted = await rentalService.deleteRental(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// User routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Renter routes
app.get('/api/renters', async (req, res) => {
  try {
    const { status, applicationStatus, name, email, phoneNumber, rentalId } = req.query;
    
    if (status || applicationStatus || name || email || phoneNumber || rentalId) {
      // Search with filters
      const searchParams: any = {};
      if (status) searchParams.status = status as string;
      if (applicationStatus) searchParams.applicationStatus = applicationStatus as string;
      if (name) searchParams.name = name as string;
      if (email) searchParams.email = email as string;
      if (phoneNumber) searchParams.phoneNumber = phoneNumber as string;
      if (rentalId) searchParams.rentalId = rentalId as string;
      
      const renters = await renterService.searchRenters(searchParams);
      res.json(renters);
    } else {
      const renters = await renterService.getAllRenters();
      res.json(renters);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renters' });
  }
});

app.get('/api/renters/summary', async (req, res) => {
  try {
    const summary = await renterService.getRenterSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renter summary' });
  }
});

app.get('/api/renters/current', async (req, res) => {
  try {
    const renters = await renterService.getCurrentRenters();
    res.json(renters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current renters' });
  }
});

app.get('/api/renters/prospective', async (req, res) => {
  try {
    const renters = await renterService.getProspectiveRenters();
    res.json(renters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prospective renters' });
  }
});

app.get('/api/renters/leases-expiring', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const renters = await renterService.getLeasesExpiring(days);
    res.json(renters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renters with expiring leases' });
  }
});

app.get('/api/renters/follow-up', async (req, res) => {
  try {
    const renters = await renterService.getRentersRequiringFollowUp();
    res.json(renters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renters requiring follow-up' });
  }
});

app.get('/api/renters/:id', async (req, res) => {
  try {
    const renter = await renterService.getRenterById(req.params.id);
    if (!renter) {
      return res.status(404).json({ error: 'Renter not found' });
    }
    res.json(renter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renter' });
  }
});

app.post('/api/renters', async (req, res) => {
  try {
    const renter = await renterService.createRenter(req.body);
    res.status(201).json(renter);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/renters/:id', async (req, res) => {
  try {
    const renter = await renterService.updateRenter(req.params.id, req.body);
    if (!renter) {
      return res.status(404).json({ error: 'Renter not found' });
    }
    res.json(renter);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/renters/:id', async (req, res) => {
  try {
    const deleted = await renterService.deleteRenter(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Renter not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/renters/:id/assign-rental', async (req, res) => {
  try {
    const { rentalId, startDate, endDate, monthlyRent, securityDeposit } = req.body;
    const result = await renterService.assignRenterToRental(req.params.id, rentalId, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      monthlyRent,
      securityDeposit
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/renters/:id/end-lease', async (req, res) => {
  try {
    const { moveOutDate } = req.body;
    const result = await renterService.endLease(req.params.id, new Date(moveOutDate));
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/renters/:id/process-application', async (req, res) => {
  try {
    const { decision, notes } = req.body;
    const renter = await renterService.processApplication(req.params.id, decision, notes);
    res.json(renter);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/renters/:id/evaluate-application', async (req, res) => {
  try {
    const minIncomeRatio = parseFloat(req.query.minIncomeRatio as string) || 3;
    const evaluation = await renterService.evaluateApplication(req.params.id, minIncomeRatio);
    res.json(evaluation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/renters/:id/communication', async (req, res) => {
  try {
    const renter = await renterService.addCommunicationRecord(req.params.id, req.body);
    res.json(renter);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Initialize and start server
const startServer = async () => {
  await seedData();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();