"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appCacheDir = exports.appDir = exports.heightPercent = exports.widthPercent = exports.defaultUrl = void 0;
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
exports.defaultUrl = 'http://localhost:3000/workspaces';
exports.widthPercent = '35%';
exports.heightPercent = '35%';
exports.appDir = node_path_1.default.join(node_os_1.default.homedir(), '.config', 'Story IDE');
exports.appCacheDir = node_path_1.default.join(exports.appDir, 'Cache');
