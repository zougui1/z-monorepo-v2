"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResizeDirection = void 0;
const array_1 = require("~/utils/array");
const enums_1 = require("../enums");
const bottomLeft = [enums_1.Position.bottom, enums_1.Position.left];
const bottomRight = [enums_1.Position.bottom, enums_1.Position.right];
const topLeft = [enums_1.Position.top, enums_1.Position.left];
const topRight = [enums_1.Position.top, enums_1.Position.right];
const getResizeDirection = (element, options) => {
    const { clientX, clientY, handle, enabledHandles, diagonalOffset } = options;
    const rect = element.getBoundingClientRect();
    const isOnTop = clientY <= (rect.y + diagonalOffset);
    const isOnLeft = clientX <= (rect.x + diagonalOffset);
    const isOnBottom = clientY >= (rect.y + rect.height - diagonalOffset);
    const isOnRight = clientX >= (rect.x + rect.width - diagonalOffset);
    if ((0, array_1.includesAll)(enabledHandles, bottomLeft) && ((handle === enums_1.Position.left && isOnBottom) || (handle === enums_1.Position.bottom && isOnLeft))) {
        return enums_1.Direction.bottomLeft;
    }
    if ((0, array_1.includesAll)(enabledHandles, bottomRight) && ((handle === enums_1.Position.right && isOnBottom) || (handle === enums_1.Position.bottom && isOnRight))) {
        return enums_1.Direction.bottomRight;
    }
    if ((0, array_1.includesAll)(enabledHandles, topLeft) && ((handle === enums_1.Position.left && isOnTop) || (handle === enums_1.Position.top && isOnLeft))) {
        return enums_1.Direction.topLeft;
    }
    if ((0, array_1.includesAll)(enabledHandles, topRight) && ((handle === enums_1.Position.right && isOnTop) || (handle === enums_1.Position.top && isOnRight))) {
        return enums_1.Direction.topRight;
    }
    return enums_1.Direction[handle];
};
exports.getResizeDirection = getResizeDirection;
