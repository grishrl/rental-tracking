import '../config/env';
import { RentalService } from '../services/rental.service';
import { UserService } from '../services/user.service';
import { BucketService } from '../services/bucket.service';
import { CashFlowService } from '../services/cashflow.service';
import { RenterService } from '../services/renter.service';
import { IRentalRepository } from '../repositories/rental.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IBucketRepository } from '../repositories/bucket.repository.interface';
import { ICashFlowRepository } from '../repositories/cashflow.repository.interface';
import { IRenterRepository } from '../repositories/renter.repository.interface';
import { DatabaseFactory, DatabaseConfig, IRepositoryFactory } from '../config/database.config';

// Simple dependency injection container
class Container {
  private registrations: Map<string, { factory: () => unknown; singleton: boolean }> = new Map();
  private instances: Map<string, unknown> = new Map();

  register<T>(name: string, factory: () => T, singleton = true): void {
    this.registrations.set(name, { factory, singleton });
  }

  get<T>(name: string): T {
    if (this.instances.has(name)) {
      return this.instances.get(name) as T;
    }

    const registration = this.registrations.get(name);
    if (!registration) {
      throw new Error(`Service ${name} not found`);
    }

    const instance = registration.factory() as T;

    if (registration.singleton) {
      this.instances.set(name, instance);
    }

    return instance;
  }

  clear(): void {
    this.registrations.clear();
    this.instances.clear();
  }
}

// Create and configure the container
export const container = new Container();

// Database configuration - easily changeable
const databaseConfig: DatabaseConfig = {
  type: (process.env.DB_TYPE as DatabaseConfig['type']) || 'memory',
  storeRootPath: process.env.STORE_ROOT_PATH,
};

// Create repository factory based on configuration
const repositoryFactory: IRepositoryFactory = DatabaseFactory.create(databaseConfig);

let initialized = false;

const registerDependencies = () => {
  container.clear();

  // Register repositories using the selected backend factory
  container.register<IRentalRepository>('RentalRepository', () =>
    repositoryFactory.createRentalRepository()
  );

  container.register<IUserRepository>('UserRepository', () =>
    repositoryFactory.createUserRepository()
  );

  container.register<IBucketRepository>('BucketRepository', () =>
    repositoryFactory.createBucketRepository()
  );

  container.register<ICashFlowRepository>('CashFlowRepository', () =>
    repositoryFactory.createCashFlowRepository()
  );

  container.register<IRenterRepository>('RenterRepository', () =>
    repositoryFactory.createRenterRepository()
  );

  // Register services
  container.register<RentalService>('RentalService', () =>
    new RentalService(container.get<IRentalRepository>('RentalRepository'))
  );

  container.register<UserService>('UserService', () =>
    new UserService(container.get<IUserRepository>('UserRepository'))
  );

  container.register<BucketService>('BucketService', () =>
    new BucketService(
      container.get<IBucketRepository>('BucketRepository'),
      container.get<ICashFlowRepository>('CashFlowRepository')
    )
  );

  container.register<CashFlowService>('CashFlowService', () =>
    new CashFlowService(
      container.get<ICashFlowRepository>('CashFlowRepository'),
      container.get<IBucketRepository>('BucketRepository')
    )
  );

  container.register<RenterService>('RenterService', () =>
    new RenterService(
      container.get<IRenterRepository>('RenterRepository'),
      container.get<IRentalRepository>('RentalRepository')
    )
  );
};

export const initializeContainer = async (): Promise<void> => {
  if (initialized) {
    return;
  }

  if (repositoryFactory.initialize) {
    await repositoryFactory.initialize();
  }

  registerDependencies();
  initialized = true;
};

export const closeContainer = async (): Promise<void> => {
  if (!initialized) {
    return;
  }

  if (repositoryFactory.close) {
    await repositoryFactory.close();
  }

  initialized = false;
};

export default container;