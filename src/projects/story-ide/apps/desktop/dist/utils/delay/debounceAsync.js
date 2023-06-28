"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounceAsync = void 0;
const radash_1 = require("radash");
const debounceAsync = ({ delay }, func) => {
    const wrappedFunc = async (callback, ...args) => {
        try {
            const result = await func(...args);
            callback(undefined, result);
        }
        catch (error) {
            callback(error);
        }
    };
    const debouncedFunc = (0, radash_1.debounce)({ delay }, wrappedFunc);
    return (...args) => {
        return new Promise((resolve, reject) => {
            debouncedFunc((error, result) => {
                if (error)
                    reject(error);
                // @ts-ignore failed to write 100% type-safe code here
                else
                    resolve(result);
            }, ...args);
        });
    };
};
exports.debounceAsync = debounceAsync;
