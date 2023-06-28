"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsPathWithinRootDir = void 0;
const node_path_1 = __importDefault(require("node:path"));
const utils_1 = require("../../../utils");
/**
 * returns whether the concatenation of `rootDir` and `subPath` is outside of `rootDir` (using '..' in the path)
 * @param rootDir
 * @param subbPath
 */
const getIsPathWithinRootDir = (rootDir, subPath) => {
    const node = (0, utils_1.normalizePath)(node_path_1.default.join(rootDir, subPath));
    const normalizedRootDir = (0, utils_1.normalizePath)(rootDir);
    return node === normalizedRootDir || node.startsWith(`${normalizedRootDir}/`);
};
exports.getIsPathWithinRootDir = getIsPathWithinRootDir;
