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
exports.VectorView = void 0;
var vector_1 = require("./vector");
var VectorView = /** @class */ (function (_super) {
    __extends(VectorView, _super);
    function VectorView(options) {
        var _this = _super.call(this, 0, 0) || this;
        _this._getX = options.getX;
        _this._getY = options.getY;
        _this._setX = options.setX;
        _this._setY = options.setY;
        return _this;
    }
    Object.defineProperty(VectorView.prototype, "x", {
        get: function () {
            return (this._x = this._getX());
        },
        set: function (val) {
            this._setX(val);
            this._x = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VectorView.prototype, "y", {
        get: function () {
            return (this._y = this._getY());
        },
        set: function (val) {
            this._setY(val);
            this._y = val;
        },
        enumerable: false,
        configurable: true
    });
    return VectorView;
}(vector_1.Vector));
exports.VectorView = VectorView;
