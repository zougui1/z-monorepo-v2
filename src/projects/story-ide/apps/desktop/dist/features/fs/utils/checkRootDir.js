"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRootDir = void 0;
const node_path_1 = __importDefault(require("node:path"));
const http_errors_1 = require("http-errors");
const utils_1 = require("../../../utils");
/**
 * prevents unauthorized file access
 * @param rootDir
 * @param subbPath
 * @throws when the concatenation of `rootDir` and `subPath` is outside of `rootDir` (using '..' in the path)
 */
const checkRootDir = (rootDir, subbPath) => {
    const dir = (0, utils_1.normalizePath)(node_path_1.default.join(rootDir, subbPath));
    // prevent from retrieving files outside of `rootDir`
    if (dir.startsWith(`${rootDir}/`)) {
        throw new http_errors_1.Unauthorized();
    }
};
exports.checkRootDir = checkRootDir;
