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
exports.SpriteFont = void 0;
var vector_1 = require("../Math/vector");
var Log_1 = require("../Util/Log");
var Graphic_1 = require("./Graphic");
var __1 = require("..");
var SpriteFont = /** @class */ (function (_super) {
    __extends(SpriteFont, _super);
    function SpriteFont(options) {
        var _this = _super.call(this, options) || this;
        _this._text = '';
        _this.alphabet = '';
        _this.shadow = null;
        _this.caseInsensitive = false;
        _this.spacing = 0;
        _this._logger = Log_1.Logger.getInstance();
        _this._alreadyWarnedAlphabet = false;
        _this._alreadyWarnedSpriteSheet = false;
        var alphabet = options.alphabet, spriteSheet = options.spriteSheet, caseInsensitive = options.caseInsensitive, spacing = options.spacing, shadow = options.shadow;
        _this.alphabet = alphabet;
        _this.spriteSheet = spriteSheet;
        _this.caseInsensitive = caseInsensitive !== null && caseInsensitive !== void 0 ? caseInsensitive : _this.caseInsensitive;
        _this.spacing = spacing !== null && spacing !== void 0 ? spacing : _this.spacing;
        _this.shadow = shadow !== null && shadow !== void 0 ? shadow : _this.shadow;
        return _this;
    }
    SpriteFont.prototype._getCharacterSprites = function (text) {
        var results = [];
        // handle case insensitive
        var textToRender = this.caseInsensitive ? text.toLocaleLowerCase() : text;
        var alphabet = this.caseInsensitive ? this.alphabet.toLocaleLowerCase() : this.alphabet;
        // for each letter in text
        for (var letterIndex = 0; letterIndex < textToRender.length; letterIndex++) {
            // find the sprite index in alphabet , if there is an error pick the first
            var letter = textToRender[letterIndex];
            var spriteIndex = alphabet.indexOf(letter);
            if (spriteIndex === -1) {
                spriteIndex = 0;
                if (!this._alreadyWarnedAlphabet) {
                    this._logger.warn("SpriteFont - Cannot find letter '".concat(letter, "' in configured alphabet '").concat(alphabet, "'."));
                    this._logger.warn('There maybe be more issues in the SpriteFont configuration. No additional warnings will be logged.');
                    this._alreadyWarnedAlphabet = true;
                }
            }
            var letterSprite = this.spriteSheet.sprites[spriteIndex];
            if (letterSprite) {
                results.push(letterSprite);
            }
            else {
                if (!this._alreadyWarnedSpriteSheet) {
                    this._logger.warn("SpriteFont - Cannot find sprite for '".concat(letter, "' at index '").concat(spriteIndex, "' in configured SpriteSheet"));
                    this._logger.warn('There maybe be more issues in the SpriteFont configuration. No additional warnings will be logged.');
                    this._alreadyWarnedSpriteSheet = true;
                }
            }
        }
        return results;
    };
    SpriteFont.prototype.measureText = function (text) {
        var lines = text.split('\n');
        var maxWidthLine = lines.reduce(function (a, b) {
            return a.length > b.length ? a : b;
        });
        var sprites = this._getCharacterSprites(maxWidthLine);
        var width = 0;
        var height = 0;
        for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
            var sprite = sprites_1[_i];
            width += sprite.width + this.spacing;
            height = Math.max(height, sprite.height);
        }
        return __1.BoundingBox.fromDimension(width, height * lines.length, vector_1.Vector.Zero);
    };
    SpriteFont.prototype._drawImage = function (ex, x, y) {
        var xCursor = 0;
        var yCursor = 0;
        var height = 0;
        var lines = this._text.split('\n');
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            for (var _a = 0, _b = this._getCharacterSprites(line); _a < _b.length; _a++) {
                var sprite = _b[_a];
                // draw it in the right spot and increase the cursor by sprite width
                sprite.draw(ex, x + xCursor, y + yCursor);
                xCursor += sprite.width + this.spacing;
                height = Math.max(height, sprite.height);
            }
            xCursor = 0;
            yCursor += height;
        }
    };
    SpriteFont.prototype.render = function (ex, text, _color, x, y) {
        // SpriteFont doesn't support _color, yet...
        this._text = text;
        var bounds = this.measureText(text);
        this.width = bounds.width;
        this.height = bounds.height;
        if (this.shadow) {
            ex.save();
            ex.translate(this.shadow.offset.x, this.shadow.offset.y);
            this.draw(ex, x, y);
            ex.restore();
        }
        this.draw(ex, x, y);
    };
    SpriteFont.prototype.clone = function () {
        return new SpriteFont({
            alphabet: this.alphabet,
            spriteSheet: this.spriteSheet,
            spacing: this.spacing
        });
    };
    return SpriteFont;
}(Graphic_1.Graphic));
exports.SpriteFont = SpriteFont;
