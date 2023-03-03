"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.WatchVector = void 0;
var vector_1 = require("./vector");
/**
 * Wraps a vector and watches for changes in the x/y, modifies the original vector.
 */
var WatchVector = /** @class */ (function (_super) {
    __extends(WatchVector, _super);
    function WatchVector(original, change) {
        var _this = _super.call(this, original.x, original.y) || this;
        _this.original = original;
        _this.change = change;
        return _this;
    }
    Object.defineProperty(WatchVector.prototype, "x", {
        get: function () {
            return this._x = this.original.x;
        },
        set: function (newX) {
            this.change(newX, this._y);
            this._x = this.original.x = newX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchVector.prototype, "y", {
        get: function () {
            return this._y = this.original.y;
        },
        set: function (newY) {
            this.change(this._x, newY);
            this._y = this.original.y = newY;
        },
        enumerable: false,
        configurable: true
    });
    return WatchVector;
}(vector_1.Vector));
exports.WatchVector = WatchVector;
