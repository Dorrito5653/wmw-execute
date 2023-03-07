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
exports.Polygon = void 0;
var _1 = require(".");
var vector_1 = require("../Math/vector");
var Raster_1 = require("./Raster");
/**
 * A polygon [[Graphic]] for drawing arbitrary polygons to the [[ExcaliburGraphicsContext]]
 *
 * Polygons default to [[ImageFiltering.Blended]]
 */
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon(options) {
        var _this = _super.call(this, options) || this;
        _this.points = options.points;
        _this.filtering = _1.ImageFiltering.Blended;
        _this.rasterize();
        return _this;
    }
    Object.defineProperty(Polygon.prototype, "points", {
        get: function () {
            return this._points;
        },
        set: function (points) {
            this._points = points;
            var min = this.minPoint;
            this.width = this._points.reduce(function (max, p) { return Math.max(p.x, max); }, 0) - min.x;
            this.height = this._points.reduce(function (max, p) { return Math.max(p.y, max); }, 0) - min.y;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "minPoint", {
        get: function () {
            var minX = this._points.reduce(function (min, p) { return Math.min(p.x, min); }, Infinity);
            var minY = this._points.reduce(function (min, p) { return Math.min(p.y, min); }, Infinity);
            return (0, vector_1.vec)(minX, minY);
        },
        enumerable: false,
        configurable: true
    });
    Polygon.prototype.clone = function () {
        return new Polygon(__assign(__assign({ points: this.points.map(function (p) { return p.clone(); }) }, this.cloneGraphicOptions()), this.cloneRasterOptions()));
    };
    Polygon.prototype.execute = function (ctx) {
        if (this.points && this.points.length) {
            ctx.beginPath();
            // Iterate through the supplied points and construct a 'polygon'
            var min_1 = this.minPoint.negate();
            var firstPoint = this.points[0].add(min_1);
            ctx.moveTo(firstPoint.x, firstPoint.y);
            this.points.forEach(function (point) {
                ctx.lineTo(point.x + min_1.x, point.y + min_1.y);
            });
            ctx.lineTo(firstPoint.x, firstPoint.y);
            ctx.closePath();
            if (this.color) {
                ctx.fill();
            }
            if (this.strokeColor) {
                ctx.stroke();
            }
        }
    };
    return Polygon;
}(Raster_1.Raster));
exports.Polygon = Polygon;
