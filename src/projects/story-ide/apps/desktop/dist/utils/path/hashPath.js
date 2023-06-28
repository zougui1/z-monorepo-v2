"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPath = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const common_string_utils_1 = require("@zougui/common.string-utils");
const hashPath = (path) => {
    const cleanPath = (0, common_string_utils_1.removeSuffix)(path, '/');
    return node_crypto_1.default.createHash('sha256').update(cleanPath).digest('hex');
};
exports.hashPath = hashPath;
