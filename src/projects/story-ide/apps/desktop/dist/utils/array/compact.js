"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compact = void 0;
const type_1 = require("../type");
const compact = (array) => {
    return array.filter(value => !(0, type_1.isNullish)(value));
};
exports.compact = compact;
