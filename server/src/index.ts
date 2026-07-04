import express from 'express';
import cors from 'cors';
import { closeContainer, container, initializeContainer } from './container/container';
import { RentalService } from './services/rental.service';
import { UserService } from './services/user.service';
import { RenterService } from './services/renter.service';
import { BucketService } from './services/bucket.service';
import { CashFlowService } from './services/cashflow.service';
import { Rental } from './models/rental.model';
import { User } from './models/user.model';
import { Renter } from './models/renter.model';
import { createDomainRouter } from './routes/domain.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let rentalService: RentalService;
let userService: UserService;
let renterService: RenterService;
let bucketService: BucketService;
let cashFlowService: CashFlowService;

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// Initialize and start server
const startServer = async () => {
  await initializeContainer();

  rentalService = container.get<RentalService>('RentalService');
  userService = container.get<UserService>('UserService');
  renterService = container.get<RenterService>('RenterService');
  bucketService = container.get<BucketService>('BucketService');
  cashFlowService = container.get<CashFlowService>('CashFlowService');

  app.use('/api', createDomainRouter({
    userService,
    rentalService,
    renterService,
    bucketService,
    cashFlowService,
  }));
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

const handleShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down...`);
  await closeContainer();
  process.exit(0);
};

process.on('SIGINT', () => {
  void handleShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void handleShutdown('SIGTERM');
});