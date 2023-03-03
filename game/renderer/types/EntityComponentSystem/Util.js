"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.buildTypeKey = void 0;
var buildTypeKey = function (types) {
    var key = __spreadArray([], types, true).sort(function (a, b) { return a.localeCompare(b); }).join('+');
    return key;
};
exports.buildTypeKey = buildTypeKey;
