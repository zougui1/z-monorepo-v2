"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const commander_1 = require("commander");
const app_1 = require("./app");
const globals_1 = require("./globals");
const program = new commander_1.Command();
program.argument('<path>', 'path at which to ooen the IDE; default = current directory');
program.parseAsync();
const argPath = program.args.at(0);
globals_1.globals.dir = argPath?.[0] === '/'
    ? argPath
    : node_path_1.default.join(process.cwd(), argPath || '');
(0, app_1.createApp)(globals_1.globals.dir)
    .catch(error => console.error(error));
