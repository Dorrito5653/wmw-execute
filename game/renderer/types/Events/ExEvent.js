"use strict";
exports.__esModule = true;
exports.ExEvent = void 0;
var ExEvent = /** @class */ (function () {
    function ExEvent() {
        this._active = true;
    }
    Object.defineProperty(ExEvent.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: false,
        configurable: true
    });
    ExEvent.prototype.cancel = function () {
        this._active = false;
    };
    return ExEvent;
}());
exports.ExEvent = ExEvent;
