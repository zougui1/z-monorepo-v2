"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDirection = void 0;
const enums_1 = require("../enums");
const parseDirection = (direction) => {
    switch (direction) {
        case enums_1.Direction.top:
        case enums_1.Direction.left:
        case enums_1.Direction.bottom:
        case enums_1.Direction.right:
            return [enums_1.Position[direction]];
        case enums_1.Direction.topLeft:
            return [enums_1.Position.top, enums_1.Position.left];
        case enums_1.Direction.topRight:
            return [enums_1.Position.top, enums_1.Position.right];
        case enums_1.Direction.bottomLeft:
            return [enums_1.Position.bottom, enums_1.Position.left];
        case enums_1.Direction.bottomRight:
            return [enums_1.Position.bottom, enums_1.Position.right];
        default:
            console.warn(`Invalid direction "${direction}"`);
            return [];
    }
};
exports.parseDirection = parseDirection;
