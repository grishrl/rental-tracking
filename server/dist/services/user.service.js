"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        return this.userRepository.findAll();
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async getUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async createUser(userData) {
        // Validate user data
        await this.validateUserData(userData);
        return this.userRepository.create(userData);
    }
    async updateUser(id, updates) {
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
    async deleteUser(id) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error(`User with id ${id} not found`);
        }
        return this.userRepository.delete(id);
    }
    async getUsersByRole(role) {
        return this.userRepository.findByRole(role);
    }
    async getActiveUsers() {
        return this.userRepository.findActiveUsers();
    }
    async updateLastLogin(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return this.userRepository.update(id, { lastLoginAt: new Date() });
    }
    async deactivateUser(id) {
        return this.userRepository.update(id, { isActive: false });
    }
    async reactivateUser(id) {
        return this.userRepository.update(id, { isActive: true });
    }
    async validateUserData(data) {
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
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    isValidPhoneNumber(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map