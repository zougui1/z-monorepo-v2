"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentOffsets = void 0;
const enums_1 = require("../enums");
const constants_1 = require("../constants");
const getContentOffsets = (handles) => {
    const widthOffset = getWidthOffset(handles) * constants_1.handleSize;
    const heightOffset = getHeightOffset(handles) * constants_1.handleSize;
    return {
        width: `calc(100% - ${widthOffset}px)`,
        height: `calc(100% - ${heightOffset}px)`,
        marginLeft: handles.includes(enums_1.Position.left) ? constants_1.handleSize : 0,
        marginTop: handles.includes(enums_1.Position.top) ? constants_1.handleSize : 0,
    };
};
exports.getContentOffsets = getContentOffsets;
const getWidthOffset = (handles) => {
    const hasLeft = handles.includes(enums_1.Position.left);
    const hasRight = handles.includes(enums_1.Position.right);
    if (hasLeft && hasRight) {
        return 2;
    }
    if (hasLeft || hasRight) {
        return 1;
    }
    return 0;
};
const getHeightOffset = (handles) => {
    const hasTop = handles.includes(enums_1.Position.top);
    const hasBottom = handles.includes(enums_1.Position.bottom);
    if (hasTop && hasBottom) {
        return 2;
    }
    if (hasTop || hasBottom) {
        return 1;
    }
    return 0;
};
