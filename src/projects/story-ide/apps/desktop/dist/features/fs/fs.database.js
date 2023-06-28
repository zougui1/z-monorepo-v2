"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameNode = exports.deleteNodes = exports.getFileContent = exports.getNodes = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const radash_1 = require("radash");
const getNodes = async (dirPath) => {
    const nodeNames = await fs_extra_1.default.readdir(dirPath);
    const nodes = await (0, radash_1.parallel)(nodeNames.length, nodeNames, async (nodeName) => {
        const nodePath = node_path_1.default.join(dirPath, nodeName);
        const stats = await fs_extra_1.default.stat(nodePath);
        const type = getNodeType(stats);
        return {
            path: nodePath,
            name: nodeName,
            type,
        };
    });
    return nodes.filter((node) => Boolean(node.type));
};
exports.getNodes = getNodes;
const getNodeType = (stats) => {
    if (stats.isDirectory()) {
        return 'dir';
    }
    if (stats.isFile()) {
        return 'file';
    }
};
const getFileContent = async (filePath) => {
    return await fs_extra_1.default.readFile(filePath, 'utf8');
};
exports.getFileContent = getFileContent;
const deleteNodes = async (nodesPaths) => {
    await (0, radash_1.parallel)(nodesPaths.length, nodesPaths, async (nodePath) => {
        try {
            await fs_extra_1.default.remove(nodePath);
        }
        catch { }
    });
};
exports.deleteNodes = deleteNodes;
const renameNode = async (oldPath, newPath) => {
    await fs_extra_1.default.ensureDir(node_path_1.default.dirname(newPath));
    await fs_extra_1.default.rename(oldPath, newPath);
};
exports.renameNode = renameNode;
