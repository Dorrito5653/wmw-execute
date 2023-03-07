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
exports.Loader = void 0;
var Color_1 = require("./Color");
var WebAudio_1 = require("./Util/WebAudio");
var Class_1 = require("./Class");
var DrawUtil = require("./Util/DrawUtil");
var Loader_logo_png_1 = require("./Loader.logo.png");
var Loader_css_1 = require("./Loader.css");
var Canvas_1 = require("./Graphics/Canvas");
var Util_1 = require("./Util/Util");
var Filtering_1 = require("./Graphics/Filtering");
var util_1 = require("./Math/util");
var Sound_1 = require("./Resources/Sound/Sound");
var Future_1 = require("./Util/Future");
/**
 * Pre-loading assets
 *
 * The loader provides a mechanism to preload multiple resources at
 * one time. The loader must be passed to the engine in order to
 * trigger the loading progress bar.
 *
 * The [[Loader]] itself implements [[Loadable]] so you can load loaders.
 *
 * ## Example: Pre-loading resources for a game
 *
 * ```js
 * // create a loader
 * var loader = new ex.Loader();
 *
 * // create a resource dictionary (best practice is to keep a separate file)
 * var resources = {
 *   TextureGround: new ex.Texture("/images/textures/ground.png"),
 *   SoundDeath: new ex.Sound("/sound/death.wav", "/sound/death.mp3")
 * };
 *
 * // loop through dictionary and add to loader
 * for (var loadable in resources) {
 *   if (resources.hasOwnProperty(loadable)) {
 *     loader.addResource(resources[loadable]);
 *   }
 * }
 *
 * // start game
 * game.start(loader).then(function () {
 *   console.log("Game started!");
 * });
 * ```
 *
 * ## Customize the Loader
 *
 * The loader can be customized to show different, text, logo, background color, and button.
 *
 * ```typescript
 * const loader = new ex.Loader([playerTexture]);
 *
 * // The loaders button text can simply modified using this
 * loader.playButtonText = 'Start the best game ever';
 *
 * // The logo can be changed by inserting a base64 image string here
 *
 * loader.logo = 'data:image/png;base64,iVBORw...';
 * loader.logoWidth = 15;
 * loader.logoHeight = 14;
 *
 * // The background color can be changed like so by supplying a valid CSS color string
 *
 * loader.backgroundColor = 'red'
 * loader.backgroundColor = '#176BAA'
 *
 * // To build a completely new button
 * loader.startButtonFactory = () => {
 *     let myButton = document.createElement('button');
 *     myButton.textContent = 'The best button';
 *     return myButton;
 * };
 *
 * engine.start(loader).then(() => {});
 * ```
 */
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    /**
     * @param loadables  Optionally provide the list of resources you want to load at constructor time
     */
    function Loader(loadables) {
        var _this = _super.call(this) || this;
        _this.canvas = new Canvas_1.Canvas({
            filtering: Filtering_1.ImageFiltering.Blended,
            smoothing: true,
            cache: true,
            draw: _this.draw.bind(_this)
        });
        _this._resourceList = [];
        _this._index = 0;
        _this._playButtonShown = false;
        _this._resourceCount = 0;
        _this._numLoaded = 0;
        _this._progressCounts = {};
        _this._totalCounts = {};
        // logo drawing stuff
        // base64 string encoding of the excalibur logo (logo-white.png)
        _this.logo = Loader_logo_png_1["default"];
        _this.logoWidth = 468;
        _this.logoHeight = 118;
        /**
         * Gets or sets the color of the loading bar, default is [[Color.White]]
         */
        _this.loadingBarColor = Color_1.Color.White;
        /**
         * Gets or sets the background color of the loader as a hex string
         */
        _this.backgroundColor = '#176BAA';
        _this.suppressPlayButton = false;
        /** Loads the css from Loader.css */
        _this._playButtonStyles = Loader_css_1["default"].toString();
        /**
         * Get/set play button text
         */
        _this.playButtonText = 'Play game';
        /**
         * Return a html button element for excalibur to use as a play button
         */
        _this.startButtonFactory = function () {
            var buttonElement = document.getElementById('excalibur-play');
            if (!buttonElement) {
                buttonElement = document.createElement('button');
            }
            buttonElement.id = 'excalibur-play';
            buttonElement.textContent = _this.playButtonText;
            buttonElement.style.display = 'none';
            return buttonElement;
        };
        _this._loadingFuture = new Future_1.Future();
        if (loadables) {
            _this.addResources(loadables);
        }
        return _this;
    }
    Object.defineProperty(Loader.prototype, "_image", {
        get: function () {
            if (!this._imageElement) {
                this._imageElement = new Image();
                this._imageElement.src = this.logo;
            }
            return this._imageElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Loader.prototype, "playButtonRootElement", {
        get: function () {
            return this._playButtonRootElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Loader.prototype, "playButtonElement", {
        get: function () {
            return this._playButtonElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Loader.prototype, "_playButton", {
        get: function () {
            var existingRoot = document.getElementById('excalibur-play-root');
            if (existingRoot) {
                this._playButtonRootElement = existingRoot;
            }
            if (!this._playButtonRootElement) {
                this._playButtonRootElement = document.createElement('div');
                this._playButtonRootElement.id = 'excalibur-play-root';
                this._playButtonRootElement.style.position = 'absolute';
                document.body.appendChild(this._playButtonRootElement);
            }
            if (!this._styleBlock) {
                this._styleBlock = document.createElement('style');
                this._styleBlock.textContent = this._playButtonStyles;
                document.head.appendChild(this._styleBlock);
            }
            if (!this._playButtonElement) {
                this._playButtonElement = this.startButtonFactory();
                this._playButtonRootElement.appendChild(this._playButtonElement);
            }
            return this._playButtonElement;
        },
        enumerable: false,
        configurable: true
    });
    Loader.prototype.wireEngine = function (engine) {
        this._engine = engine;
        this.canvas.width = this._engine.canvas.width;
        this.canvas.height = this._engine.canvas.height;
    };
    /**
     * Add a resource to the loader to load
     * @param loadable  Resource to add
     */
    Loader.prototype.addResource = function (loadable) {
        var key = this._index++;
        this._resourceList.push(loadable);
        this._progressCounts[key] = 0;
        this._totalCounts[key] = 1;
        this._resourceCount++;
    };
    /**
     * Add a list of resources to the loader to load
     * @param loadables  The list of resources to load
     */
    Loader.prototype.addResources = function (loadables) {
        var i = 0;
        var len = loadables.length;
        for (i; i < len; i++) {
            this.addResource(loadables[i]);
        }
    };
    /**
     * Returns true if the loader has completely loaded all resources
     */
    Loader.prototype.isLoaded = function () {
        return this._numLoaded === this._resourceCount;
    };
    /**
     * Shows the play button and returns a promise that resolves when clicked
     */
    Loader.prototype.showPlayButton = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var resizeHandler_1, playButtonClicked;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.suppressPlayButton) return [3 /*break*/, 2];
                        this.hidePlayButton();
                        // Delay is to give the logo a chance to show, otherwise don't delay
                        return [4 /*yield*/, (0, Util_1.delay)(500, (_a = this._engine) === null || _a === void 0 ? void 0 : _a.clock)];
                    case 1:
                        // Delay is to give the logo a chance to show, otherwise don't delay
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        resizeHandler_1 = function () {
                            _this._positionPlayButton();
                        };
                        if ((_b = this._engine) === null || _b === void 0 ? void 0 : _b.browser) {
                            this._engine.browser.window.on('resize', resizeHandler_1);
                        }
                        this._playButtonShown = true;
                        this._playButton.style.display = 'block';
                        document.body.addEventListener('keyup', function (evt) {
                            if (evt.key === 'Enter') {
                                _this._playButton.click();
                            }
                        });
                        this._positionPlayButton();
                        playButtonClicked = new Promise(function (resolve) {
                            var startButtonHandler = function (e) {
                                var _a;
                                // We want to stop propagation to keep bubbling to the engine pointer handlers
                                e.stopPropagation();
                                // Hide Button after click
                                _this.hidePlayButton();
                                if ((_a = _this._engine) === null || _a === void 0 ? void 0 : _a.browser) {
                                    _this._engine.browser.window.off('resize', resizeHandler_1);
                                }
                                resolve();
                            };
                            _this._playButton.addEventListener('click', startButtonHandler);
                            _this._playButton.addEventListener('touchend', startButtonHandler);
                            _this._playButton.addEventListener('pointerup', startButtonHandler);
                        });
                        return [4 /*yield*/, playButtonClicked];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Loader.prototype.hidePlayButton = function () {
        this._playButtonShown = false;
        this._playButton.style.display = 'none';
    };
    /**
     * Clean up generated elements for the loader
     */
    Loader.prototype.dispose = function () {
        if (this._playButtonRootElement.parentElement) {
            this._playButtonRootElement.removeChild(this._playButtonElement);
            document.body.removeChild(this._playButtonRootElement);
            document.head.removeChild(this._styleBlock);
            this._playButtonRootElement = null;
            this._playButtonElement = null;
            this._styleBlock = null;
        }
    };
    Loader.prototype.update = function (_engine, _delta) {
        // override me
    };
    Loader.prototype.areResourcesLoaded = function () {
        return this._loadingFuture.promise;
    };
    /**
     * Begin loading all of the supplied resources, returning a promise
     * that resolves when loading of all is complete AND the user has clicked the "Play button"
     */
    Loader.prototype.load = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _i, _c, resource;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, ((_a = this._image) === null || _a === void 0 ? void 0 : _a.decode())];
                    case 1:
                        _d.sent(); // decode logo if it exists
                        this.canvas.flagDirty();
                        return [4 /*yield*/, Promise.all(this._resourceList.map(function (r) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, r.load()["finally"](function () {
                                                // capture progress
                                                _this._numLoaded++;
                                                _this.canvas.flagDirty();
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _d.sent();
                        // Wire all sound to the engine
                        for (_i = 0, _c = this._resourceList; _i < _c.length; _i++) {
                            resource = _c[_i];
                            if (resource instanceof Sound_1.Sound) {
                                resource.wireEngine(this._engine);
                            }
                        }
                        this._loadingFuture.resolve();
                        // short delay in showing the button for aesthetics
                        return [4 /*yield*/, (0, Util_1.delay)(200, (_b = this._engine) === null || _b === void 0 ? void 0 : _b.clock)];
                    case 3:
                        // short delay in showing the button for aesthetics
                        _d.sent();
                        this.canvas.flagDirty();
                        return [4 /*yield*/, this.showPlayButton()];
                    case 4:
                        _d.sent();
                        // Unlock browser AudioContext in after user gesture
                        // See: https://github.com/excaliburjs/Excalibur/issues/262
                        // See: https://github.com/excaliburjs/Excalibur/issues/1031
                        return [4 /*yield*/, WebAudio_1.WebAudio.unlock()];
                    case 5:
                        // Unlock browser AudioContext in after user gesture
                        // See: https://github.com/excaliburjs/Excalibur/issues/262
                        // See: https://github.com/excaliburjs/Excalibur/issues/1031
                        _d.sent();
                        return [2 /*return*/, (this.data = this._resourceList)];
                }
            });
        });
    };
    Loader.prototype.markResourceComplete = function () {
        this._numLoaded++;
    };
    Object.defineProperty(Loader.prototype, "progress", {
        /**
         * Returns the progress of the loader as a number between [0, 1] inclusive.
         */
        get: function () {
            return this._resourceCount > 0 ? (0, util_1.clamp)(this._numLoaded, 0, this._resourceCount) / this._resourceCount : 1;
        },
        enumerable: false,
        configurable: true
    });
    Loader.prototype._positionPlayButton = function () {
        if (this._engine) {
            var screenHeight = this._engine.screen.viewport.height;
            var screenWidth = this._engine.screen.viewport.width;
            if (this._playButtonRootElement) {
                var left = this._engine.canvas.offsetLeft;
                var top_1 = this._engine.canvas.offsetTop;
                var buttonWidth = this._playButton.clientWidth;
                var buttonHeight = this._playButton.clientHeight;
                if (this.playButtonPosition) {
                    this._playButtonRootElement.style.left = "".concat(this.playButtonPosition.x, "px");
                    this._playButtonRootElement.style.top = "".concat(this.playButtonPosition.y, "px");
                }
                else {
                    this._playButtonRootElement.style.left = "".concat(left + screenWidth / 2 - buttonWidth / 2, "px");
                    this._playButtonRootElement.style.top = "".concat(top_1 + screenHeight / 2 - buttonHeight / 2 + 100, "px");
                }
            }
        }
    };
    /**
     * Loader draw function. Draws the default Excalibur loading screen.
     * Override `logo`, `logoWidth`, `logoHeight` and `backgroundColor` properties
     * to customize the drawing, or just override entire method.
     */
    Loader.prototype.draw = function (ctx) {
        var canvasHeight = this._engine.canvasHeight / this._engine.pixelRatio;
        var canvasWidth = this._engine.canvasWidth / this._engine.pixelRatio;
        this._positionPlayButton();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        var logoY = canvasHeight / 2;
        var width = Math.min(this.logoWidth, canvasWidth * 0.75);
        var logoX = canvasWidth / 2 - width / 2;
        if (this.logoPosition) {
            logoX = this.logoPosition.x;
            logoY = this.logoPosition.y;
        }
        var imageHeight = Math.floor(width * (this.logoHeight / this.logoWidth)); // OG height/width factor
        var oldAntialias = this._engine.getAntialiasing();
        this._engine.setAntialiasing(true);
        if (!this.logoPosition) {
            ctx.drawImage(this._image, 0, 0, this.logoWidth, this.logoHeight, logoX, logoY - imageHeight - 20, width, imageHeight);
        }
        else {
            ctx.drawImage(this._image, 0, 0, this.logoWidth, this.logoHeight, logoX, logoY, width, imageHeight);
        }
        // loading box
        if (!this.suppressPlayButton && this._playButtonShown) {
            this._engine.setAntialiasing(oldAntialias);
            return;
        }
        var loadingX = logoX;
        var loadingY = logoY;
        if (this.loadingBarPosition) {
            loadingX = this.loadingBarPosition.x;
            loadingY = this.loadingBarPosition.y;
        }
        ctx.lineWidth = 2;
        DrawUtil.roundRect(ctx, loadingX, loadingY, width, 20, 10, this.loadingBarColor);
        var progress = width * this.progress;
        var margin = 5;
        var progressWidth = progress - margin * 2;
        var height = 20 - margin * 2;
        DrawUtil.roundRect(ctx, loadingX + margin, loadingY + margin, progressWidth > 10 ? progressWidth : 10, height, 5, null, this.loadingBarColor);
        this._engine.setAntialiasing(oldAntialias);
    };
    return Loader;
}(Class_1.Class));
exports.Loader = Loader;
