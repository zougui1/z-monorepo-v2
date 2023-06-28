"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const electron_1 = require("electron");
const radash_1 = require("radash");
const globals_1 = require("./globals");
const router_1 = require("./router");
const createApp = async (dir) => {
    await electron_1.app.whenReady();
    await startApp(dir);
};
exports.createApp = createApp;
const startApp = async (dir) => {
    electron_1.ipcMain.on('state', (event, state) => {
        const workspace = globals_1.workspaceManager.findWorkspaceByWindowId(event.sender.id);
        workspace?.persistState(state);
    });
    const [error] = await (0, radash_1.tryit)(globals_1.workspaceManager.readCachedWorkspace)(dir);
    if (error || globals_1.workspaceManager.workspaces.size === 0) {
        if (error)
            console.log('error', error);
        console.log('create new workspace');
        globals_1.workspaceManager.createWorkspace(dir);
    }
    for (const [path, handler] of Object.entries(router_1.router.handlers)) {
        handleRoute(path, handler);
    }
    for (const workspace of globals_1.workspaceManager.workspaces.values()) {
        await workspace.createWindow();
    }
};
const handleRoute = (path, handler) => {
    electron_1.ipcMain.on(path, async (event, req) => {
        try {
            console.log(path);
            const body = await handler.schemas.params.parseAsync(req.body);
            const result = await handler.handle({
                ...req,
                body,
                sender: { id: event.sender.id },
            });
            const response = {
                headers: { id: req.headers.id },
                body: result,
            };
            event.reply(`${path}.success`, response);
        }
        catch (error) {
            console.log('communication error:', error);
            const response = {
                headers: { id: req.headers.id },
                body: error,
            };
            event.reply(`${path}.error`, response);
        }
    });
};
