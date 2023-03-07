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
exports.Line = void 0;
var BoundingBox_1 = require("../Collision/BoundingBox");
var Color_1 = require("../Color");
var Graphic_1 = require("./Graphic");
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(options) {
        var _this = _super.call(this) || this;
        _this.color = Color_1.Color.Black;
        _this.thickness = 1;
        var start = options.start, end = options.end, color = options.color, thickness = options.thickness;
        _this.start = start;
        _this.end = end;
        _this.color = color !== null && color !== void 0 ? color : _this.color;
        _this.thickness = thickness !== null && thickness !== void 0 ? thickness : _this.thickness;
        var _a = BoundingBox_1.BoundingBox.fromPoints([start, end]), width = _a.width, height = _a.height;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Line.prototype._drawImage = function (ctx, _x, _y) {
        ctx.drawLine(this.start, this.end, this.color, this.thickness);
    };
    Line.prototype.clone = function () {
        return new Line({
            start: this.start,
            end: this.end,
            color: this.color,
            thickness: this.thickness
        });
    };
    return Line;
}(Graphic_1.Graphic));
exports.Line = Line;
