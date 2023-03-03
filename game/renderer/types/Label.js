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
exports.Label = void 0;
var vector_1 = require("./Math/vector");
var Text_1 = require("./Graphics/Text");
var Graphics_1 = require("./Graphics");
var Font_1 = require("./Graphics/Font");
var Actor_1 = require("./Actor");
/**
 * Labels are the way to draw small amounts of text to the screen. They are
 * actors and inherit all of the benefits and capabilities.
 */
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    /**
     * Build a new label
     * @param options
     */
    function Label(options) {
        var _this = _super.call(this, options) || this;
        _this._font = new Font_1.Font();
        _this._text = new Text_1.Text({ text: '', font: _this._font });
        var text = options.text, pos = options.pos, x = options.x, y = options.y, spriteFont = options.spriteFont, font = options.font, color = options.color;
        _this.pos = pos !== null && pos !== void 0 ? pos : (x && y ? (0, vector_1.vec)(x, y) : _this.pos);
        _this.text = text !== null && text !== void 0 ? text : _this.text;
        _this.font = font !== null && font !== void 0 ? font : _this.font;
        _this.spriteFont = spriteFont !== null && spriteFont !== void 0 ? spriteFont : _this.spriteFont;
        _this._text.color = color !== null && color !== void 0 ? color : _this.color;
        var gfx = _this.get(Graphics_1.GraphicsComponent);
        gfx.anchor = vector_1.Vector.Zero;
        gfx.use(_this._text);
        return _this;
    }
    Object.defineProperty(Label.prototype, "font", {
        get: function () {
            return this._font;
        },
        set: function (newFont) {
            this._font = newFont;
            this._text.font = newFont;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "text", {
        /**
         * The text to draw.
         */
        get: function () {
            return this._text.text;
        },
        set: function (text) {
            this._text.text = text;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "color", {
        get: function () {
            return this._text.color;
        },
        set: function (color) {
            if (this._text) {
                this._text.color = color;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "opacity", {
        get: function () {
            return this._text.opacity;
        },
        set: function (opacity) {
            this._text.opacity = opacity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "spriteFont", {
        /**
         * The [[SpriteFont]] to use, if any. Overrides [[Font|font]] if present.
         */
        get: function () {
            return this._spriteFont;
        },
        set: function (sf) {
            if (sf) {
                this._spriteFont = sf;
                this._text.font = this._spriteFont;
            }
        },
        enumerable: false,
        configurable: true
    });
    Label.prototype._initialize = function (engine) {
        _super.prototype._initialize.call(this, engine);
    };
    /**
     * Returns the width of the text in the label (in pixels);
     */
    Label.prototype.getTextWidth = function () {
        return this._text.width;
    };
    return Label;
}(Actor_1.Actor));
exports.Label = Label;
