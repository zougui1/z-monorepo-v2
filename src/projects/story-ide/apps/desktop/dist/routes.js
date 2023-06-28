"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = void 0;
const utils_1 = require("./utils");
const createRouter = (dir) => {
    const router = new utils_1.Router();
    router.on('get-files', req => {
        return [
            { path: '/readme.md', type: 'file' },
            { path: '/story', type: 'dir' },
        ];
    });
};
exports.createRouter = createRouter;
