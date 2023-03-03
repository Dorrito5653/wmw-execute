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
exports.Text = void 0;
var Graphic_1 = require("./Graphic");
var Color_1 = require("../Color");
var Font_1 = require("./Font");
/**
 * Represent Text graphics in excalibur
 *
 * Useful for in game labels, ui, or overlays
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, options) || this;
        _this._text = '';
        _this._textWidth = 0;
        _this._textHeight = 0;
        // This order is important font, color, then text
        _this.font = (_a = options.font) !== null && _a !== void 0 ? _a : new Font_1.Font();
        _this.color = (_b = options.color) !== null && _b !== void 0 ? _b : _this.color;
        _this.text = options.text;
        return _this;
    }
    Text.prototype.clone = function () {
        var _a, _b;
        return new Text({
            text: this.text.slice(),
            color: (_b = (_a = this.color) === null || _a === void 0 ? void 0 : _a.clone()) !== null && _b !== void 0 ? _b : Color_1.Color.Black,
            font: this.font.clone()
        });
    };
    Object.defineProperty(Text.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            var bounds = this.font.measureText(this._text);
            this._textWidth = bounds.width;
            this._textHeight = bounds.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "font", {
        get: function () {
            return this._font;
        },
        set: function (font) {
            this._font = font;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "width", {
        get: function () {
            if (this._textWidth === 0) {
                this._calculateDimension();
            }
            return this._textWidth * this.scale.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "height", {
        get: function () {
            if (this._textHeight === 0) {
                this._calculateDimension();
            }
            return this._textHeight * this.scale.y;
        },
        enumerable: false,
        configurable: true
    });
    Text.prototype._calculateDimension = function () {
        var _a = this.font.measureText(this._text), width = _a.width, height = _a.height;
        this._textWidth = width;
        this._textHeight = height;
    };
    Object.defineProperty(Text.prototype, "localBounds", {
        get: function () {
            return this.font.measureText(this._text).scale(this.scale);
        },
        enumerable: false,
        configurable: true
    });
    Text.prototype._rotate = function (_ex) {
        // None this is delegated to font
        // This override erases the default behavior
    };
    Text.prototype._flip = function (_ex) {
        // None this is delegated to font
        // This override erases the default behavior
    };
    Text.prototype._drawImage = function (ex, x, y) {
        var _a;
        var color = Color_1.Color.Black;
        if (this.font instanceof Font_1.Font) {
            color = (_a = this.color) !== null && _a !== void 0 ? _a : this.font.color;
        }
        if (this.isStale() || this.font.isStale()) {
            this.font.flipHorizontal = this.flipHorizontal;
            this.font.flipVertical = this.flipVertical;
            this.font.rotation = this.rotation;
            this.font.origin = this.origin;
            this.font.opacity = this.opacity;
        }
        this.font.tint = this.tint;
        var _b = this.font.measureText(this._text), width = _b.width, height = _b.height;
        this._textWidth = width;
        this._textHeight = height;
        this.font.render(ex, this._text, color, x, y);
        if (this.font.showDebug) {
            ex.debug.drawRect(x - width, y - height, width * 2, height * 2);
        }
    };
    return Text;
}(Graphic_1.Graphic));
exports.Text = Text;
