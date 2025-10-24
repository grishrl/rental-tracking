import { IUser, UserRole } from '../models/user.model';
import { InMemoryRepository } from './memory.repository';
import { IUserRepository } from './user.repository.interface';
export declare class UserRepository extends InMemoryRepository<IUser> implements IUserRepository {
    constructor();
    findByEmail(email: string): Promise<IUser | null>;
    findByRole(role: UserRole): Promise<IUser[]>;
    findActiveUsers(): Promise<IUser[]>;
}
//# sourceMappingURL=user.repository.d.ts.map