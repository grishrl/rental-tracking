import { IUser, UserRole } from '../../models/user.model';
import { IUserRepository } from '../user.repository.interface';
import { StoreBackedRepository } from '../store-backed.repository';
import { IModelStore } from '../../interfaces/store.interface';

export class UserFileRepository extends StoreBackedRepository<IUser> implements IUserRepository {
  constructor(store: IModelStore<IUser>) {
    super(store);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const users = await this.findBy({ email } as Partial<IUser>);
    return users.length > 0 ? users[0] : null;
  }

  async findByRole(role: UserRole): Promise<IUser[]> {
    return this.findBy({ role } as Partial<IUser>);
  }

  async findActiveUsers(): Promise<IUser[]> {
    return this.findBy({ isActive: true } as Partial<IUser>);
  }
}
