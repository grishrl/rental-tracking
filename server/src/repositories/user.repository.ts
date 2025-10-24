import { IUser, UserRole } from '../models/user.model';
import { InMemoryRepository } from './memory.repository';
import { IUserRepository } from './user.repository.interface';

export class UserRepository extends InMemoryRepository<IUser> implements IUserRepository {
  constructor() {
    super('users');
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