"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const story_ide_electron_api_1 = require("@zougui/story-ide.electron-api");
const state_business_1 = require("./state.business");
const utils_1 = require("../../utils");
exports.router = new utils_1.Router();
exports.router.on(story_ide_electron_api_1.electronApi.state.get, async (req) => {
    return (0, state_business_1.getState)(req.sender.id);
});
