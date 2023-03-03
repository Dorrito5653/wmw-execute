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
exports.Canvas = void 0;
var Raster_1 = require("./Raster");
/**
 * A canvas [[Graphic]] to provide an adapter between the 2D Canvas API and the [[ExcaliburGraphicsContext]].
 *
 * The [[Canvas]] works by re-rastering a draw handler to a HTMLCanvasElement for every draw which is then passed
 * to the [[ExcaliburGraphicsContext]] implementation as a rendered image.
 *
 * **Low performance API**
 */
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas(_options) {
        var _this = _super.call(this, _options) || this;
        _this._options = _options;
        return _this;
    }
    Object.defineProperty(Canvas.prototype, "ctx", {
        /**
         * Return the 2D graphics context of this canvas
         */
        get: function () {
            return this._ctx;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.clone = function () {
        return new Canvas(__assign(__assign(__assign({}, this._options), this.cloneGraphicOptions()), this.cloneRasterOptions()));
    };
    Canvas.prototype.execute = function (ctx) {
        var _a, _b;
        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.draw) {
            (_b = this._options) === null || _b === void 0 ? void 0 : _b.draw(ctx);
        }
        if (!this._options.cache) {
            this.flagDirty();
        }
    };
    return Canvas;
}(Raster_1.Raster));
exports.Canvas = Canvas;
