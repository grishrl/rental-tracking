"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFactory = exports.InMemoryRepositoryFactory = void 0;
const rental_repository_1 = require("../repositories/rental.repository");
const user_repository_1 = require("../repositories/user.repository");
// In-memory repository factory (current implementation)
class InMemoryRepositoryFactory {
    createRentalRepository() {
        return new rental_repository_1.RentalRepository();
    }
    createUserRepository() {
        return new user_repository_1.UserRepository();
    }
}
exports.InMemoryRepositoryFactory = InMemoryRepositoryFactory;
// Database factory that returns the appropriate repository factory
class DatabaseFactory {
    static create(config) {
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