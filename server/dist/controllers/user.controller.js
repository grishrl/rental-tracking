"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.getAll = async (_req, res) => {
            try {
                const users = await this.userService.getAllUsers();
                res.json(users);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch users' });
            }
        };
        this.get = async (req, res) => {
            try {
                const user = await this.userService.getUserById(req.params.id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json(user);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch user' });
            }
        };
        this.create = async (req, res) => {
            try {
                const user = await this.userService.createUser(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const user = await this.userService.updateUser(req.params.id, req.body);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await this.userService.deleteUser(req.params.id);
                if (!deleted) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map