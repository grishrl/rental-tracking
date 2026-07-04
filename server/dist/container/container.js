"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeContainer = exports.initializeContainer = exports.container = void 0;
require("../config/env");
const rental_service_1 = require("../services/rental.service");
const user_service_1 = require("../services/user.service");
const bucket_service_1 = require("../services/bucket.service");
const cashflow_service_1 = require("../services/cashflow.service");
const renter_service_1 = require("../services/renter.service");
const database_config_1 = require("../config/database.config");
// Simple dependency injection container
class Container {
    constructor() {
        this.registrations = new Map();
        this.instances = new Map();
    }
    register(name, factory, singleton = true) {
        this.registrations.set(name, { factory, singleton });
    }
    get(name) {
        if (this.instances.has(name)) {
            return this.instances.get(name);
        }
        const registration = this.registrations.get(name);
        if (!registration) {
            throw new Error(`Service ${name} not found`);
        }
        const instance = registration.factory();
        if (registration.singleton) {
            this.instances.set(name, instance);
        }
        return instance;
    }
    clear() {
        this.registrations.clear();
        this.instances.clear();
    }
}
// Create and configure the container
exports.container = new Container();
// Database configuration - easily changeable
const databaseConfig = {
    type: process.env.DB_TYPE || 'memory',
    storeRootPath: process.env.STORE_ROOT_PATH,
};
// Create repository factory based on configuration
const repositoryFactory = database_config_1.DatabaseFactory.create(databaseConfig);
let initialized = false;
const registerDependencies = () => {
    exports.container.clear();
    // Register repositories using the selected backend factory
    exports.container.register('RentalRepository', () => repositoryFactory.createRentalRepository());
    exports.container.register('UserRepository', () => repositoryFactory.createUserRepository());
    exports.container.register('BucketRepository', () => repositoryFactory.createBucketRepository());
    exports.container.register('CashFlowRepository', () => repositoryFactory.createCashFlowRepository());
    exports.container.register('RenterRepository', () => repositoryFactory.createRenterRepository());
    // Register services
    exports.container.register('RentalService', () => new rental_service_1.RentalService(exports.container.get('RentalRepository')));
    exports.container.register('UserService', () => new user_service_1.UserService(exports.container.get('UserRepository')));
    exports.container.register('BucketService', () => new bucket_service_1.BucketService(exports.container.get('BucketRepository'), exports.container.get('CashFlowRepository')));
    exports.container.register('CashFlowService', () => new cashflow_service_1.CashFlowService(exports.container.get('CashFlowRepository'), exports.container.get('BucketRepository')));
    exports.container.register('RenterService', () => new renter_service_1.RenterService(exports.container.get('RenterRepository'), exports.container.get('RentalRepository')));
};
const initializeContainer = async () => {
    if (initialized) {
        return;
    }
    if (repositoryFactory.initialize) {
        await repositoryFactory.initialize();
    }
    registerDependencies();
    initialized = true;
};
exports.initializeContainer = initializeContainer;
const closeContainer = async () => {
    if (!initialized) {
        return;
    }
    if (repositoryFactory.close) {
        await repositoryFactory.close();
    }
    initialized = false;
};
exports.closeContainer = closeContainer;
exports.default = exports.container;
//# sourceMappingURL=container.js.map