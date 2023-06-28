"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandle = void 0;
const useActiveHandle_1 = require("./useActiveHandle");
const useHandleMouseCursor_1 = require("./useHandleMouseCursor");
const useHandleResize_1 = require("./useHandleResize");
const useHandle = (ref, options) => {
    const { onChange, diagonalsDisabled, diagonalOffset, enabledHandles, minWidth, maxWidth, minHeight, maxHeight, } = options;
    const { handle, ...activeHandleProps } = (0, useActiveHandle_1.useActiveHandle)(ref, {
        diagonalOffset,
        minHeight,
        minWidth,
        diagonalsDisabled,
        enabledHandles,
    });
    const mouseCursorHandlers = (0, useHandleMouseCursor_1.useHandleMouseCursor)(ref, handle, {
        diagonalOffset,
        diagonalsDisabled,
        enabledHandles,
    });
    (0, useHandleResize_1.useHandleResize)(ref, handle, {
        enabledHandles,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        onChange,
    });
    return {
        ...activeHandleProps,
        ...mouseCursorHandlers,
    };
};
exports.useHandle = useHandle;
