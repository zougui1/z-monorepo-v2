"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceManager = exports.globals = void 0;
const workspace_1 = require("./workspace");
exports.globals = {
    dir: '',
};
exports.workspaceManager = new workspace_1.WorkspaceManager();
