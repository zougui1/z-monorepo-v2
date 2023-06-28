"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePath = void 0;
const common_string_utils_1 = require("@zougui/common.string-utils");
/**
 * add a leading slash to the path and remove any trailing slash
 * @param path
 * @returns
 */
const normalizePath = (path, options) => {
    const withLeadingSlash = options?.noLeadingSlash
        ? path
        : (0, common_string_utils_1.prefixWith)(path, '/');
    return (0, common_string_utils_1.removeSuffix)(withLeadingSlash, '/');
};
exports.normalizePath = normalizePath;
