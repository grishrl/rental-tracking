"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const memory_repository_1 = require("./memory.repository");
class UserRepository extends memory_repository_1.InMemoryRepository {
    constructor() {
        super('users');
    }
    async findByEmail(email) {
        const users = await this.findBy({ email });
        return users.length > 0 ? users[0] : null;
    }
    async findByRole(role) {
        return this.findBy({ role });
    }
    async findActiveUsers() {
        return this.findBy({ isActive: true });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map