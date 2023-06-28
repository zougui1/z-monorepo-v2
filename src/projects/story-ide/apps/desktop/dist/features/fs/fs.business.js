"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameNode = exports.deleteNodes = exports.getFileContent = exports.getNodes = void 0;
const radash_1 = require("radash");
const utils_1 = require("./utils");
const database = __importStar(require("./fs.database"));
const utils_2 = require("../../utils");
const getNodes = async (rootDir, subDir) => {
    const dir = (0, utils_1.getSafePath)(rootDir, subDir);
    const nodes = await database.getNodes(dir);
    return nodes.map(node => {
        const subPath = node.path.slice(rootDir.length + 1);
        return {
            ...node,
            path: (0, utils_2.normalizePath)(subPath, { noLeadingSlash: true }),
        };
    });
};
exports.getNodes = getNodes;
const getFileContent = async (rootDir, subFilePath) => {
    const filePath = (0, utils_1.getSafePath)(rootDir, subFilePath);
    return await database.getFileContent(filePath);
};
exports.getFileContent = getFileContent;
const deleteNodes = async (rootDir, subPaths) => {
    const [validPaths, invalidPaths] = (0, radash_1.fork)(subPaths, subPath => {
        return (0, utils_1.getIsPathWithinRootDir)(rootDir, subPath);
    });
    await database.deleteNodes(validPaths.map(path => (0, utils_1.getSafePath)(rootDir, path)));
    return {
        preservedPaths: invalidPaths,
    };
};
exports.deleteNodes = deleteNodes;
const renameNode = async (rootDir, oldPath, newPath) => {
    const validOldPath = (0, utils_1.getSafePath)(rootDir, oldPath);
    const validNewPath = (0, utils_1.getSafePath)(rootDir, newPath);
    await database.renameNode(validOldPath, validNewPath);
};
exports.renameNode = renameNode;
