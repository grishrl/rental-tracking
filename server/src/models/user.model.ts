import { BaseEntity } from '../interfaces/repository.interface';

export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface IUser extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  profile?: {
    avatar?: string;
    bio?: string;
    preferences?: {
      maxPrice?: number;
      preferredLocation?: string[];
      petOwner?: boolean;
    };
  };
  isActive: boolean;
  lastLoginAt?: Date;
}

export class User implements IUser {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber?: string;
  public role: UserRole;
  public profile?: {
    avatar?: string;
    bio?: string;
    preferences?: {
      maxPrice?: number;
      preferredLocation?: string[];
      petOwner?: boolean;
    };
  };
  public isActive: boolean;
  public lastLoginAt?: Date;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = this.generateId();
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phoneNumber = data.phoneNumber;
    this.role = data.role;
    this.profile = data.profile;
    this.isActive = data.isActive;
    this.lastLoginAt = data.lastLoginAt;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public updateLastLogin(): void {
    this.lastLoginAt = new Date();
    this.updateTimestamp();
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public toJSON(): IUser {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      role: this.role,
      profile: this.profile,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}