import { IUser, UserRole } from '../../models/user.model';
import { IUserRepository } from '../user.repository.interface';
import { StoreBackedRepository } from '../store-backed.repository';
import { IModelStore } from '../../interfaces/store.interface';
export declare class UserFileRepository extends StoreBackedRepository<IUser> implements IUserRepository {
    constructor(store: IModelStore<IUser>);
    findByEmail(email: string): Promise<IUser | null>;
    findByRole(role: UserRole): Promise<IUser[]>;
    findActiveUsers(): Promise<IUser[]>;
}
//# sourceMappingURL=user.file.repository.d.ts.map