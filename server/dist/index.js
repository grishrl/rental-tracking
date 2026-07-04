"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const container_1 = require("./container/container");
const domain_routes_1 = require("./routes/domain.routes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/uploads/transactions', express_1.default.static(path_1.default.resolve(__dirname, '../../store/cashflow/attachments')));
app.use('/api/uploads/rentals', express_1.default.static(path_1.default.resolve(__dirname, '../../store/rental/photos')));
app.use('/api/uploads/rental-docs', express_1.default.static(path_1.default.resolve(__dirname, '../../store/rental/tenant-documents')));
let rentalService;
let userService;
let renterService;
let bucketService;
let cashFlowService;
// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});
// Initialize and start server
const startServer = async () => {
    await (0, container_1.initializeContainer)();
    rentalService = container_1.container.get('RentalService');
    userService = container_1.container.get('UserService');
    renterService = container_1.container.get('RenterService');
    bucketService = container_1.container.get('BucketService');
    cashFlowService = container_1.container.get('CashFlowService');
    app.use('/api', (0, domain_routes_1.createDomainRouter)({
        userService,
        rentalService,
        renterService,
        bucketService,
        cashFlowService,
    }));
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer();
const handleShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down...`);
    await (0, container_1.closeContainer)();
    process.exit(0);
};
process.on('SIGINT', () => {
    void handleShutdown('SIGINT');
});
process.on('SIGTERM', () => {
    void handleShutdown('SIGTERM');
});
//# sourceMappingURL=index.js.map