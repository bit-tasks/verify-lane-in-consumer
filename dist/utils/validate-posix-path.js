"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPOSIXPath = void 0;
function isValidPOSIXPath(path) {
    const posixPathPattern = /^(\/|\.\/|\.\.\/)?([^\/\0]+(\/)?)+$/;
    return posixPathPattern.test(path);
}
exports.isValidPOSIXPath = isValidPOSIXPath;
