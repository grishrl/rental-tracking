import { IModelStoreRegistry } from '../../interfaces/model-store-registry.interface';
import { IStoreLifecycle } from '../../interfaces/store.interface';
import { BucketFileStore } from './bucket-file.store';
import { CashFlowFileStore } from './cashflow-file.store';
import { RentalFileStore } from './rental-file.store';
import { RenterFileStore } from './renter-file.store';
import { UserFileStore } from './user-file.store';
import { resolveStoreFile, resolveStoreRoot } from './path-resolver';

export interface FileStoreRegistryOptions {
  storeRootPath?: string;
  userFileName?: string;
  rentalFileName?: string;
  renterFileName?: string;
  bucketFileName?: string;
  cashflowFileName?: string;
}

export class FileStoreRegistry implements IModelStoreRegistry, IStoreLifecycle {
  public readonly users: UserFileStore;
  public readonly rentals: RentalFileStore;
  public readonly renters: RenterFileStore;
  public readonly buckets: BucketFileStore;
  public readonly cashflows: CashFlowFileStore;

  private readonly stores: IStoreLifecycle[];

  constructor(options: FileStoreRegistryOptions = {}) {
    const rootPath = resolveStoreRoot(options.storeRootPath);

    this.users = new UserFileStore(
      resolveStoreFile('user', options.userFileName ?? 'demo-users.json', rootPath)
    );

    this.rentals = new RentalFileStore(
      resolveStoreFile('rental', options.rentalFileName ?? 'demo-rentals.json', rootPath)
    );

    this.renters = new RenterFileStore(
      resolveStoreFile('renter', options.renterFileName ?? 'demo-renters.json', rootPath)
    );

    this.buckets = new BucketFileStore(
      resolveStoreFile('bucket', options.bucketFileName ?? 'demo-buckets.json', rootPath)
    );

    this.cashflows = new CashFlowFileStore(
      resolveStoreFile('cashflow', options.cashflowFileName ?? 'demo-cashflow.json', rootPath)
    );

    this.stores = [this.users, this.rentals, this.renters, this.buckets, this.cashflows];
  }

  async initialize(): Promise<void> {
    await Promise.all(this.stores.map((store) => store.initialize()));
  }

  async close(): Promise<void> {
    await Promise.all(this.stores.map((store) => store.close()));
  }
}
