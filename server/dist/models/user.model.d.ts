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
export declare class User implements IUser {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>);
    private generateId;
    updateTimestamp(): void;
    updateLastLogin(): void;
    getFullName(): string;
    toJSON(): IUser;
}
//# sourceMappingURL=user.model.d.ts.map