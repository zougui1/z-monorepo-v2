"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getState = void 0;
const globals_1 = require("../../globals");
const getState = (windowId) => {
    const workspace = globals_1.workspaceManager.findWorkspaceByWindowId(windowId);
    console.log('window', windowId, workspace?.data);
    return workspace?.data.state;
};
exports.getState = getState;
