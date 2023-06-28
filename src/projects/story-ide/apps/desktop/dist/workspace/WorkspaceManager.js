"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceManager = void 0;
const electron_1 = require("electron");
const common_percent_utils_1 = require("@zougui/common.percent-utils");
const Workspace_1 = require("./Workspace");
const WorkspaceCache_1 = require("./WorkspaceCache");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
class WorkspaceManager {
    workspaces = new Map();
    cache = new WorkspaceCache_1.WorkspaceCache();
    readCachedWorkspace = async (path) => {
        const id = (0, utils_1.hashPath)(path);
        const workspaceData = await this.cache.getWorkspace(id);
        if (!workspaceData) {
            return;
        }
        const workspace = new Workspace_1.Workspace(workspaceData);
        this.workspaces.set(workspaceData.id, workspace);
    };
    createWorkspace = (path) => {
        const point = electron_1.screen.getCursorScreenPoint();
        const pointingDisplay = electron_1.screen.getDisplayNearestPoint(point);
        const width = common_percent_utils_1.Percent.apply(constants_1.widthPercent, pointingDisplay.bounds.width);
        const height = common_percent_utils_1.Percent.apply(constants_1.heightPercent, pointingDisplay.bounds.height);
        // open the window centered to the currently focused screen screen
        const top = pointingDisplay.bounds.y + (pointingDisplay.bounds.height / 2) - (height / 2);
        const left = pointingDisplay.bounds.x + (pointingDisplay.bounds.width / 2) - (width / 2);
        const workspace = Workspace_1.Workspace.new({
            path,
            width,
            height,
            top,
            left,
            url: constants_1.defaultUrl,
            isFullscreen: false,
            isMaximized: false,
            isMinimized: false,
        });
        this.workspaces.set(workspace.id, workspace);
    };
    findWorkspaceByWindowId = (id) => {
        const workspaces = Array.from(this.workspaces.values());
        return workspaces.find(workspace => workspace.window?.id === id);
    };
}
exports.WorkspaceManager = WorkspaceManager;
