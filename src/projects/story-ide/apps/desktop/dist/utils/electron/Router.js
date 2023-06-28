"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const path_1 = require("../path");
class Router {
    handlers = {};
    on(definition, handler) {
        this.handlers[(0, path_1.normalizePath)(definition.fullPath)] = {
            schemas: definition,
            handle: handler,
        };
    }
    use(router) {
        for (const [path, handler] of Object.entries(router.handlers)) {
            this.on({
                ...handler.schemas,
                fullPath: path,
            }, handler.handle);
        }
    }
}
exports.Router = Router;
