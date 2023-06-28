"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisBounds = void 0;
const math_1 = require("~/utils/math");
const minPosition = 0;
const getAxisBounds = (options) => {
    const { size, startSize, minSize, maxSize, cursorPosition, currentPosition, startPosition, windowSize, oppositeDirection, } = options;
    const maxPosition = oppositeDirection ? options.maxPosition : (windowSize - 5);
    const positionBound = new math_1.Bound(minPosition, maxPosition);
    const sizeBound = new math_1.Bound(minSize, maxSize);
    const newPosition = positionBound.clamp(cursorPosition);
    const sizeDelta = oppositeDirection
        ? (startPosition - newPosition)
        : (newPosition - startPosition);
    const computedSize = startSize + sizeDelta;
    const newSize = sizeBound.clamp(computedSize);
    // this condition is necessary because of a bug where an offset is created when
    // trying to resize the element outside of its min/max bounds
    if (!sizeBound.inRange(computedSize) || !positionBound.inRange(cursorPosition)) {
        // ensures that the element is at min/max width if it isn't already
        if (sizeBound.clamp(size) !== newSize && (!currentPosition || positionBound.clamp(currentPosition) !== newPosition)) {
            return {
                size: newSize,
                position: oppositeDirection ? newPosition : undefined,
            };
        }
    }
    else {
        return {
            size: newSize,
            position: oppositeDirection ? newPosition : undefined,
        };
    }
    return {
        size,
        position: undefined,
    };
};
exports.getAxisBounds = getAxisBounds;
