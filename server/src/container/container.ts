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
import { BucketRepository } from '../repositories/bucket.repository';
import { CashFlowRepository } from '../repositories/cashflow.repository';
import { RenterRepository } from '../repositories/renter.repository';
import { DatabaseFactory, DatabaseConfig, IRepositoryFactory } from '../config/database.config';

// Simple dependency injection container
class Container {
  private services: Map<string, any> = new Map();

  register<T>(name: string, factory: () => T): void {
    this.services.set(name, factory);
  }

  get<T>(name: string): T {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory();
  }
}

// Create and configure the container
export const container = new Container();

// Database configuration - easily changeable
const databaseConfig: DatabaseConfig = {
  type: 'memory' // Change to 'mongodb', 'postgresql', or 'mysql' when available
};

// Create repository factory based on configuration
const repositoryFactory: IRepositoryFactory = DatabaseFactory.create(databaseConfig);

// Register repositories using the factory
container.register<IRentalRepository>('RentalRepository', () => 
  repositoryFactory.createRentalRepository()
);

container.register<IUserRepository>('UserRepository', () => 
  repositoryFactory.createUserRepository()
);

// Register new repositories directly (until we update the factory)
container.register<IBucketRepository>('BucketRepository', () => 
  new BucketRepository()
);

container.register<ICashFlowRepository>('CashFlowRepository', () => 
  new CashFlowRepository()
);

container.register<IRenterRepository>('RenterRepository', () => 
  new RenterRepository()
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

export default container;