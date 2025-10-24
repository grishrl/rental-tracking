import { IRepository } from '../interfaces/repository.interface';
import { IUser, UserRole } from '../models/user.model';

// Extended interface for user-specific operations
export interface IUserRepository extends IRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByRole(role: UserRole): Promise<IUser[]>;
  findActiveUsers(): Promise<IUser[]>;
}