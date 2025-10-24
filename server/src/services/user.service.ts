import { IUser, User, UserRole } from '../models/user.model';
import { IUserRepository } from '../repositories/user.repository.interface';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    // Validate user data
    await this.validateUserData(userData);
    
    return this.userRepository.create(userData);
  }

  async updateUser(id: string, updates: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IUser | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    // Validate email uniqueness if email is being updated
    if (updates.email && updates.email !== existingUser.email) {
      const existingEmailUser = await this.userRepository.findByEmail(updates.email);
      if (existingEmailUser) {
        throw new Error('Email already exists');
      }
    }

    return this.userRepository.update(id, updates);
  }

  async deleteUser(id: string): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    return this.userRepository.delete(id);
  }

  async getUsersByRole(role: UserRole): Promise<IUser[]> {
    return this.userRepository.findByRole(role);
  }

  async getActiveUsers(): Promise<IUser[]> {
    return this.userRepository.findActiveUsers();
  }

  async updateLastLogin(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async deactivateUser(id: string): Promise<IUser | null> {
    return this.userRepository.update(id, { isActive: false });
  }

  async reactivateUser(id: string): Promise<IUser | null> {
    return this.userRepository.update(id, { isActive: true });
  }

  private async validateUserData(data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (!data.firstName || data.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }

    if (!data.role || !['tenant', 'landlord', 'admin'].includes(data.role)) {
      throw new Error('Valid user role is required');
    }

    // Check email uniqueness
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    if (data.phoneNumber && !this.isValidPhoneNumber(data.phoneNumber)) {
      throw new Error('Invalid phone number format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}