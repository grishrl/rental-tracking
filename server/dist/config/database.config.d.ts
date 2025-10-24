import { IRentalRepository } from '../repositories/rental.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
export type DatabaseType = 'memory' | 'mongodb' | 'postgresql' | 'mysql';
export interface DatabaseConfig {
    type: DatabaseType;
    connectionString?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
}
export interface IRepositoryFactory {
    createRentalRepository(): IRentalRepository;
    createUserRepository(): IUserRepository;
}
export declare class InMemoryRepositoryFactory implements IRepositoryFactory {
    createRentalRepository(): IRentalRepository;
    createUserRepository(): IUserRepository;
}
export declare class DatabaseFactory {
    static create(config: DatabaseConfig): IRepositoryFactory;
}
//# sourceMappingURL=database.config.d.ts.map