import { IRentalRepository } from '../repositories/rental.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IRenterRepository } from '../repositories/renter.repository.interface';
import { IBucketRepository } from '../repositories/bucket.repository.interface';
import { ICashFlowRepository } from '../repositories/cashflow.repository.interface';
import { RentalRepository } from '../repositories/rental.repository';
import { UserRepository } from '../repositories/user.repository';
import { RenterRepository } from '../repositories/renter.repository';
import { BucketRepository } from '../repositories/bucket.repository';
import { CashFlowRepository } from '../repositories/cashflow.repository';
import { FileStoreRegistry } from '../stores/file';
import {
  BucketFileRepository,
  CashFlowFileRepository,
  RentalFileRepository,
  RenterFileRepository,
  UserFileRepository,
} from '../repositories/file';

// Database configuration type
export type DatabaseType = 'memory' | 'file' | 'mongodb' | 'postgresql' | 'mysql';

// Database configuration interface
export interface DatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  storeRootPath?: string;
}

// Repository factory interface
export interface IRepositoryFactory {
  initialize?(): Promise<void>;
  close?(): Promise<void>;
  createRentalRepository(): IRentalRepository;
  createUserRepository(): IUserRepository;
  createRenterRepository(): IRenterRepository;
  createBucketRepository(): IBucketRepository;
  createCashFlowRepository(): ICashFlowRepository;
}

// In-memory repository factory (current implementation)
export class InMemoryRepositoryFactory implements IRepositoryFactory {
  createRentalRepository(): IRentalRepository {
    return new RentalRepository();
  }

  createUserRepository(): IUserRepository {
    return new UserRepository();
  }

  createRenterRepository(): IRenterRepository {
    return new RenterRepository();
  }

  createBucketRepository(): IBucketRepository {
    return new BucketRepository();
  }

  createCashFlowRepository(): ICashFlowRepository {
    return new CashFlowRepository();
  }
}

export class FileRepositoryFactory implements IRepositoryFactory {
  private readonly storeRegistry: FileStoreRegistry;
  private userRepository?: IUserRepository;
  private rentalRepository?: IRentalRepository;
  private renterRepository?: IRenterRepository;
  private bucketRepository?: IBucketRepository;
  private cashFlowRepository?: ICashFlowRepository;

  constructor(config: DatabaseConfig) {
    this.storeRegistry = new FileStoreRegistry({
      storeRootPath: config.storeRootPath,
    });
  }

  async initialize(): Promise<void> {
    await this.storeRegistry.initialize();
  }

  async close(): Promise<void> {
    await this.storeRegistry.close();
  }

  createRentalRepository(): IRentalRepository {
    if (!this.rentalRepository) {
      this.rentalRepository = new RentalFileRepository(this.storeRegistry.rentals);
    }

    return this.rentalRepository;
  }

  createUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserFileRepository(this.storeRegistry.users);
    }

    return this.userRepository;
  }

  createRenterRepository(): IRenterRepository {
    if (!this.renterRepository) {
      this.renterRepository = new RenterFileRepository(this.storeRegistry.renters);
    }

    return this.renterRepository;
  }

  createBucketRepository(): IBucketRepository {
    if (!this.bucketRepository) {
      this.bucketRepository = new BucketFileRepository(this.storeRegistry.buckets);
    }

    return this.bucketRepository;
  }

  createCashFlowRepository(): ICashFlowRepository {
    if (!this.cashFlowRepository) {
      this.cashFlowRepository = new CashFlowFileRepository(this.storeRegistry.cashflows);
    }

    return this.cashFlowRepository;
  }
}

// Database factory that returns the appropriate repository factory
export class DatabaseFactory {
  static create(config: DatabaseConfig): IRepositoryFactory {
    switch (config.type) {
      case 'memory':
        return new InMemoryRepositoryFactory();

      case 'file':
        return new FileRepositoryFactory(config);
      
      case 'mongodb':
        // Would create MongoDB repository factory
        throw new Error('MongoDB implementation not available. Install mongodb package and implement MongoRepositoryFactory');
      
      case 'postgresql':
        // Would create PostgreSQL repository factory
        throw new Error('PostgreSQL implementation not available. Install pg package and implement PostgreSQLRepositoryFactory');
      
      case 'mysql':
        // Would create MySQL repository factory
        throw new Error('MySQL implementation not available. Install mysql2 package and implement MySQLRepositoryFactory');
      
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }
}

// Example usage:
/*
// For in-memory (current setup)
const config: DatabaseConfig = { type: 'memory' };

// For MongoDB
const mongoConfig: DatabaseConfig = {
  type: 'mongodb',
  connectionString: 'mongodb://localhost:27017/rental-db'
};

// For PostgreSQL
const pgConfig: DatabaseConfig = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'rental_db',
  username: 'user',
  password: 'password'
};

const repositoryFactory = DatabaseFactory.create(config);
const rentalRepo = repositoryFactory.createRentalRepository();
const userRepo = repositoryFactory.createUserRepository();
*/