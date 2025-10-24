"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const rental_service_1 = require("../services/rental.service");
const user_service_1 = require("../services/user.service");
const bucket_service_1 = require("../services/bucket.service");
const cashflow_service_1 = require("../services/cashflow.service");
const renter_service_1 = require("../services/renter.service");
const bucket_repository_1 = require("../repositories/bucket.repository");
const cashflow_repository_1 = require("../repositories/cashflow.repository");
const renter_repository_1 = require("../repositories/renter.repository");
const database_config_1 = require("../config/database.config");
// Simple dependency injection container
class Container {
    constructor() {
        this.services = new Map();
    }
    register(name, factory) {
        this.services.set(name, factory);
    }
    get(name) {
        const factory = this.services.get(name);
        if (!factory) {
            throw new Error(`Service ${name} not found`);
        }
        return factory();
    }
}
// Create and configure the container
exports.container = new Container();
// Database configuration - easily changeable
const databaseConfig = {
    type: 'memory' // Change to 'mongodb', 'postgresql', or 'mysql' when available
};
// Create repository factory based on configuration
const repositoryFactory = database_config_1.DatabaseFactory.create(databaseConfig);
// Register repositories using the factory
exports.container.register('RentalRepository', () => repositoryFactory.createRentalRepository());
exports.container.register('UserRepository', () => repositoryFactory.createUserRepository());
// Register new repositories directly (until we update the factory)
exports.container.register('BucketRepository', () => new bucket_repository_1.BucketRepository());
exports.container.register('CashFlowRepository', () => new cashflow_repository_1.CashFlowRepository());
exports.container.register('RenterRepository', () => new renter_repository_1.RenterRepository());
// Register services
exports.container.register('RentalService', () => new rental_service_1.RentalService(exports.container.get('RentalRepository')));
exports.container.register('UserService', () => new user_service_1.UserService(exports.container.get('UserRepository')));
exports.container.register('BucketService', () => new bucket_service_1.BucketService(exports.container.get('BucketRepository'), exports.container.get('CashFlowRepository')));
exports.container.register('CashFlowService', () => new cashflow_service_1.CashFlowService(exports.container.get('CashFlowRepository'), exports.container.get('BucketRepository')));
exports.container.register('RenterService', () => new renter_service_1.RenterService(exports.container.get('RenterRepository'), exports.container.get('RentalRepository')));
exports.default = exports.container;
//# sourceMappingURL=container.js.map