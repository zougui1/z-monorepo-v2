"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBounds = void 0;
const getAxisBounds_1 = require("./getAxisBounds");
const parseDirection_1 = require("./parseDirection");
const enums_1 = require("../enums");
const getBounds = (element, options) => {
    const { startWidth, minWidth, maxWidth, startHeight, minHeight, maxHeight, startX, startY, clientX, clientY, maxLeft, maxTop, direction, enabledHandles, } = options;
    const directions = (0, parseDirection_1.parseDirection)(direction).filter(direction => enabledHandles.includes(direction));
    const resizeLeft = directions.includes(enums_1.Position.left);
    const resizeRight = directions.includes(enums_1.Position.right);
    const resizeTop = directions.includes(enums_1.Position.top);
    const resizeBottom = directions.includes(enums_1.Position.bottom);
    const result = {
        height: undefined,
        width: undefined,
        top: undefined,
        left: undefined,
    };
    if (resizeLeft || resizeRight) {
        const { size, position } = (0, getAxisBounds_1.getAxisBounds)({
            oppositeDirection: resizeLeft,
            size: element.clientWidth,
            startSize: startWidth,
            minSize: minWidth,
            maxSize: maxWidth,
            cursorPosition: clientX,
            currentPosition: element.clientLeft,
            startPosition: startX,
            maxPosition: maxLeft,
            windowSize: window.innerWidth,
        });
        result.left = position;
        result.width = size;
    }
    if (resizeTop || resizeBottom) {
        const { size, position } = (0, getAxisBounds_1.getAxisBounds)({
            oppositeDirection: resizeTop,
            size: element.clientHeight,
            startSize: startHeight,
            minSize: minHeight,
            maxSize: maxHeight,
            cursorPosition: clientY,
            currentPosition: element.clientTop,
            startPosition: startY,
            maxPosition: maxTop,
            windowSize: window.innerHeight,
        });
        result.top = position;
        result.height = size;
    }
    return result;
};
exports.getBounds = getBounds;
