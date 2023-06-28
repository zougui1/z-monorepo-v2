"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const story_ide_electron_api_1 = require("@zougui/story-ide.electron-api");
const fs_business_1 = require("./fs.business");
const utils_1 = require("../../utils");
const globals_1 = require("../../globals");
exports.router = new utils_1.Router();
exports.router.on(story_ide_electron_api_1.electronApi.fs.index, async (req) => {
    return await (0, fs_business_1.getNodes)(globals_1.globals.dir, req.body.path);
});
exports.router.on(story_ide_electron_api_1.electronApi.fs.file, async (req) => {
    return await (0, fs_business_1.getFileContent)(globals_1.globals.dir, req.body.path);
});
exports.router.on(story_ide_electron_api_1.electronApi.fs.delete, async (req) => {
    await (0, fs_business_1.deleteNodes)(globals_1.globals.dir, req.body.paths);
    return {};
});
exports.router.on(story_ide_electron_api_1.electronApi.fs.rename, async (req) => {
    const { oldPath, newPath } = req.body;
    await (0, fs_business_1.renameNode)(globals_1.globals.dir, oldPath, newPath);
    return {};
});
