"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFactory = exports.FileRepositoryFactory = exports.InMemoryRepositoryFactory = void 0;
const rental_repository_1 = require("../repositories/rental.repository");
const user_repository_1 = require("../repositories/user.repository");
const renter_repository_1 = require("../repositories/renter.repository");
const bucket_repository_1 = require("../repositories/bucket.repository");
const cashflow_repository_1 = require("../repositories/cashflow.repository");
const file_1 = require("../stores/file");
const file_2 = require("../repositories/file");
// In-memory repository factory (current implementation)
class InMemoryRepositoryFactory {
    createRentalRepository() {
        return new rental_repository_1.RentalRepository();
    }
    createUserRepository() {
        return new user_repository_1.UserRepository();
    }
    createRenterRepository() {
        return new renter_repository_1.RenterRepository();
    }
    createBucketRepository() {
        return new bucket_repository_1.BucketRepository();
    }
    createCashFlowRepository() {
        return new cashflow_repository_1.CashFlowRepository();
    }
}
exports.InMemoryRepositoryFactory = InMemoryRepositoryFactory;
class FileRepositoryFactory {
    constructor(config) {
        this.storeRegistry = new file_1.FileStoreRegistry({
            storeRootPath: config.storeRootPath,
        });
    }
    async initialize() {
        await this.storeRegistry.initialize();
    }
    async close() {
        await this.storeRegistry.close();
    }
    createRentalRepository() {
        if (!this.rentalRepository) {
            this.rentalRepository = new file_2.RentalFileRepository(this.storeRegistry.rentals);
        }
        return this.rentalRepository;
    }
    createUserRepository() {
        if (!this.userRepository) {
            this.userRepository = new file_2.UserFileRepository(this.storeRegistry.users);
        }
        return this.userRepository;
    }
    createRenterRepository() {
        if (!this.renterRepository) {
            this.renterRepository = new file_2.RenterFileRepository(this.storeRegistry.renters);
        }
        return this.renterRepository;
    }
    createBucketRepository() {
        if (!this.bucketRepository) {
            this.bucketRepository = new file_2.BucketFileRepository(this.storeRegistry.buckets);
        }
        return this.bucketRepository;
    }
    createCashFlowRepository() {
        if (!this.cashFlowRepository) {
            this.cashFlowRepository = new file_2.CashFlowFileRepository(this.storeRegistry.cashflows);
        }
        return this.cashFlowRepository;
    }
}
exports.FileRepositoryFactory = FileRepositoryFactory;
// Database factory that returns the appropriate repository factory
class DatabaseFactory {
    static create(config) {
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
exports.DatabaseFactory = DatabaseFactory;
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
//# sourceMappingURL=database.config.js.map