"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetResizeDirection = void 0;
const getResizeDirection_1 = require("./getResizeDirection");
const enums_1 = require("../enums");
const createGetResizeDirection = (options) => {
    const { diagonalOffset, enabledHandles, diagonalsDisabled } = options;
    return (element, e, handle) => {
        if (diagonalsDisabled) {
            return enums_1.Direction[handle];
        }
        return (0, getResizeDirection_1.getResizeDirection)(element, {
            handle,
            diagonalOffset,
            enabledHandles,
            clientX: e.clientX,
            clientY: e.clientY,
        });
    };
};
exports.createGetResizeDirection = createGetResizeDirection;
