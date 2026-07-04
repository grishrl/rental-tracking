"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveStoreFile = exports.resolveStoreRoot = void 0;
const path_1 = __importDefault(require("path"));
const DEFAULT_STORE_ROOT = path_1.default.resolve(__dirname, '../../../../store');
const resolveStoreRoot = (overrideRootPath) => {
    return overrideRootPath ? path_1.default.resolve(overrideRootPath) : DEFAULT_STORE_ROOT;
};
exports.resolveStoreRoot = resolveStoreRoot;
const resolveStoreFile = (modelFolder, fileName, overrideRootPath) => {
    return path_1.default.join((0, exports.resolveStoreRoot)(overrideRootPath), modelFolder, fileName);
};
exports.resolveStoreFile = resolveStoreFile;
//# sourceMappingURL=path-resolver.js.map