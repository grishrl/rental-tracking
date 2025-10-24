import { IRepository } from '../interfaces/repository.interface';
import { IUser, UserRole } from '../models/user.model';
export interface IUserRepository extends IRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByRole(role: UserRole): Promise<IUser[]>;
    findActiveUsers(): Promise<IUser[]>;
}
//# sourceMappingURL=user.repository.interface.d.ts.map