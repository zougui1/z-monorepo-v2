"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBridge = void 0;
const electron_1 = require("electron");
class ContextBridge {
    send = (channel, data) => {
        electron_1.ipcRenderer.send(channel, data);
    };
    on = (channel, listener) => {
        electron_1.ipcRenderer.on(channel, listener);
        return () => electron_1.ipcRenderer.off(channel, listener);
    };
    once = (channel, listener) => {
        electron_1.ipcRenderer.once(channel, listener);
        return () => electron_1.ipcRenderer.off(channel, listener);
    };
}
exports.ContextBridge = ContextBridge;
electron_1.contextBridge.exposeInMainWorld('electron', new ContextBridge());
