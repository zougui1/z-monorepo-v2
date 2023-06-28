"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceCache = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const WorkspaceData_1 = require("./WorkspaceData");
const constants_1 = require("../constants");
class WorkspaceCache {
    getFile = async (fileName) => {
        await fs_extra_1.default.ensureDir(constants_1.appCacheDir);
        const nodePath = node_path_1.default.join(constants_1.appCacheDir, fileName);
        const stats = await fs_extra_1.default.stat(nodePath);
        if (!stats.isFile()) {
            return;
        }
        return nodePath;
    };
    getWorkspace = async (fileName) => {
        try {
            const file = await this.getFile(fileName);
            if (!file) {
                return;
            }
            const dirtyData = await fs_extra_1.default.readJson(file);
            const data = await WorkspaceData_1.workspaceDataSchema.parseAsync(dirtyData);
            const targetNodeStats = await fs_extra_1.default.stat(data.path);
            if (!targetNodeStats.isDirectory()) {
                return;
            }
            return data;
        }
        catch (error) {
            console.log(error);
            // TODO log error
        }
    };
}
exports.WorkspaceCache = WorkspaceCache;
