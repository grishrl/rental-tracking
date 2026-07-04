import { IRentalRepository } from '../repositories/rental.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IRenterRepository } from '../repositories/renter.repository.interface';
import { IBucketRepository } from '../repositories/bucket.repository.interface';
import { ICashFlowRepository } from '../repositories/cashflow.repository.interface';
export type DatabaseType = 'memory' | 'file' | 'mongodb' | 'postgresql' | 'mysql';
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
export interface IRepositoryFactory {
    initialize?(): Promise<void>;
    close?(): Promise<void>;
    createRentalRepository(): IRentalRepository;
    createUserRepository(): IUserRepository;
    createRenterRepository(): IRenterRepository;
    createBucketRepository(): IBucketRepository;
    createCashFlowRepository(): ICashFlowRepository;
}
export declare class InMemoryRepositoryFactory implements IRepositoryFactory {
    createRentalRepository(): IRentalRepository;
    createUserRepository(): IUserRepository;
    createRenterRepository(): IRenterRepository;
    createBucketRepository(): IBucketRepository;
    createCashFlowRepository(): ICashFlowRepository;
}
export declare class FileRepositoryFactory implements IRepositoryFactory {
    private readonly storeRegistry;
    private userRepository?;
    private rentalRepository?;
    private renterRepository?;
    private bucketRepository?;
    private cashFlowRepository?;
    constructor(config: DatabaseConfig);
    initialize(): Promise<void>;
    close(): Promise<void>;
    createRentalRepository(): IRentalRepository;
    createUserRepository(): IUserRepository;
    createRenterRepository(): IRenterRepository;
    createBucketRepository(): IBucketRepository;
    createCashFlowRepository(): ICashFlowRepository;
}
export declare class DatabaseFactory {
    static create(config: DatabaseConfig): IRepositoryFactory;
}
//# sourceMappingURL=database.config.d.ts.map