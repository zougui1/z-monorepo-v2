"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const electron_1 = require("electron");
const radash_1 = require("radash");
const commander_1 = require("commander");
const _1 = require(".");
const program = new commander_1.Command();
program.argument('<path>', 'path at which to ooen the IDE; default = current directory');
program.parseAsync();
const argPath = program.args.at(0);
const pathToOpen = node_path_1.default.join(process.cwd(), argPath || '');
const createApp = async () => {
    const workspaceManager = new _1.WorkspaceManager();
    const [error] = await (0, radash_1.tryit)(workspaceManager.readCachedWorkspace)(pathToOpen);
    if (error || workspaceManager.workspaces.size === 0) {
        if (error)
            console.log('error', error);
        console.log('create new workspace');
        workspaceManager.createWorkspace(pathToOpen);
    }
    for (const workspace of workspaceManager.workspaces.values()) {
        await workspace.createWindow();
    }
};
electron_1.app.whenReady().then(async () => {
    await createApp();
});
