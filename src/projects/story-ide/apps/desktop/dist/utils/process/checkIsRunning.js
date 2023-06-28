"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsRunning = void 0;
const execa_1 = __importDefault(require("execa"));
const os_1 = require("../os");
const checkIsRunning = async (query) => {
    const [command, ...args] = (0, os_1.selectByPlatform)({
        win32: ['tasklist'],
        darwin: ['ps', '-ax', ' | ', query],
        linux: ['ps', '-A', ' | ', query],
    }) || [];
    if (!command) {
        return false;
    }
    const result = await (0, execa_1.default)(command, args);
    return result.stdout.toLowerCase().includes(query.toLowerCase());
};
exports.checkIsRunning = checkIsRunning;
