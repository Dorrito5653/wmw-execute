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
exports.Raster = void 0;
var Graphic_1 = require("./Graphic");
var Color_1 = require("../Color");
var vector_1 = require("../Math/vector");
var BoundingBox_1 = require("../Collision/BoundingBox");
var Watch_1 = require("../Util/Watch");
var texture_loader_1 = require("./Context/texture-loader");
/**
 * A Raster is a Graphic that needs to be first painted to a HTMLCanvasElement before it can be drawn to the
 * [[ExcaliburGraphicsContext]]. This is useful for generating custom images using the 2D canvas api.
 *
 * Implementors must implement the [[Raster.execute]] method to rasterize their drawing.
 */
var Raster = /** @class */ (function (_super) {
    __extends(Raster, _super);
    function Raster(options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        _this = _super.call(this, options) || this;
        _this.filtering = null;
        _this.lineCap = 'butt';
        _this.quality = 1;
        _this._dirty = true;
        _this._smoothing = false;
        _this._color = (0, Watch_1.watch)(Color_1.Color.Black, function () { return _this.flagDirty(); });
        _this._lineWidth = 1;
        _this._lineDash = [];
        _this._padding = 0;
        if (options) {
            _this.quality = (_a = options.quality) !== null && _a !== void 0 ? _a : _this.quality;
            _this.color = (_b = options.color) !== null && _b !== void 0 ? _b : Color_1.Color.Black;
            _this.strokeColor = options === null || options === void 0 ? void 0 : options.strokeColor;
            _this.smoothing = (_c = options.smoothing) !== null && _c !== void 0 ? _c : _this.smoothing;
            _this.lineWidth = (_d = options.lineWidth) !== null && _d !== void 0 ? _d : _this.lineWidth;
            _this.lineDash = (_e = options.lineDash) !== null && _e !== void 0 ? _e : _this.lineDash;
            _this.lineCap = (_f = options.lineCap) !== null && _f !== void 0 ? _f : _this.lineCap;
            _this.padding = (_g = options.padding) !== null && _g !== void 0 ? _g : _this.padding;
            _this.filtering = (_h = options.filtering) !== null && _h !== void 0 ? _h : _this.filtering;
        }
        _this._bitmap = document.createElement('canvas');
        // get the default canvas width/height as a fallback
        var bitmapWidth = (_j = options === null || options === void 0 ? void 0 : options.width) !== null && _j !== void 0 ? _j : _this._bitmap.width;
        var bitmapHeight = (_k = options === null || options === void 0 ? void 0 : options.height) !== null && _k !== void 0 ? _k : _this._bitmap.height;
        _this.width = bitmapWidth;
        _this.height = bitmapHeight;
        var maybeCtx = _this._bitmap.getContext('2d');
        if (!maybeCtx) {
            /* istanbul ignore next */
            throw new Error('Browser does not support 2d canvas drawing, cannot create Raster graphic');
        }
        else {
            _this._ctx = maybeCtx;
        }
        return _this;
    }
    Raster.prototype.cloneRasterOptions = function () {
        return {
            color: this.color ? this.color.clone() : null,
            strokeColor: this.strokeColor ? this.strokeColor.clone() : null,
            smoothing: this.smoothing,
            lineWidth: this.lineWidth,
            lineDash: this.lineDash,
            lineCap: this.lineCap,
            quality: this.quality,
            padding: this.padding
        };
    };
    Object.defineProperty(Raster.prototype, "dirty", {
        /**
         * Gets whether the graphic is dirty, this means there are changes that haven't been re-rasterized
         */
        get: function () {
            return this._dirty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Flags the graphic as dirty, meaning it must be re-rasterized before draw.
     * This should be called any time the graphics state changes such that it affects the outputted drawing
     */
    Raster.prototype.flagDirty = function () {
        this._dirty = true;
    };
    Object.defineProperty(Raster.prototype, "width", {
        /**
         * Gets or sets the current width of the Raster graphic. Setting the width will cause the raster
         * to be flagged dirty causing a re-raster on the next draw.
         *
         * Any `padding`s or `quality` set will be factored into the width
         */
        get: function () {
            return Math.abs(this._getTotalWidth() * this.scale.x);
        },
        set: function (value) {
            value /= Math.abs(this.scale.x);
            this._bitmap.width = value;
            this._originalWidth = value;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raster.prototype, "height", {
        /**
         * Gets or sets the current height of the Raster graphic. Setting the height will cause the raster
         * to be flagged dirty causing a re-raster on the next draw.
         *
         * Any `padding` or `quality` set will be factored into the height
         */
        get: function () {
            return Math.abs(this._getTotalHeight() * this.scale.y);
        },
        set: function (value) {
            value /= Math.abs(this.scale.y);
            this._bitmap.height = value;
            this._originalHeight = value;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Raster.prototype._getTotalWidth = function () {
        var _a;
        return (((_a = this._originalWidth) !== null && _a !== void 0 ? _a : this._bitmap.width) + this.padding * 2) * 1;
    };
    Raster.prototype._getTotalHeight = function () {
        var _a;
        return (((_a = this._originalHeight) !== null && _a !== void 0 ? _a : this._bitmap.height) + this.padding * 2) * 1;
    };
    Object.defineProperty(Raster.prototype, "localBounds", {
        /**
         * Returns the local bounds of the Raster including the padding
         */
        get: function () {
            return BoundingBox_1.BoundingBox.fromDimension(this._getTotalWidth() * this.scale.x, this._getTotalHeight() * this.scale.y, vector_1.Vector.Zero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raster.prototype, "smoothing", {
        /**
         * Gets or sets the smoothing (anti-aliasing of the graphic). Setting the height will cause the raster
         * to be flagged dirty causing a re-raster on the next draw.
         */
        get: function () {
            return this._smoothing;
        },
        set: function (value) {
            this._smoothing = value;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raster.prototype, "color", {
        /**
         * Gets or sets the fillStyle of the Raster graphic. Setting the fillStyle will cause the raster to be
         * flagged dirty causing a re-raster on the next draw.
         */
        get: function () {
            return this._color;
        },
        set: function (value) {
            var _this = this;
            this.flagDirty();
            this._color = (0, Watch_1.watch)(value, function () { return _this.flagDirty(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raster.prototype, "strokeColor", {
        /**
         * Gets or sets the strokeStyle of the Raster graphic. Setting the strokeStyle will cause the raster to be
         * flagged dirty causing a re-raster on the next draw.
         */
        get: function () {
            return this._strokeColor;
        },
        set: function (value) {
            var _this = this;
            this.flagDirty();
            this._strokeColor = (0, Watch_1.watch)(value, function () { return _this.flagDirty(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raster.prototype, "lineWidth", {
        /**
         * Gets or sets the line width of the Raster graphic. Setting the lineWidth will cause the raster to be
         * flagged dirty causing a re-raster on the next draw.
         */
        get: function () {
            return this._lineWidth;
        },
        set: function (value) {
            this._lineWidth = value;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raster.prototype, "lineDash", {
        get: function () {
            return this._lineDash;
        },
        set: function (value) {
            this._lineDash = value;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raster.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        set: function (value) {
            this._padding = value;
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Rasterize the graphic to a bitmap making it usable as in excalibur. Rasterize is called automatically if
     * the graphic is [[Raster.dirty]] on the next [[Graphic.draw]] call
     */
    Raster.prototype.rasterize = function () {
        this._dirty = false;
        this._ctx.clearRect(0, 0, this._getTotalWidth(), this._getTotalHeight());
        this._ctx.save();
        this._applyRasterProperties(this._ctx);
        this.execute(this._ctx);
        this._ctx.restore();
        // The webgl texture needs to be updated if it exists after a raster cycle
        texture_loader_1.TextureLoader.load(this._bitmap, this.filtering, true);
    };
    Raster.prototype._applyRasterProperties = function (ctx) {
        var _a, _b, _c;
        this._bitmap.width = this._getTotalWidth() * this.quality;
        this._bitmap.height = this._getTotalHeight() * this.quality;
        ctx.scale(this.quality, this.quality);
        ctx.translate(this.padding, this.padding);
        ctx.imageSmoothingEnabled = this.smoothing;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash((_a = this.lineDash) !== null && _a !== void 0 ? _a : ctx.getLineDash());
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = (_b = this.strokeColor) === null || _b === void 0 ? void 0 : _b.toString();
        ctx.fillStyle = (_c = this.color) === null || _c === void 0 ? void 0 : _c.toString();
    };
    Raster.prototype._drawImage = function (ex, x, y) {
        if (this._dirty) {
            this.rasterize();
        }
        ex.scale(1 / this.quality, 1 / this.quality);
        ex.drawImage(this._bitmap, x, y);
    };
    return Raster;
}(Graphic_1.Graphic));
exports.Raster = Raster;
