import { IRentalRepository } from '../repositories/rental.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { RentalRepository } from '../repositories/rental.repository';
import { UserRepository } from '../repositories/user.repository';

// Database configuration type
export type DatabaseType = 'memory' | 'mongodb' | 'postgresql' | 'mysql';

// Database configuration interface
export interface DatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

// Repository factory interface
export interface IRepositoryFactory {
  createRentalRepository(): IRentalRepository;
  createUserRepository(): IUserRepository;
}

// In-memory repository factory (current implementation)
export class InMemoryRepositoryFactory implements IRepositoryFactory {
  createRentalRepository(): IRentalRepository {
    return new RentalRepository();
  }

  createUserRepository(): IUserRepository {
    return new UserRepository();
  }
}

// Database factory that returns the appropriate repository factory
export class DatabaseFactory {
  static create(config: DatabaseConfig): IRepositoryFactory {
    switch (config.type) {
      case 'memory':
        return new InMemoryRepositoryFactory();
      
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