"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectByPlatform = void 0;
function selectByPlatform(select, required) {
    if (process.platform in select) {
        return select[process.platform];
    }
    if (required) {
        throw new Error('Unsupported OS');
    }
    return select.default;
}
exports.selectByPlatform = selectByPlatform;
