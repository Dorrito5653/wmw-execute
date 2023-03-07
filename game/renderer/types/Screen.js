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
exports.Screen = exports.Resolution = exports.DisplayMode = void 0;
var vector_1 = require("./Math/vector");
var Log_1 = require("./Util/Log");
var Index_1 = require("./Collision/Index");
var Util_1 = require("./Util/Util");
var ExcaliburGraphicsContextWebGL_1 = require("./Graphics/Context/ExcaliburGraphicsContextWebGL");
var ExcaliburGraphicsContext2DCanvas_1 = require("./Graphics/Context/ExcaliburGraphicsContext2DCanvas");
/**
 * Enum representing the different display modes available to Excalibur.
 */
var DisplayMode;
(function (DisplayMode) {
    /**
     * Default, use a specified resolution for the game. Like 800x600 pixels for example.
     */
    DisplayMode["Fixed"] = "Fixed";
    /**
     * Fit the aspect ratio given by the game resolution within the container at all times will fill any gaps with canvas.
     * The displayed area outside the aspect ratio is not guaranteed to be on the screen, only the [[Screen.contentArea]]
     * is guaranteed to be on screen.
     */
    DisplayMode["FitContainerAndFill"] = "FitContainerAndFill";
    /**
     * Fit the aspect ratio given by the game resolution the screen at all times will fill the screen.
     * This displayed area outside the aspect ratio is not guaranteed to be on the screen, only the [[Screen.contentArea]]
     * is guaranteed to be on screen.
     */
    DisplayMode["FitScreenAndFill"] = "FitScreenAndFill";
    /**
     * Fit the viewport to the parent element maintaining aspect ratio given by the game resolution, but zooms in to avoid the black bars
     * (letterbox) that would otherwise be present in [[FitContainer]].
     *
     * **warning** This will clip some drawable area from the user because of the zoom,
     * use [[Screen.contentArea]] to know the safe to draw area.
     */
    DisplayMode["FitContainerAndZoom"] = "FitContainerAndZoom";
    /**
     * Fit the viewport to the device screen maintaining aspect ratio given by the game resolution, but zooms in to avoid the black bars
     * (letterbox) that would otherwise be present in [[FitScreen]].
     *
     * **warning** This will clip some drawable area from the user because of the zoom,
     * use [[Screen.contentArea]] to know the safe to draw area.
     */
    DisplayMode["FitScreenAndZoom"] = "FitScreenAndZoom";
    /**
     * Fit to screen using as much space as possible while maintaining aspect ratio and resolution.
     * This is not the same as [[Screen.goFullScreen]] but behaves in a similar way maintaining aspect ratio.
     *
     * You may want to center your game here is an example
     * ```html
     * <!-- html -->
     * <body>
     * <main>
     *   <canvas id="game"></canvas>
     * </main>
     * </body>
     * ```
     *
     * ```css
     * // css
     * main {
     *   display: flex;
     *   align-items: center;
     *   justify-content: center;
     *   height: 100%;
     *   width: 100%;
     * }
     * ```
     */
    DisplayMode["FitScreen"] = "FitScreen";
    /**
     * Fill the entire screen's css width/height for the game resolution dynamically. This means the resolution of the game will
     * change dynamically as the window is resized. This is not the same as [[Screen.goFullScreen]]
     */
    DisplayMode["FillScreen"] = "FillScreen";
    /**
     * Fit to parent element width/height using as much space as possible while maintaining aspect ratio and resolution.
     */
    DisplayMode["FitContainer"] = "FitContainer";
    /**
     * Use the parent DOM container's css width/height for the game resolution dynamically
     */
    DisplayMode["FillContainer"] = "FillContainer";
})(DisplayMode = exports.DisplayMode || (exports.DisplayMode = {}));
/**
 * Convenience class for quick resolutions
 * Mostly sourced from https://emulation.gametechwiki.com/index.php/Resolution
 */
