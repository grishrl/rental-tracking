"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(data) {
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
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    updateTimestamp() {
        this.updatedAt = new Date();
    }
    updateLastLogin() {
        this.lastLoginAt = new Date();
        this.updateTimestamp();
    }
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    toJSON() {
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
exports.User = User;
//# sourceMappingURL=user.model.js.map