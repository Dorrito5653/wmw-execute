"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ImageSource = void 0;
var Resource_1 = require("../Resources/Resource");
var Sprite_1 = require("./Sprite");
var Log_1 = require("../Util/Log");
var _1 = require(".");
var Future_1 = require("../Util/Future");
var ImageSource = /** @class */ (function () {
    /**
     * The path to the image, can also be a data url like 'data:image/'
     * @param path {string} Path to the image resource relative from the HTML document hosting the game, or absolute
     * @param bustCache {boolean} Should excalibur add a cache busting querystring?
     * @param filtering {ImageFiltering} Optionally override the image filtering set by [[EngineOptions.antialiasing]]
     */
    function ImageSource(path, bustCache, filtering) {
        if (bustCache === void 0) { bustCache = false; }
        this.path = path;
        this._logger = Log_1.Logger.getInstance();
        /**
         * Access to the underlying html image element
         */
        this.data = new Image();
        this._readyFuture = new Future_1.Future();
        /**
         * Promise the resolves when the image is loaded and ready for use, does not initiate loading
         */
        this.ready = this._readyFuture.promise;
        this._resource = new Resource_1.Resource(path, 'blob', bustCache);
        this._filtering = filtering;
        if (path.endsWith('.svg') || path.endsWith('.gif')) {
            this._logger.warn("Image type is not fully supported, you may have mixed results ".concat(path, ". Fully supported: jpg, bmp, and png"));
        }
    }
    Object.defineProperty(ImageSource.prototype, "width", {
        /**
         * The original size of the source image in pixels
         */
        get: function () {
            return this.image.naturalWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageSource.prototype, "height", {
        /**
         * The original height of the source image in pixels
         */
        get: function () {
            return this.image.naturalHeight;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns true if the Texture is completely loaded and is ready
     * to be drawn.
     */
    ImageSource.prototype.isLoaded = function () {
        if (!this._src) {
            // this boosts speed of access
            this._src = this.data.src;
        }
        return !!this._src;
    };
    Object.defineProperty(ImageSource.prototype, "image", {
        get: function () {
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Begins loading the image and returns a promise that resolves when the image is loaded
     */
    ImageSource.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, blob, image, loadedFuture_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isLoaded()) {
                            return [2 /*return*/, this.data];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        url = void 0;
                        if (!!this.path.includes('data:image/')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._resource.load()];
                    case 2:
                        blob = _a.sent();
                        url = URL.createObjectURL(blob);
                        return [3 /*break*/, 4];
                    case 3:
                        url = this.path;
                        _a.label = 4;
                    case 4:
                        image = new Image();
                        loadedFuture_1 = new Future_1.Future();
                        image.onload = function () { return loadedFuture_1.resolve(); };
                        image.src = url;
                        image.setAttribute('data-original-src', this.path);
                        return [4 /*yield*/, loadedFuture_1.promise];
                    case 5:
                        _a.sent();
                        // Set results
                        this.data = image;
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        throw "Error loading ImageSource from path '".concat(this.path, "' with error [").concat(error_1.message, "]");
                    case 7:
                        _1.TextureLoader.load(this.data, this._filtering);
                        // todo emit complete
                        this._readyFuture.resolve(this.data);
                        return [2 /*return*/, this.data];
                }
            });
        });
    };
    /**
     * Build a sprite from this ImageSource
     */
    ImageSource.prototype.toSprite = function () {
        return Sprite_1.Sprite.from(this);
    };
    /**
     * Unload images from memory
     */
    ImageSource.prototype.unload = function () {
        this.data = new Image();
    };
    return ImageSource;
}());
exports.ImageSource = ImageSource;
