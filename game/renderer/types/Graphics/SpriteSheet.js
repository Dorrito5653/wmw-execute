"use strict";
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
exports.SpriteSheet = void 0;
var Sprite_1 = require("./Sprite");
var Log_1 = require("../Util/Log");
/**
 * Represents a collection of sprites from a source image with some organization in a grid
 */
var SpriteSheet = /** @class */ (function () {
    /**
     * Build a new sprite sheet from a list of sprites
     *
     * Use [[SpriteSheet.fromImageSource]] to create a SpriteSheet from an [[ImageSource]] organized in a grid
     * @param options
     */
    function SpriteSheet(options) {
        this._logger = Log_1.Logger.getInstance();
        this.sprites = [];
        var sprites = options.sprites, rows = options.rows, columns = options.columns;
        this.sprites = sprites;
        this.rows = rows !== null && rows !== void 0 ? rows : 1;
        this.columns = columns !== null && columns !== void 0 ? columns : this.sprites.length;
    }
    /**
     * Find a sprite by their x/y position in the SpriteSheet, for example `getSprite(0, 0)` is the [[Sprite]] in the top-left
     * @param x
     * @param y
     */
    SpriteSheet.prototype.getSprite = function (x, y) {
        if (x >= this.columns || x < 0) {
            this._logger.warn("No sprite exists in the SpriteSheet at (".concat(x, ", ").concat(y, "), x: ").concat(x, " should be between 0 and ").concat(this.columns - 1));
            return null;
        }
        if (y >= this.rows || y < 0) {
            this._logger.warn("No sprite exists in the SpriteSheet at (".concat(x, ", ").concat(y, "), y: ").concat(y, " should be between 0 and ").concat(this.rows - 1));
            return null;
        }
        var spriteIndex = x + y * this.columns;
        return this.sprites[spriteIndex];
    };
    /**
     * Create a sprite sheet from a sparse set of [[SourceView]] rectangles
     * @param options
     */
    SpriteSheet.fromImageSourceWithSourceViews = function (options) {
        var sprites = options.sourceViews.map(function (sourceView) {
            return new Sprite_1.Sprite({
                image: options.image,
                sourceView: sourceView
            });
        });
        return new SpriteSheet({ sprites: sprites });
    };
    /**
     * Create a SpriteSheet from an [[ImageSource]] organized in a grid
     *
     * Example:
     * ```
     * const spriteSheet = SpriteSheet.fromImageSource({
     *   image: imageSource,
     *   grid: {
     *     rows: 5,
     *     columns: 2,
     *     spriteWidth: 32, // pixels
     *     spriteHeight: 32 // pixels
     *   },
     *   // Optionally specify spacing
     *   spacing: {
     *     // pixels from the top left to start the sprite parsing
     *     originOffset: {
     *       x: 5,
     *       y: 5
     *     },
     *     // pixels between each sprite while parsing
     *     margin: {
     *       x: 1,
     *       y: 1
     *     }
     *   }
     * })
     * ```
     *
     * @param options
     */
    SpriteSheet.fromImageSource = function (options) {
        var _a;
        var sprites = [];
        options.spacing = (_a = options.spacing) !== null && _a !== void 0 ? _a : {};
        var image = options.image, _b = options.grid, rows = _b.rows, cols = _b.columns, spriteWidth = _b.spriteWidth, spriteHeight = _b.spriteHeight, _c = options.spacing, originOffset = _c.originOffset, margin = _c.margin;
        var offsetDefaults = __assign({ x: 0, y: 0 }, originOffset);
        var marginDefaults = __assign({ x: 0, y: 0 }, margin);
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                sprites[x + y * cols] = new Sprite_1.Sprite({
                    image: image,
                    sourceView: {
                        x: x * spriteWidth + marginDefaults.x * x + offsetDefaults.x,
                        y: y * spriteHeight + marginDefaults.y * y + offsetDefaults.y,
                        width: spriteWidth,
                        height: spriteHeight
                    },
                    destSize: { height: spriteHeight, width: spriteWidth }
                });
            }
        }
        return new SpriteSheet({
            sprites: sprites,
            rows: rows,
            columns: cols
        });
    };
    return SpriteSheet;
}());
exports.SpriteSheet = SpriteSheet;
