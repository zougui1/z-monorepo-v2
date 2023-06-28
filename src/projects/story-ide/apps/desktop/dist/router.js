"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const utils_1 = require("./utils");
const features_1 = require("./features");
exports.router = new utils_1.Router();
exports.router.use(features_1.fs.router);
exports.router.use(features_1.state.router);
