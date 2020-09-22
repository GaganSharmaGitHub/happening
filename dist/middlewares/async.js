"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
exports.asyncHandler = function (f) { return function (req, res, next) {
    Promise.resolve(f(req, res, next)).catch(next);
}; };
