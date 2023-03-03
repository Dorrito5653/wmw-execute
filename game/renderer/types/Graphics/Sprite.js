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
exports.Sprite = void 0;
var Graphic_1 = require("./Graphic");
var Log_1 = require("../Util/Log");
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, options) || this;
        _this._logger = Log_1.Logger.getInstance();
        _this._dirty = true;
        _this._logNotLoadedWarning = false;
        _this.image = options.image;
        var width = options.width, height = options.height;
        _this.sourceView = (_a = options.sourceView) !== null && _a !== void 0 ? _a : { x: 0, y: 0, width: width !== null && width !== void 0 ? width : 0, height: height !== null && height !== void 0 ? height : 0 };
        _this.destSize = (_b = options.destSize) !== null && _b !== void 0 ? _b : { width: width !== null && width !== void 0 ? width : 0, height: height !== null && height !== void 0 ? height : 0 };
        _this._updateSpriteDimensions();
        _this.image.ready.then(function () {
            _this._updateSpriteDimensions();
        });
        return _this;
    }
    Sprite.from = function (image) {
        return new Sprite({
            image: image
        });
    };
    Object.defineProperty(Sprite.prototype, "width", {
        get: function () {
            return Math.abs(this.destSize.width * this.scale.x);
        },
        set: function (newWidth) {
            newWidth /= Math.abs(this.scale.x);
            this.destSize.width = newWidth;
            _super.prototype.width = Math.ceil(this.destSize.width);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "height", {
        get: function () {
            return Math.abs(this.destSize.height * this.scale.y);
        },
        set: function (newHeight) {
            newHeight /= Math.abs(this.scale.y);
            this.destSize.height = newHeight;
            _super.prototype.height = Math.ceil(this.destSize.height);
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype._updateSpriteDimensions = function () {
        var _a, _b, _c, _d, _e, _f;
        var _g = this.image, nativeWidth = _g.width, nativeHeight = _g.height;
        // This code uses || to avoid 0's
        // If the source is not specified, use the native dimension
        this.sourceView.width = ((_a = this.sourceView) === null || _a === void 0 ? void 0 : _a.width) || nativeWidth;
        this.sourceView.height = ((_b = this.sourceView) === null || _b === void 0 ? void 0 : _b.height) || nativeHeight;
        // If the destination is not specified, use the source if specified, then native
        this.destSize.width = ((_c = this.destSize) === null || _c === void 0 ? void 0 : _c.width) || ((_d = this.sourceView) === null || _d === void 0 ? void 0 : _d.width) || nativeWidth;
        this.destSize.height = ((_e = this.destSize) === null || _e === void 0 ? void 0 : _e.height) || ((_f = this.sourceView) === null || _f === void 0 ? void 0 : _f.height) || nativeHeight;
        this.width = Math.ceil(this.destSize.width) * this.scale.x;
        this.height = Math.ceil(this.destSize.height) * this.scale.y;
    };
    Sprite.prototype._preDraw = function (ex, x, y) {
        if (this.image.isLoaded() && this._dirty) {
            this._dirty = false;
            this._updateSpriteDimensions();
        }
        _super.prototype._preDraw.call(this, ex, x, y);
    };
    Sprite.prototype._drawImage = function (ex, x, y) {
        if (this.image.isLoaded()) {
            ex.drawImage(this.image.image, this.sourceView.x, this.sourceView.y, this.sourceView.width, this.sourceView.height, x, y, this.destSize.width, this.destSize.height);
        }
        else {
            if (!this._logNotLoadedWarning) {
                this._logger.warn("ImageSource ".concat(this.image.path) +
                    " is not yet loaded and won't be drawn. Please call .load() or include in a Loader.\n\n" +
                    "Read https://excaliburjs.com/docs/imagesource for more information.");
            }
            this._logNotLoadedWarning = true;
        }
    };
    Sprite.prototype.clone = function () {
        return new Sprite(__assign({ image: this.image, sourceView: __assign({}, this.sourceView), destSize: __assign({}, this.destSize) }, this.cloneGraphicOptions()));
    };
    return Sprite;
}(Graphic_1.Graphic));
exports.Sprite = Sprite;
