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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Circle = void 0;
var _1 = require(".");
var Raster_1 = require("./Raster");
/**
 * A circle [[Graphic]] for drawing circles to the [[ExcaliburGraphicsContext]]
 *
 * Circles default to [[ImageFiltering.Blended]]
 */
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, options) || this;
        _this._radius = 0;
        _this.padding = (_a = options.padding) !== null && _a !== void 0 ? _a : 2; // default 2 padding for circles looks nice
        _this.radius = options.radius;
        _this.filtering = (_b = options.filtering) !== null && _b !== void 0 ? _b : _1.ImageFiltering.Blended;
        _this.rasterize();
        return _this;
    }
    Object.defineProperty(Circle.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
            this.width = this._radius * 2;
            this.height = this._radius * 2;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Circle.prototype.clone = function () {
        return new Circle(__assign(__assign({ radius: this.radius }, this.cloneGraphicOptions()), this.cloneRasterOptions()));
    };
    Circle.prototype.execute = function (ctx) {
        if (this.radius > 0) {
            ctx.beginPath();
            ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2);
            if (this.color) {
                ctx.fill();
            }
            if (this.strokeColor) {
                ctx.stroke();
            }
        }
    };
    return Circle;
}(Raster_1.Raster));
exports.Circle = Circle;
