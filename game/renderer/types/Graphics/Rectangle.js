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
exports.Rectangle = void 0;
var Raster_1 = require("./Raster");
/**
 * A Rectangle [[Graphic]] for drawing rectangles to the [[ExcaliburGraphicsContext]]
 */
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(options) {
        var _this = _super.call(this, options) || this;
        _this.width = options.width;
        _this.height = options.height;
        _this.rasterize();
        return _this;
    }
    Rectangle.prototype.clone = function () {
        return new Rectangle(__assign(__assign({ width: this.width, height: this.height }, this.cloneGraphicOptions()), this.cloneRasterOptions()));
    };
    Rectangle.prototype.execute = function (ctx) {
        if (this.color) {
            ctx.fillRect(0, 0, this.width, this.height);
        }
        if (this.strokeColor) {
            ctx.strokeRect(0, 0, this.width, this.height);
        }
    };
    return Rectangle;
}(Raster_1.Raster));
exports.Rectangle = Rectangle;
