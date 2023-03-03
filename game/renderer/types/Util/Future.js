"use strict";
exports.__esModule = true;
exports.Future = void 0;
/**
 * Future is a wrapper around a native browser Promise to allow resolving/rejecting at any time
 */
var Future = /** @class */ (function () {
    function Future() {
        var _this = this;
        this._isCompleted = false;
        this.promise = new Promise(function (resolve, reject) {
            _this._resolver = resolve;
            _this._rejecter = reject;
        });
    }
    Object.defineProperty(Future.prototype, "isCompleted", {
        get: function () {
            return this._isCompleted;
        },
        enumerable: false,
        configurable: true
    });
    Future.prototype.resolve = function (value) {
        if (this._isCompleted) {
            return;
        }
        this._isCompleted = true;
        this._resolver(value);
    };
    Future.prototype.reject = function (error) {
        if (this._isCompleted) {
            return;
        }
        this._isCompleted = true;
        this._rejecter(error);
    };
    return Future;
}());
exports.Future = Future;
