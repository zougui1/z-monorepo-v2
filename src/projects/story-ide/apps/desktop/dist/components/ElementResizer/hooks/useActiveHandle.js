"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActiveHandle = void 0;
const react_1 = require("react");
const hooks_1 = require("~/hooks");
const utils_1 = require("../utils");
const useActiveHandle = (ref, options) => {
    const { diagonalOffset, enabledHandles, minHeight, minWidth, diagonalsDisabled, } = options;
    const handle = (0, react_1.useRef)(null);
    const getResizeDirection = (0, utils_1.createGetResizeDirection)({ diagonalOffset, diagonalsDisabled, enabledHandles });
    const onMouseDown = (e, position) => {
        if (!ref.current) {
            return;
        }
        const rect = ref.current.getBoundingClientRect();
        handle.current = {
            direction: getResizeDirection(ref.current, e, position),
            startX: e.clientX,
            startY: e.clientY,
            startWidth: ref.current.clientWidth,
            startHeight: ref.current.clientHeight,
            maxLeft: rect.right - minWidth,
            maxTop: rect.bottom - minHeight,
        };
    };
    (0, hooks_1.useWindowEvent)('mouseup', () => {
        // if the user has not clicked on a handle
        // then there is nothing to unset
        if (handle.current) {
            handle.current = null;
            document.body.style.cursor = 'unset';
        }
    });
    return {
        handle,
        onMouseDown,
    };
};
exports.useActiveHandle = useActiveHandle;
