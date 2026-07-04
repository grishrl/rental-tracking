"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStoreRegistry = void 0;
const bucket_file_store_1 = require("./bucket-file.store");
const cashflow_file_store_1 = require("./cashflow-file.store");
const rental_file_store_1 = require("./rental-file.store");
const renter_file_store_1 = require("./renter-file.store");
const user_file_store_1 = require("./user-file.store");
const path_resolver_1 = require("./path-resolver");
class FileStoreRegistry {
    constructor(options = {}) {
        const rootPath = (0, path_resolver_1.resolveStoreRoot)(options.storeRootPath);
        this.users = new user_file_store_1.UserFileStore((0, path_resolver_1.resolveStoreFile)('user', options.userFileName ?? 'demo-users.json', rootPath));
        this.rentals = new rental_file_store_1.RentalFileStore((0, path_resolver_1.resolveStoreFile)('rental', options.rentalFileName ?? 'demo-rentals.json', rootPath));
        this.renters = new renter_file_store_1.RenterFileStore((0, path_resolver_1.resolveStoreFile)('renter', options.renterFileName ?? 'demo-renters.json', rootPath));
        this.buckets = new bucket_file_store_1.BucketFileStore((0, path_resolver_1.resolveStoreFile)('bucket', options.bucketFileName ?? 'demo-buckets.json', rootPath));
        this.cashflows = new cashflow_file_store_1.CashFlowFileStore((0, path_resolver_1.resolveStoreFile)('cashflow', options.cashflowFileName ?? 'demo-cashflow.json', rootPath));
        this.stores = [this.users, this.rentals, this.renters, this.buckets, this.cashflows];
    }
    async initialize() {
        await Promise.all(this.stores.map((store) => store.initialize()));
    }
    async close() {
        await Promise.all(this.stores.map((store) => store.close()));
    }
}
exports.FileStoreRegistry = FileStoreRegistry;
//# sourceMappingURL=file-store.registry.js.map