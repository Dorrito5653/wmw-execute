"use strict";
exports.__esModule = true;
exports.CallMethod = void 0;
var CallMethod = /** @class */ (function () {
    function CallMethod(method) {
        this._method = null;
        this._hasBeenCalled = false;
        this._method = method;
    }
    CallMethod.prototype.update = function (_delta) {
        this._method();
        this._hasBeenCalled = true;
    };
    CallMethod.prototype.isComplete = function () {
        return this._hasBeenCalled;
    };
    CallMethod.prototype.reset = function () {
        this._hasBeenCalled = false;
    };
    CallMethod.prototype.stop = function () {
        this._hasBeenCalled = true;
    };
    return CallMethod;
}());
exports.CallMethod = CallMethod;
