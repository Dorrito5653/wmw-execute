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
exports.Font = void 0;
var Index_1 = require("../Collision/Index");
var Color_1 = require("../Color");
var DrawUtil_1 = require("../Util/DrawUtil");
var FontCommon_1 = require("./FontCommon");
var Graphic_1 = require("./Graphic");
var _1 = require(".");
var Filtering_1 = require("./Filtering");
/**
 * Represents a system or web font in Excalibur
 *
 * If no options specified, the system sans-serif 10 pixel is used
 *
 * If loading a custom web font be sure to have the font loaded before you use it https://erikonarheim.com/posts/dont-test-fonts/
 */
var Font = /** @class */ (function (_super) {
    __extends(Font, _super);
    function Font(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        _this = _super.call(this, options) || this; // <- Graphics properties
        /**
         * Set the font filtering mode, by default set to [[ImageFiltering.Blended]] regardless of the engine default smoothing
         *
         * If you have a pixel style font that may be a reason to switch this to [[ImageFiltering.Pixel]]
         */
        _this.filtering = Filtering_1.ImageFiltering.Blended;
        /**
         * Font quality determines the size of the underlying raster text, higher quality means less jagged edges.
         * If quality is set to 1, then just enough raster bitmap is generated to render the text.
         *
         * You can think of quality as how zoomed in to the text you can get before seeing jagged edges.
         *
         * (Default 2)
         */
        _this.quality = 2;
        // Raster properties for fonts
        _this.padding = 2;
        _this.smoothing = false;
        _this.lineWidth = 1;
        _this.lineDash = [];
        _this.color = Color_1.Color.Black;
        _this.family = 'sans-serif';
        _this.style = FontCommon_1.FontStyle.Normal;
        _this.bold = false;
        _this.unit = FontCommon_1.FontUnit.Px;
        _this.textAlign = FontCommon_1.TextAlign.Left;
        _this.baseAlign = FontCommon_1.BaseAlign.Alphabetic;
        _this.direction = FontCommon_1.Direction.LeftToRight;
        _this.size = 10;
        _this.shadow = null;
        _this._textBounds = new Index_1.BoundingBox();
        _this._cachedTextMeasurement = new Map();
        _this._bitmapToTextMeasurement = new Map();
        _this._textToBitmap = new Map();
        _this._bitmapUsage = new Map();
        _this._textFragments = [];
        // Raster properties
        _this.smoothing = (_a = options === null || options === void 0 ? void 0 : options.smoothing) !== null && _a !== void 0 ? _a : _this.smoothing;
        _this.padding = (_b = options === null || options === void 0 ? void 0 : options.padding) !== null && _b !== void 0 ? _b : _this.padding;
        _this.color = (_c = options === null || options === void 0 ? void 0 : options.color) !== null && _c !== void 0 ? _c : _this.color;
        _this.strokeColor = (_d = options === null || options === void 0 ? void 0 : options.strokeColor) !== null && _d !== void 0 ? _d : _this.strokeColor;
        _this.lineDash = (_e = options === null || options === void 0 ? void 0 : options.lineDash) !== null && _e !== void 0 ? _e : _this.lineDash;
        _this.lineWidth = (_f = options === null || options === void 0 ? void 0 : options.lineWidth) !== null && _f !== void 0 ? _f : _this.lineWidth;
        _this.filtering = (_g = options === null || options === void 0 ? void 0 : options.filtering) !== null && _g !== void 0 ? _g : _this.filtering;
        // Font specific properties
        _this.family = (_h = options === null || options === void 0 ? void 0 : options.family) !== null && _h !== void 0 ? _h : _this.family;
        _this.style = (_j = options === null || options === void 0 ? void 0 : options.style) !== null && _j !== void 0 ? _j : _this.style;
        _this.bold = (_k = options === null || options === void 0 ? void 0 : options.bold) !== null && _k !== void 0 ? _k : _this.bold;
        _this.size = (_l = options === null || options === void 0 ? void 0 : options.size) !== null && _l !== void 0 ? _l : _this.size;
        _this.unit = (_m = options === null || options === void 0 ? void 0 : options.unit) !== null && _m !== void 0 ? _m : _this.unit;
        _this.textAlign = (_o = options === null || options === void 0 ? void 0 : options.textAlign) !== null && _o !== void 0 ? _o : _this.textAlign;
        _this.baseAlign = (_p = options === null || options === void 0 ? void 0 : options.baseAlign) !== null && _p !== void 0 ? _p : _this.baseAlign;
        _this.direction = (_q = options === null || options === void 0 ? void 0 : options.direction) !== null && _q !== void 0 ? _q : _this.direction;
        _this.quality = (_r = options === null || options === void 0 ? void 0 : options.quality) !== null && _r !== void 0 ? _r : _this.quality;
        if (options === null || options === void 0 ? void 0 : options.shadow) {
            _this.shadow = {};
            _this.shadow.blur = (_s = options.shadow.blur) !== null && _s !== void 0 ? _s : _this.shadow.blur;
            _this.shadow.offset = (_t = options.shadow.offset) !== null && _t !== void 0 ? _t : _this.shadow.offset;
            _this.shadow.color = (_u = options.shadow.color) !== null && _u !== void 0 ? _u : _this.shadow.color;
        }
        return _this;
    }
    Font.prototype.clone = function () {
        return new Font(__assign(__assign({}, this.cloneGraphicOptions()), { size: this.size, unit: this.unit, family: this.family, style: this.style, bold: this.bold, textAlign: this.textAlign, baseAlign: this.baseAlign, direction: this.direction, shadow: this.shadow
                ? {
                    blur: this.shadow.blur,
                    offset: this.shadow.offset,
                    color: this.shadow.color
                }
                : null }));
    };
    Object.defineProperty(Font.prototype, "fontString", {
        get: function () {
            return "".concat(this.style, " ").concat(this.bold ? 'bold' : '', " ").concat(this.size).concat(this.unit, " ").concat(this.family);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Font.prototype, "localBounds", {
        get: function () {
            return this._textBounds;
        },
        enumerable: false,
        configurable: true
    });
    Font.prototype._drawImage = function (_ex, _x, _y) {
        // TODO weird vestigial drawimage
    };
    Font.prototype._rotate = function (ex) {
        var _a;
        // TODO this needs to change depending on the bounding box...
        var origin = (_a = this.origin) !== null && _a !== void 0 ? _a : this._textBounds.center;
        ex.translate(origin.x, origin.y);
        ex.rotate(this.rotation);
        ex.translate(-origin.x, -origin.y);
    };
    Font.prototype._flip = function (ex) {
        if (this.flipHorizontal) {
            ex.translate(this._textBounds.width / this.scale.x, 0);
            ex.scale(-1, 1);
        }
        if (this.flipVertical) {
            ex.translate(0, -this._textBounds.height / 2 / this.scale.y);
            ex.scale(1, -1);
        }
    };
    /**
     * Returns a BoundingBox that is the total size of the text including multiple lines
     *
     * Does not include any padding or adjustment
     * @param text
     * @returns BoundingBox
     */
    Font.prototype.measureText = function (text) {
        var measurementDirty = false;
        var cached = this._cachedTextMeasurement.get(text);
        if (!cached) {
            measurementDirty = true;
        }
        var rasterProps = this._getRasterPropertiesHash();
        if (!cached || rasterProps !== cached.rasterProps) {
            measurementDirty = true;
        }
        if (measurementDirty) {
            var lines = text.split('\n');
            var maxWidthLine = lines.reduce(function (a, b) {
                return a.length > b.length ? a : b;
            });
            var ctx = this._getTextBitmap(text);
            this._applyFont(ctx); // font must be applied to the context to measure it
            var metrics = ctx.measureText(maxWidthLine);
            var textHeight = Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
            // TODO lineheight makes the text bounds wonky
            var lineAdjustedHeight = textHeight * lines.length;
            textHeight = lineAdjustedHeight;
            var bottomBounds = lineAdjustedHeight - Math.abs(metrics.actualBoundingBoxAscent);
            var x = 0;
            var y = 0;
            // this._cachedText = text;
            // this._cachedRasterProps = rasterProps;
            // this._measurementDirty = false;
            var measurement = new Index_1.BoundingBox({
                left: x - Math.abs(metrics.actualBoundingBoxLeft) - this.padding,
                top: y - Math.abs(metrics.actualBoundingBoxAscent) - this.padding,
                bottom: y + bottomBounds + this.padding,
                right: x + Math.abs(metrics.actualBoundingBoxRight) + this.padding
            });
            cached = {
                text: text,
                rasterProps: rasterProps,
                measurement: measurement
            };
            this._cachedTextMeasurement.set(text, cached);
            this._bitmapToTextMeasurement.set(ctx, cached);
            return cached.measurement;
        }
        else {
            return cached.measurement;
        }
    };
    Font.prototype._setDimension = function (textBounds, bitmap) {
        // Changing the width and height clears the context properties
        // We double the bitmap width to account for all possible alignment
        // We scale by "quality" so we render text without jaggies
        bitmap.canvas.width = (textBounds.width + this.padding * 2) * 2 * this.quality;
        bitmap.canvas.height = (textBounds.height + this.padding * 2) * 2 * this.quality;
    };
    Font.prototype._postDraw = function (ex) {
        ex.restore();
    };
    /**
     * We need to identify bitmaps with more than just the text content
     *
     * Any properties that can change the rendering of the text
     */
    Font.prototype._getRasterPropertiesHash = function (color) {
        var _a, _b;
        var hash = '__hashcode__' +
            this.fontString +
            this.showDebug +
            this.textAlign +
            this.baseAlign +
            this.direction +
            JSON.stringify(this.shadow) +
            (this.padding.toString() +
                this.smoothing.toString() +
                this.lineWidth.toString() +
                this.lineDash.toString() +
                ((_a = this.strokeColor) === null || _a === void 0 ? void 0 : _a.toString()) +
                (color ? color.toString() : (_b = this.color) === null || _b === void 0 ? void 0 : _b.toString()).toString());
        return hash;
    };
    Font.prototype._applyRasterProperties = function (ctx, color) {
        var _a, _b, _c;
        ctx.translate(this.padding, this.padding);
        ctx.imageSmoothingEnabled = this.smoothing;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash((_a = this.lineDash) !== null && _a !== void 0 ? _a : ctx.getLineDash());
        ctx.strokeStyle = (_b = this.strokeColor) === null || _b === void 0 ? void 0 : _b.toString();
        ctx.fillStyle = color ? color.toString() : (_c = this.color) === null || _c === void 0 ? void 0 : _c.toString();
    };
    Font.prototype._applyFont = function (ctx) {
        ctx.translate(this.padding + ctx.canvas.width / 2, this.padding + ctx.canvas.height / 2);
        ctx.scale(this.quality, this.quality);
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.baseAlign;
        ctx.font = this.fontString;
        ctx.direction = this.direction;
        if (this.shadow) {
            ctx.shadowColor = this.shadow.color.toString();
            ctx.shadowBlur = this.shadow.blur;
            ctx.shadowOffsetX = this.shadow.offset.x;
            ctx.shadowOffsetY = this.shadow.offset.y;
        }
    };
    Font.prototype._drawText = function (ctx, text, colorOverride, lineHeight) {
        var lines = text.split('\n');
        this._applyRasterProperties(ctx, colorOverride);
        this._applyFont(ctx);
        for (var i = 0; i < lines.length; i++) {
            var line_1 = lines[i];
            if (this.color) {
                ctx.fillText(line_1, 0, i * lineHeight);
            }
            if (this.strokeColor) {
                ctx.strokeText(line_1, 0, i * lineHeight);
            }
        }
        if (this.showDebug) {
            // Horizontal line
            /* istanbul ignore next */
            (0, DrawUtil_1.line)(ctx, Color_1.Color.Red, -ctx.canvas.width / 2, 0, ctx.canvas.width / 2, 0, 2);
            // Vertical line
            /* istanbul ignore next */
            (0, DrawUtil_1.line)(ctx, Color_1.Color.Red, 0, -ctx.canvas.height / 2, 0, ctx.canvas.height / 2, 2);
        }
    };
    Font.prototype._getTextBitmap = function (text, color) {
        var textAndHash = text + this._getRasterPropertiesHash(color);
        var bitmap = this._textToBitmap.get(textAndHash);
        if (bitmap) {
            return bitmap;
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        this._textToBitmap.set(textAndHash, ctx);
        return ctx;
    };
    Font.prototype._splitTextBitmap = function (bitmap) {
        var textImages = [];
        var currentX = 0;
        var currentY = 0;
        // 4k is the max for mobile devices
        var width = Math.min(4096, bitmap.canvas.width);
        var height = Math.min(4096, bitmap.canvas.height);
        // Splits the original bitmap into 4k max chunks
        while (currentX < bitmap.canvas.width) {
            while (currentY < bitmap.canvas.height) {
                // create new bitmap
                var canvas_1 = document.createElement('canvas');
                canvas_1.width = width;
                canvas_1.height = height;
                var ctx = canvas_1.getContext('2d');
                // draw current slice to new bitmap in < 4k chunks
                ctx.drawImage(bitmap.canvas, currentX, currentY, width, height, 0, 0, width, height);
                textImages.push({ x: currentX, y: currentY, canvas: canvas_1 });
                currentY += height;
            }
            currentX += width;
            currentY = 0;
        }
        return textImages;
    };
    Font.prototype.render = function (ex, text, colorOverride, x, y) {
        if (this.showDebug) {
            this.clearCache();
        }
        this.checkAndClearCache();
        // Get bitmap for rastering text, this is cached by raster properties
        var bitmap = this._getTextBitmap(text, colorOverride);
        var isNewBitmap = !this._bitmapUsage.get(bitmap);
        // Bounds of the text
        this._textBounds = this.measureText(text);
        if (isNewBitmap) {
            // Setting dimension is expensive because it invalidates the bitmap
            this._setDimension(this._textBounds, bitmap);
        }
        // Apply affine transformations
        this._preDraw(ex, x, y);
        var lines = text.split('\n');
        var lineHeight = this._textBounds.height / lines.length;
        if (isNewBitmap) {
            // draws the text to the bitmap
            this._drawText(bitmap, text, colorOverride, lineHeight);
            // clean up any existing fragments
            for (var _i = 0, _a = this._textFragments; _i < _a.length; _i++) {
                var frag = _a[_i];
                _1.TextureLoader["delete"](frag.canvas);
            }
            this._textFragments = this._splitTextBitmap(bitmap);
            for (var _b = 0, _c = this._textFragments; _b < _c.length; _b++) {
                var frag = _c[_b];
                _1.TextureLoader.load(frag.canvas, this.filtering, true);
            }
        }
        // draws the bitmap fragments to excalibur graphics context
        for (var _d = 0, _e = this._textFragments; _d < _e.length; _d++) {
            var frag = _e[_d];
            ex.drawImage(frag.canvas, 0, 0, frag.canvas.width, frag.canvas.height, frag.x / this.quality + x - bitmap.canvas.width / this.quality / 2, frag.y / this.quality + y - bitmap.canvas.height / this.quality / 2, frag.canvas.width / this.quality, frag.canvas.height / this.quality);
        }
        this._postDraw(ex);
        // Cache the bitmap for certain amount of time
        this._bitmapUsage.set(bitmap, performance.now());
    };
    Object.defineProperty(Font.prototype, "cacheSize", {
        /**
         * Get the internal cache size of the font
         * This is useful when debugging memory usage, these numbers indicate the number of cached in memory text bitmaps
         */
        get: function () {
            return this._bitmapUsage.size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Force clear all cached text bitmaps
     */
    Font.prototype.clearCache = function () {
        this._bitmapUsage.clear();
    };
    /**
     * Remove any expired cached text bitmaps
     */
    Font.prototype.checkAndClearCache = function () {
        for (var _i = 0, _a = this._bitmapUsage.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], bitmap = _b[0], time = _b[1];
            // if bitmap hasn't been used in 1 second clear it
            if (time + 1000 < performance.now()) {
                this._bitmapUsage["delete"](bitmap);
                // Cleanup measurements
                var measurement = this._bitmapToTextMeasurement.get(bitmap);
                if (measurement) {
                    this._cachedTextMeasurement["delete"](measurement.text);
                    this._bitmapToTextMeasurement["delete"](bitmap);
                }
                _1.TextureLoader["delete"](bitmap.canvas);
            }
        }
    };
    return Font;
}(Graphic_1.Graphic));
exports.Font = Font;
