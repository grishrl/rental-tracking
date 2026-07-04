"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileRepository = void 0;
const store_backed_repository_1 = require("../store-backed.repository");
class UserFileRepository extends store_backed_repository_1.StoreBackedRepository {
    constructor(store) {
        super(store);
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
exports.UserFileRepository = UserFileRepository;
//# sourceMappingURL=user.file.repository.js.map