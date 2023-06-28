"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceDataSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.workspaceDataSchema = zod_1.default.object({
    id: zod_1.default.string(),
    path: zod_1.default.string(),
    url: zod_1.default.string().url(),
    width: zod_1.default.number().int().positive(),
    height: zod_1.default.number().int().positive(),
    top: zod_1.default.number().int().positive(),
    left: zod_1.default.number().int().positive(),
    isMaximized: zod_1.default.boolean(),
    isMinimized: zod_1.default.boolean(),
    isFullscreen: zod_1.default.boolean(),
    state: zod_1.default.object({
        explorer: zod_1.default.object({
            directories: zod_1.default.record(zod_1.default.object({
                depth: zod_1.default.number(),
                nodes: zod_1.default.array(zod_1.default.object({
                    name: zod_1.default.string(),
                    path: zod_1.default.string(),
                    type: zod_1.default.enum(['dir', 'file']),
                })),
            })),
            nodes: zod_1.default.record(zod_1.default.object({
                name: zod_1.default.string(),
                path: zod_1.default.string(),
                type: zod_1.default.enum(['dir', 'file']),
                depth: zod_1.default.number(),
            })),
            hoveredDirectoryPath: zod_1.default.string().optional(),
            selectedPaths: zod_1.default.array(zod_1.default.string()).transform(() => []),
            openPaths: zod_1.default.array(zod_1.default.string()).transform(() => []),
            loadingPaths: zod_1.default.array(zod_1.default.string()).transform(() => []),
        }),
    }).optional(),
});
