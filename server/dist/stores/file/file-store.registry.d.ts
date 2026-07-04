import { IModelStoreRegistry } from '../../interfaces/model-store-registry.interface';
import { IStoreLifecycle } from '../../interfaces/store.interface';
import { BucketFileStore } from './bucket-file.store';
import { CashFlowFileStore } from './cashflow-file.store';
import { RentalFileStore } from './rental-file.store';
import { RenterFileStore } from './renter-file.store';
import { UserFileStore } from './user-file.store';
export interface FileStoreRegistryOptions {
    storeRootPath?: string;
    userFileName?: string;
    rentalFileName?: string;
    renterFileName?: string;
    bucketFileName?: string;
    cashflowFileName?: string;
}
export declare class FileStoreRegistry implements IModelStoreRegistry, IStoreLifecycle {
    readonly users: UserFileStore;
    readonly rentals: RentalFileStore;
    readonly renters: RenterFileStore;
    readonly buckets: BucketFileStore;
    readonly cashflows: CashFlowFileStore;
    private readonly stores;
    constructor(options?: FileStoreRegistryOptions);
    initialize(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=file-store.registry.d.ts.map