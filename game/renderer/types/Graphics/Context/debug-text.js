"use strict";
exports.__esModule = true;
exports.DebugText = void 0;
var __1 = require("..");
var debug_font_png_1 = require("./debug-font.png");
/**
 * Internal debugtext helper
 */
var DebugText = /** @class */ (function () {
    function DebugText() {
        /**
         * base64 font
         */
        this.fontSheet = debug_font_png_1["default"];
        this.size = 16;
        this.load();
    }
    DebugText.prototype.load = function () {
        var _this = this;
        this._imageSource = new __1.ImageSource(this.fontSheet);
        return this._imageSource.load().then(function () {
            _this._spriteSheet = __1.SpriteSheet.fromImageSource({
                image: _this._imageSource,
                grid: {
                    rows: 3,
                    columns: 16,
                    spriteWidth: 16,
                    spriteHeight: 16
                }
            });
            _this._spriteFont = new __1.SpriteFont({
                alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ,!\'&."?-()+ ',
                caseInsensitive: true,
                spriteSheet: _this._spriteSheet,
                spacing: -6
            });
        });
    };
    /**
     * Writes debug text using the built in sprint font
     * @param ctx
     * @param text
     * @param pos
     */
    DebugText.prototype.write = function (ctx, text, pos) {
        if (this._imageSource.isLoaded()) {
            this._spriteFont.render(ctx, text, null, pos.x, pos.y);
        }
    };
    return DebugText;
}());
exports.DebugText = DebugText;
