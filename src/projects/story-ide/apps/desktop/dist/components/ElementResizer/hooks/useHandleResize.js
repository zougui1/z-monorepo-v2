"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleResize = void 0;
const hooks_1 = require("~/hooks");
const utils_1 = require("../utils");
const useHandleResize = (ref, handle, options) => {
    const { enabledHandles, maxHeight, maxWidth, minHeight, minWidth, onChange, } = options;
    (0, hooks_1.useWindowEvent)('mousemove', e => {
        if (!handle.current || !ref.current) {
            return;
        }
        const bounds = (0, utils_1.getBounds)(ref.current, {
            ...handle.current,
            enabledHandles,
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
            clientX: e.clientX,
            clientY: e.clientY,
        });
        onChange(bounds);
    });
};
exports.useHandleResize = useHandleResize;
