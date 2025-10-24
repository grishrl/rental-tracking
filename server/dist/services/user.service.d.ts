import { IUser, UserRole } from '../models/user.model';
import { IUserRepository } from '../repositories/user.repository.interface';
export declare class UserService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    getAllUsers(): Promise<IUser[]>;
    getUserById(id: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser>;
    updateUser(id: string, updates: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IUser | null>;
    deleteUser(id: string): Promise<boolean>;
    getUsersByRole(role: UserRole): Promise<IUser[]>;
    getActiveUsers(): Promise<IUser[]>;
    updateLastLogin(id: string): Promise<IUser | null>;
    deactivateUser(id: string): Promise<IUser | null>;
    reactivateUser(id: string): Promise<IUser | null>;
    private validateUserData;
    private isValidEmail;
    private isValidPhoneNumber;
}
//# sourceMappingURL=user.service.d.ts.map