var Resolution = /** @class */ (function () {
    function Resolution() {
    }
    Object.defineProperty(Resolution, "SVGA", {
        /* istanbul ignore next */
        get: function () {
            return { width: 800, height: 600 };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resolution, "Standard", {
        /* istanbul ignore next */
        get: function () {
            return { width: 1920, height: 1080 };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resolution, "Atari2600", {
        /* istanbul ignore next */
        get: function () {
            return { width: 160, height: 192 };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resolution, "GameBoy", {
        /* istanbul ignore next */
        get: function () {
            return { width: 160, height: 144 };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resolution, "GameBoyAdvance", {
        /* istanbul ignore next */
        get: function () {
            return { width: 240, height: 160 };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resolution, "NintendoDS", {
        /* istanbul ignore next */
        get: function () {
            return { width: 256, height: 192 };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resolution, "NES", {
        /* istanbul ignore next */
        get: function () {
            return { width: 256, height: 224 };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resolution, "SNES", {
        /* istanbul ignore next */
        get: function () {
            return { width: 256, height: 244 };
        },
        enumerable: false,
        configurable: true
    });
    return Resolution;
}());
exports.Resolution = Resolution;
/**
 * The Screen handles all aspects of interacting with the screen for Excalibur.
 */
var Screen = /** @class */ (function () {
    function Screen(options) {
        var _this = this;
        var _a, _b, _c;
        this._antialiasing = true;
        this._resolutionStack = [];
        this._viewportStack = [];
        this._pixelRatioOverride = null;
        this._isFullScreen = false;
        this._isDisposed = false;
        this._logger = Log_1.Logger.getInstance();
        this._fullscreenChangeHandler = function () {
            _this._isFullScreen = !_this._isFullScreen;
            _this._logger.debug('Fullscreen Change', _this._isFullScreen);
        };
        this._pixelRatioChangeHandler = function () {
            _this._logger.debug('Pixel Ratio Change', window.devicePixelRatio);
            _this._listenForPixelRatio();
            _this._devicePixelRatio = _this._calculateDevicePixelRatio();
            _this.applyResolutionAndViewport();
        };
        this._resizeHandler = function () {
            var parent = _this.parent;
            _this._logger.debug('View port resized');
            _this._setResolutionAndViewportByDisplayMode(parent);
            _this.applyResolutionAndViewport();
        };
        // Asking the window.devicePixelRatio is expensive we do it once
        this._devicePixelRatio = this._calculateDevicePixelRatio();
        this._alreadyWarned = false;
        this._contentArea = new Index_1.BoundingBox();
        this.viewport = options.viewport;
        this.resolution = (_a = options.resolution) !== null && _a !== void 0 ? _a : __assign({}, this.viewport);
        this._contentResolution = this.resolution;
        this._displayMode = (_b = options.displayMode) !== null && _b !== void 0 ? _b : DisplayMode.Fixed;
        this._canvas = options.canvas;
        this.graphicsContext = options.context;
        this._antialiasing = (_c = options.antialiasing) !== null && _c !== void 0 ? _c : this._antialiasing;
        this._browser = options.browser;
        this._pixelRatioOverride = options.pixelRatio;
        this._applyDisplayMode();
        this._listenForPixelRatio();
        this._canvas.addEventListener('fullscreenchange', this._fullscreenChangeHandler);
        this.applyResolutionAndViewport();
    }
    Screen.prototype._listenForPixelRatio = function () {
        if (this._mediaQueryList && !this._mediaQueryList.addEventListener) {
            // Safari <=13.1 workaround, remove any existing handlers
            this._mediaQueryList.removeListener(this._pixelRatioChangeHandler);
        }
        this._mediaQueryList = this._browser.window.nativeComponent.matchMedia("(resolution: ".concat(window.devicePixelRatio, "dppx)"));
        // Safari <=13.1 workaround
        if (this._mediaQueryList.addEventListener) {
            this._mediaQueryList.addEventListener('change', this._pixelRatioChangeHandler, { once: true });
        }
        else {
            this._mediaQueryList.addListener(this._pixelRatioChangeHandler);
        }
    };
    Screen.prototype.dispose = function () {
        if (!this._isDisposed) {
            // Clean up handlers
            this._isDisposed = true;
            this._browser.window.off('resize', this._resizeHandler);
            if (this._resizeObserver) {
                this._resizeObserver.disconnect();
            }
            this.parent.removeEventListener('resize', this._resizeHandler);
            // Safari <=13.1 workaround
            if (this._mediaQueryList.removeEventListener) {
                this._mediaQueryList.removeEventListener('change', this._pixelRatioChangeHandler);
            }
            else {
                this._mediaQueryList.removeListener(this._pixelRatioChangeHandler);
            }
            this._canvas.removeEventListener('fullscreenchange', this._fullscreenChangeHandler);
        }
    };
    Screen.prototype._calculateDevicePixelRatio = function () {
        if (window.devicePixelRatio < 1) {
            return 1;
        }
        var devicePixelRatio = window.devicePixelRatio || 1;
        return devicePixelRatio;
    };
    Object.defineProperty(Screen.prototype, "pixelRatio", {
        get: function () {
            if (this._pixelRatioOverride) {
                return this._pixelRatioOverride;
            }
            return this._devicePixelRatio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "isHiDpi", {
        get: function () {
            return this.pixelRatio !== 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "displayMode", {
        get: function () {
            return this._displayMode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "parent", {
        get: function () {
            switch (this.displayMode) {
                case DisplayMode.FillContainer:
                case DisplayMode.FitContainer:
                case DisplayMode.FitContainerAndFill:
                case DisplayMode.FitContainerAndZoom:
                    return this.canvas.parentElement || document.body;
                default:
                    return window;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "resolution", {
        get: function () {
            return this._resolution;
        },
        set: function (resolution) {
            this._resolution = resolution;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "viewport", {
        get: function () {
            if (this._viewport) {
                return this._viewport;
            }
            return this._resolution;
        },
        set: function (viewport) {
            this._viewport = viewport;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "aspectRatio", {
        get: function () {
            return this._resolution.width / this._resolution.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "scaledWidth", {
        get: function () {
            return this._resolution.width * this.pixelRatio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "scaledHeight", {
        get: function () {
            return this._resolution.height * this.pixelRatio;
        },
        enumerable: false,
        configurable: true
    });
    Screen.prototype.setCurrentCamera = function (camera) {
        this._camera = camera;
    };
    Screen.prototype.pushResolutionAndViewport = function () {
        this._resolutionStack.push(this.resolution);
        this._viewportStack.push(this.viewport);
        this.resolution = __assign({}, this.resolution);
        this.viewport = __assign({}, this.viewport);
    };
    Screen.prototype.peekViewport = function () {
        return this._viewportStack[this._viewportStack.length - 1];
    };
    Screen.prototype.peekResolution = function () {
        return this._resolutionStack[this._resolutionStack.length - 1];
    };
    Screen.prototype.popResolutionAndViewport = function () {
        this.resolution = this._resolutionStack.pop();
        this.viewport = this._viewportStack.pop();
    };
    Screen.prototype.applyResolutionAndViewport = function () {
        this._canvas.width = this.scaledWidth;
        this._canvas.height = this.scaledHeight;
        if (this.graphicsContext instanceof ExcaliburGraphicsContextWebGL_1.ExcaliburGraphicsContextWebGL) {
            var supported = this.graphicsContext.checkIfResolutionSupported({
                width: this.scaledWidth,
                height: this.scaledHeight
            });
            if (!supported && !this._alreadyWarned) {
                this._alreadyWarned = true; // warn once
                this._logger.warn("The currently configured resolution (".concat(this.resolution.width, "x").concat(this.resolution.height, ") and pixel ratio (").concat(this.pixelRatio, ")") +
                    ' are too large for the platform WebGL implementation, this may work but cause WebGL rendering to behave oddly.' +
                    ' Try reducing the resolution or disabling Hi DPI scaling to avoid this' +
                    ' (read more here https://excaliburjs.com/docs/screens#understanding-viewport--resolution).');
            }
        }
        if (this._antialiasing) {
            this._canvas.style.imageRendering = 'auto';
        }
        else {
            this._canvas.style.imageRendering = 'pixelated';
            // Fall back to 'crisp-edges' if 'pixelated' is not supported
            // Currently for firefox https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
            if (this._canvas.style.imageRendering === '') {
                this._canvas.style.imageRendering = 'crisp-edges';
            }
        }
        this._canvas.style.width = this.viewport.width + 'px';
        this._canvas.style.height = this.viewport.height + 'px';
        // After messing with the canvas width/height the graphics context is invalidated and needs to have some properties reset
        this.graphicsContext.updateViewport(this.resolution);
        this.graphicsContext.resetTransform();
        this.graphicsContext.smoothing = this._antialiasing;
        if (this.graphicsContext instanceof ExcaliburGraphicsContext2DCanvas_1.ExcaliburGraphicsContext2DCanvas) {
            this.graphicsContext.scale(this.pixelRatio, this.pixelRatio);
        }
    };
    Object.defineProperty(Screen.prototype, "antialiasing", {
        get: function () {
            return this._antialiasing;
        },
        set: function (isSmooth) {
            this._antialiasing = isSmooth;
            this.graphicsContext.smoothing = this._antialiasing;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "isFullScreen", {
        /**
         * Returns true if excalibur is fullscreen using the browser fullscreen api
         */
        get: function () {
            return this._isFullScreen;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Requests to go fullscreen using the browser fullscreen api, requires user interaction to be successful.
     * For example, wire this to a user click handler.
     *
     * Optionally specify a target element id to go fullscreen, by default the game canvas is used
     * @param elementId
     */
    Screen.prototype.goFullScreen = function (elementId) {
        if (elementId) {
            var maybeElement = document.getElementById(elementId);
            if (maybeElement) {
                return maybeElement.requestFullscreen();
            }
        }
        return this._canvas.requestFullscreen();
    };
    /**
     * Requests to exit fullscreen using the browser fullscreen api
     */
    Screen.prototype.exitFullScreen = function () {
        return document.exitFullscreen();
    };
    /**
     * Takes a coordinate in normal html page space, for example from a pointer move event, and translates it to
     * Excalibur screen space.
     *
     * Excalibur screen space starts at the top left (0, 0) corner of the viewport, and extends to the
     * bottom right corner (resolutionX, resolutionY)
     * @param point
     */
    Screen.prototype.pageToScreenCoordinates = function (point) {
        var newX = point.x;
        var newY = point.y;
        if (!this._isFullScreen) {
            newX -= (0, Util_1.getPosition)(this._canvas).x;
            newY -= (0, Util_1.getPosition)(this._canvas).y;
        }
        // if fullscreen api on it centers with black bars
        // we need to adjust the screen to world coordinates in this case
        if (this._isFullScreen) {
            if (window.innerWidth / this.aspectRatio < window.innerHeight) {
                var screenHeight = window.innerWidth / this.aspectRatio;
                var screenMarginY = (window.innerHeight - screenHeight) / 2;
                newY = ((newY - screenMarginY) / screenHeight) * this.viewport.height;
                newX = (newX / window.innerWidth) * this.viewport.width;
            }
            else {
                var screenWidth = window.innerHeight * this.aspectRatio;
                var screenMarginX = (window.innerWidth - screenWidth) / 2;
                newX = ((newX - screenMarginX) / screenWidth) * this.viewport.width;
                newY = (newY / window.innerHeight) * this.viewport.height;
            }
        }
        newX = (newX / this.viewport.width) * this.resolution.width;
        newY = (newY / this.viewport.height) * this.resolution.height;
        return new vector_1.Vector(newX, newY);
    };
    /**
     * Takes a coordinate in Excalibur screen space, and translates it to normal html page space. For example,
     * this is where html elements might live if you want to position them relative to Excalibur.
     *
     * Excalibur screen space starts at the top left (0, 0) corner of the viewport, and extends to the
     * bottom right corner (resolutionX, resolutionY)
     * @param point
     */
    Screen.prototype.screenToPageCoordinates = function (point) {
        var newX = point.x;
        var newY = point.y;
        newX = (newX / this.resolution.width) * this.viewport.width;
        newY = (newY / this.resolution.height) * this.viewport.height;
        if (this._isFullScreen) {
            if (window.innerWidth / this.aspectRatio < window.innerHeight) {
                var screenHeight = window.innerWidth / this.aspectRatio;
                var screenMarginY = (window.innerHeight - screenHeight) / 2;
                newY = (newY / this.viewport.height) * screenHeight + screenMarginY;
                newX = (newX / this.viewport.width) * window.innerWidth;
            }
            else {
                var screenWidth = window.innerHeight * this.aspectRatio;
                var screenMarginX = (window.innerWidth - screenWidth) / 2;
                newX = (newX / this.viewport.width) * screenWidth + screenMarginX;
                newY = (newY / this.viewport.height) * window.innerHeight;
            }
        }
        if (!this._isFullScreen) {
            newX += (0, Util_1.getPosition)(this._canvas).x;
            newY += (0, Util_1.getPosition)(this._canvas).y;
        }
        return new vector_1.Vector(newX, newY);
    };
    /**
     * Takes a coordinate in Excalibur screen space, and translates it to Excalibur world space.
     *
     * World space is where [[Entity|entities]] in Excalibur live by default [[CoordPlane.World]]
     * and extends infinitely out relative from the [[Camera]].
     * @param point  Screen coordinate to convert
     */
    Screen.prototype.screenToWorldCoordinates = function (point) {
        // the only difference between screen & world is the camera transform
        if (this._camera) {
            return this._camera.inverse.multiply(point);
        }
        return point.sub((0, vector_1.vec)(this.resolution.width / 2, this.resolution.height / 2));
    };
    /**
     * Takes a coordinate in Excalibur world space, and translates it to Excalibur screen space.
     *
     * Screen space is where [[ScreenElement|screen elements]] and [[Entity|entities]] with [[CoordPlane.Screen]] live.
     * @param point  World coordinate to convert
     */
    Screen.prototype.worldToScreenCoordinates = function (point) {
        if (this._camera) {
            return this._camera.transform.multiply(point);
        }
        return point.add((0, vector_1.vec)(this.resolution.width / 2, this.resolution.height / 2));
    };
    Screen.prototype.pageToWorldCoordinates = function (point) {
        var screen = this.pageToScreenCoordinates(point);
        return this.screenToWorldCoordinates(screen);
    };
    Screen.prototype.worldToPageCoordinates = function (point) {
        var screen = this.worldToScreenCoordinates(point);
        return this.screenToPageCoordinates(screen);
    };
    /**
     * Returns a BoundingBox of the top left corner of the screen
     * and the bottom right corner of the screen.
     *
     * World bounds are in world coordinates, useful for culling objects offscreen
     */
    Screen.prototype.getWorldBounds = function () {
        var topLeft = this.screenToWorldCoordinates(vector_1.Vector.Zero);
        var right = topLeft.x + this.drawWidth;
        var bottom = topLeft.y + this.drawHeight;
        return new Index_1.BoundingBox(topLeft.x, topLeft.y, right, bottom);
    };
    Object.defineProperty(Screen.prototype, "canvasWidth", {
        /**
         * The width of the game canvas in pixels (physical width component of the
         * resolution of the canvas element)
         */
        get: function () {
            return this.canvas.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "halfCanvasWidth", {
        /**
         * Returns half width of the game canvas in pixels (half physical width component)
         */
        get: function () {
            return this.canvas.width / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "canvasHeight", {
        /**
         * The height of the game canvas in pixels, (physical height component of
         * the resolution of the canvas element)
         */
        get: function () {
            return this.canvas.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "halfCanvasHeight", {
        /**
         * Returns half height of the game canvas in pixels (half physical height component)
         */
        get: function () {
            return this.canvas.height / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "drawWidth", {
        /**
         * Returns the width of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            if (this._camera) {
                return this.resolution.width / this._camera.zoom;
            }
            return this.resolution.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "halfDrawWidth", {
        /**
         * Returns half the width of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.drawWidth / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "drawHeight", {
        /**
         * Returns the height of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            if (this._camera) {
                return this.resolution.height / this._camera.zoom;
            }
            return this.resolution.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "halfDrawHeight", {
        /**
         * Returns half the height of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.drawHeight / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "center", {
        /**
         * Returns screen center coordinates including zoom and device pixel ratio.
         */
        get: function () {
            return (0, vector_1.vec)(this.halfDrawWidth, this.halfDrawHeight);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Screen.prototype, "contentArea", {
        /**
         * Returns the content area in screen space where it is safe to place content
         */
        get: function () {
            return this._contentArea;
        },
        enumerable: false,
        configurable: true
    });
    Screen.prototype._computeFit = function () {
        document.body.style.margin = '0px';
        document.body.style.overflow = 'hidden';
        var aspect = this.aspectRatio;
        var adjustedWidth = 0;
        var adjustedHeight = 0;
        if (window.innerWidth / aspect < window.innerHeight) {
            adjustedWidth = window.innerWidth;
            adjustedHeight = window.innerWidth / aspect;
        }
        else {
            adjustedWidth = window.innerHeight * aspect;
            adjustedHeight = window.innerHeight;
        }
        this.viewport = {
            width: adjustedWidth,
            height: adjustedHeight
        };
        this._contentArea = Index_1.BoundingBox.fromDimension(this.resolution.width, this.resolution.height, vector_1.Vector.Zero);
    };
    Screen.prototype._computeFitScreenAndFill = function () {
        document.body.style.margin = '0px';
        document.body.style.overflow = 'hidden';
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        this._computeFitAndFill(vw, vh);
    };
    Screen.prototype._computeFitContainerAndFill = function () {
        document.body.style.margin = '0px';
        document.body.style.overflow = 'hidden';
        var parent = this.canvas.parentElement;
        var vw = parent.clientWidth;
        var vh = parent.clientHeight;
        this._computeFitAndFill(vw, vh);
    };
    Screen.prototype._computeFitAndFill = function (vw, vh) {
        this.viewport = {
            width: vw,
            height: vh
        };
        // if the current screen aspectRatio is less than the original aspectRatio
        if (vw / vh <= this._contentResolution.width / this._contentResolution.height) {
            // compute new resolution to match the original aspect ratio
            this.resolution = {
                width: vw * this._contentResolution.width / vw,
                height: vw * this._contentResolution.width / vw * vh / vw
            };
            var clip = (this.resolution.height - this._contentResolution.height) / 2;
            this._contentArea = new Index_1.BoundingBox({
                top: clip,
                left: 0,
                right: this._contentResolution.width,
                bottom: this.resolution.height - clip
            });
        }
        else {
            this.resolution = {
                width: vh * this._contentResolution.height / vh * vw / vh,
                height: vh * this._contentResolution.height / vh
            };
            var clip = (this.resolution.width - this._contentResolution.width) / 2;
            this._contentArea = new Index_1.BoundingBox({
                top: 0,
                left: clip,
                right: this.resolution.width - clip,
                bottom: this._contentResolution.height
            });
        }
    };
    Screen.prototype._computeFitScreenAndZoom = function () {
        document.body.style.margin = '0px';
        document.body.style.overflow = 'hidden';
        this.canvas.style.position = 'absolute';
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        this._computeFitAndZoom(vw, vh);
    };
    Screen.prototype._computeFitContainerAndZoom = function () {
        document.body.style.margin = '0px';
        document.body.style.overflow = 'hidden';
        this.canvas.style.position = 'absolute';
        var parent = this.canvas.parentElement;
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        var vw = parent.clientWidth;
        var vh = parent.clientHeight;
        this._computeFitAndZoom(vw, vh);
    };
    Screen.prototype._computeFitAndZoom = function (vw, vh) {
        var aspect = this.aspectRatio;
        var adjustedWidth = 0;
        var adjustedHeight = 0;
        if (vw / aspect < vh) {
            adjustedWidth = vw;
            adjustedHeight = vw / aspect;
        }
        else {
            adjustedWidth = vh * aspect;
            adjustedHeight = vh;
        }
        var scaleX = vw / adjustedWidth;
        var scaleY = vh / adjustedHeight;
        var maxScaleFactor = Math.max(scaleX, scaleY);
        var zoomedWidth = adjustedWidth * maxScaleFactor;
        var zoomedHeight = adjustedHeight * maxScaleFactor;
        // Center zoomed dimension if bigger than the screen
        if (zoomedWidth > vw) {
            this.canvas.style.left = -(zoomedWidth - vw) / 2 + 'px';
        }
        else {
            this.canvas.style.left = '';
        }
        if (zoomedHeight > vh) {
            this.canvas.style.top = -(zoomedHeight - vh) / 2 + 'px';
        }
        else {
            this.canvas.style.top = '';
        }
        this.viewport = {
            width: zoomedWidth,
            height: zoomedHeight
        };
        var bounds = Index_1.BoundingBox.fromDimension(this.viewport.width, this.viewport.height, vector_1.Vector.Zero);
        // return safe area
        if (this.viewport.width > vw) {
            var clip = (this.viewport.width - vw) / this.viewport.width * this.resolution.width;
            bounds.top = 0;
            bounds.left = clip / 2;
            bounds.right = this.resolution.width - clip / 2;
            bounds.bottom = this.resolution.height;
        }
        if (this.viewport.height > vh) {
            var clip = (this.viewport.height - vh) / this.viewport.height * this.resolution.height;
            bounds.top = clip / 2;
            bounds.left = 0;
            bounds.bottom = this.resolution.height - clip / 2;
            bounds.right = this.resolution.width;
        }
        this._contentArea = bounds;
    };
    Screen.prototype._computeFitContainer = function () {
        var aspect = this.aspectRatio;
        var adjustedWidth = 0;
        var adjustedHeight = 0;
        var parent = this.canvas.parentElement;
        if (parent.clientWidth / aspect < parent.clientHeight) {
            adjustedWidth = parent.clientWidth;
            adjustedHeight = parent.clientWidth / aspect;
        }
        else {
            adjustedWidth = parent.clientHeight * aspect;
            adjustedHeight = parent.clientHeight;
        }
        this.viewport = {
            width: adjustedWidth,
            height: adjustedHeight
        };
        this._contentArea = Index_1.BoundingBox.fromDimension(this.resolution.width, this.resolution.height, vector_1.Vector.Zero);
    };
    Screen.prototype._applyDisplayMode = function () {
        var _this = this;
        this._setResolutionAndViewportByDisplayMode(this.parent);
        // watch resizing
        if (this.parent instanceof Window) {
            this._browser.window.on('resize', this._resizeHandler);
        }
        else {
            this._resizeObserver = new ResizeObserver(function () {
                _this._resizeHandler();
            });
            this._resizeObserver.observe(this.parent);
        }
        this.parent.addEventListener('resize', this._resizeHandler);
    };
    /**
     * Sets the resolution and viewport based on the selected display mode.
     */
    Screen.prototype._setResolutionAndViewportByDisplayMode = function (parent) {
        if (this.displayMode === DisplayMode.FillContainer) {
            this.resolution = {
                width: parent.clientWidth,
                height: parent.clientHeight
            };
            this.viewport = this.resolution;
        }
        if (this.displayMode === DisplayMode.FillScreen) {
            document.body.style.margin = '0px';
            document.body.style.overflow = 'hidden';
            this.resolution = {
                width: parent.innerWidth,
                height: parent.innerHeight
            };
            this.viewport = this.resolution;
        }
        if (this.displayMode === DisplayMode.FitScreen) {
            this._computeFit();
        }
        if (this.displayMode === DisplayMode.FitContainer) {
            this._computeFitContainer();
        }
        if (this.displayMode === DisplayMode.FitScreenAndFill) {
            this._computeFitScreenAndFill();
        }
        if (this.displayMode === DisplayMode.FitContainerAndFill) {
            this._computeFitContainerAndFill();
        }
        if (this.displayMode === DisplayMode.FitScreenAndZoom) {
            this._computeFitScreenAndZoom();
        }
        if (this.displayMode === DisplayMode.FitContainerAndZoom) {
            this._computeFitContainerAndZoom();
        }
    };
    return Screen;
}());
exports.Screen = Screen;
