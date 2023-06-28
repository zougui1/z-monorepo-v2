"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleMouseCursor = void 0;
const utils_1 = require("../utils");
const resizeCursors_1 = require("../resizeCursors");
const useHandleMouseCursor = (ref, handle, options) => {
    const getResizeDirection = (0, utils_1.createGetResizeDirection)(options);
    const onMouseMove = (e, position) => {
        if (!ref.current || handle.current) {
            return;
        }
        const direction = getResizeDirection(ref.current, e, position);
        document.body.style.cursor = resizeCursors_1.resizeCursors[direction];
    };
    const onMouseLeave = () => {
        if (handle.current) {
            return;
        }
        document.body.style.cursor = 'unset';
    };
    return {
        onMouseLeave,
        onMouseMove,
    };
};
exports.useHandleMouseCursor = useHandleMouseCursor;
