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
exports.Engine = exports.ScrollPreventionMode = void 0;
var _1 = require(".");
var Flags_1 = require("./Flags");
var Polyfill_1 = require("./Polyfill");
(0, Polyfill_1.polyfill)();
var Screen_1 = require("./Screen");
var Loader_1 = require("./Loader");
var Detector_1 = require("./Util/Detector");
var Events_1 = require("./Events");
var Log_1 = require("./Util/Log");
var Color_1 = require("./Color");
var Scene_1 = require("./Scene");
var Entity_1 = require("./EntityComponentSystem/Entity");
var Debug_1 = require("./Debug/Debug");
var Class_1 = require("./Class");
var Input = require("./Input/Index");
var Browser_1 = require("./Util/Browser");
var Graphics_1 = require("./Graphics");
var PointerEventReceiver_1 = require("./Input/PointerEventReceiver");
var Clock_1 = require("./Util/Clock");
var Filtering_1 = require("./Graphics/Filtering");
var GraphicsDiagnostics_1 = require("./Graphics/GraphicsDiagnostics");
var Toaster_1 = require("./Util/Toaster");
/**
 * Enum representing the different mousewheel event bubble prevention
 */
var ScrollPreventionMode;
(function (ScrollPreventionMode) {
    /**
     * Do not prevent any page scrolling
     */
    ScrollPreventionMode[ScrollPreventionMode["None"] = 0] = "None";
    /**
     * Prevent page scroll if mouse is over the game canvas
     */
    ScrollPreventionMode[ScrollPreventionMode["Canvas"] = 1] = "Canvas";
    /**
     * Prevent all page scrolling via mouse wheel
     */
    ScrollPreventionMode[ScrollPreventionMode["All"] = 2] = "All";
})(ScrollPreventionMode = exports.ScrollPreventionMode || (exports.ScrollPreventionMode = {}));
/**
 * The Excalibur Engine
 *
 * The [[Engine]] is the main driver for a game. It is responsible for
 * starting/stopping the game, maintaining state, transmitting events,
 * loading resources, and managing the scene.
 */
var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    /**
     * Creates a new game using the given [[EngineOptions]]. By default, if no options are provided,
     * the game will be rendered full screen (taking up all available browser window space).
     * You can customize the game rendering through [[EngineOptions]].
     *
     * Example:
     *
     * ```js
     * var game = new ex.Engine({
     *   width: 0, // the width of the canvas
     *   height: 0, // the height of the canvas
     *   enableCanvasTransparency: true, // the transparencySection of the canvas
     *   canvasElementId: '', // the DOM canvas element ID, if you are providing your own
     *   displayMode: ex.DisplayMode.FullScreen, // the display mode
     *   pointerScope: ex.Input.PointerScope.Document, // the scope of capturing pointer (mouse/touch) events
     *   backgroundColor: ex.Color.fromHex('#2185d0') // background color of the engine
     * });
     *
     * // call game.start, which is a Promise
     * game.start().then(function () {
     *   // ready, set, go!
     * });
     * ```
     */
    function Engine(options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        _this = _super.call(this) || this;
        /**
         * Optionally set the maximum fps if not set Excalibur will go as fast as the device allows.
         *
         * You may want to constrain max fps if your game cannot maintain fps consistently, it can look and feel better to have a 30fps game than
         * one that bounces between 30fps and 60fps
         */
        _this.maxFps = Number.POSITIVE_INFINITY;
        /**
         * Contains all the scenes currently registered with Excalibur
         */
        _this.scenes = {};
        _this._suppressPlayButton = false;
        /**
         * Indicates whether audio should be paused when the game is no longer visible.
         */
        _this.pauseAudioWhenHidden = true;
        /**
         * Indicates whether the engine should draw with debug information
         */
        _this._isDebug = false;
        /**
         * Sets the Transparency for the engine.
         */
        _this.enableCanvasTransparency = true;
        /**
         * The action to take when a fatal exception is thrown
         */
        _this.onFatalException = function (e) {
            Log_1.Logger.getInstance().fatal(e);
        };
        _this._toaster = new Toaster_1.Toaster();
        _this._timescale = 1.0;
        _this._isInitialized = false;
        _this._deferredGoTo = null;
        _this._originalOptions = {};
        _this._performanceThresholdTriggered = false;
        _this._fpsSamples = [];
        _this._loadingComplete = false;
        _this._isReady = false;
        _this._isReadyPromise = new Promise(function (resolve) {
            _this._isReadyResolve = resolve;
        });
        /**
         * Returns the current frames elapsed milliseconds
         */
        _this.currentFrameElapsedMs = 0;
        /**
         * Returns the current frame lag when in fixed update mode
         */
        _this.currentFrameLagMs = 0;
        _this._lagMs = 0;
        _this._screenShotRequests = [];
        options = __assign(__assign({}, Engine._DEFAULT_ENGINE_OPTIONS), options);
        _this._originalOptions = options;
        Flags_1.Flags.freeze();
        // Initialize browser events facade
        _this.browser = new Browser_1.BrowserEvents(window, document);
        // Check compatibility
        var detector = new Detector_1.Detector();
        if (!options.suppressMinimumBrowserFeatureDetection && !(_this._compatible = detector.test())) {
            var message = document.createElement('div');
            message.innerText = 'Sorry, your browser does not support all the features needed for Excalibur';
            document.body.appendChild(message);
            detector.failedTests.forEach(function (test) {
                var testMessage = document.createElement('div');
                testMessage.innerText = 'Browser feature missing ' + test;
                document.body.appendChild(testMessage);
            });
            if (options.canvasElementId) {
                var canvas_1 = document.getElementById(options.canvasElementId);
                if (canvas_1) {
                    canvas_1.parentElement.removeChild(canvas_1);
                }
            }
            return _this;
        }
        else {
            _this._compatible = true;
        }
        // Use native console API for color fun
        // eslint-disable-next-line no-console
        if (console.log && !options.suppressConsoleBootMessage) {
            // eslint-disable-next-line no-console
            console.log("%cPowered by Excalibur.js (v".concat(_1.EX_VERSION, ")"), 'background: #176BAA; color: white; border-radius: 5px; padding: 15px; font-size: 1.5em; line-height: 80px;');
            // eslint-disable-next-line no-console
            console.log('\n\
      /| ________________\n\
O|===|* >________________>\n\
      \\|');
            // eslint-disable-next-line no-console
            console.log('Visit', 'http://excaliburjs.com', 'for more information');
        }
        // Suppress play button
        if (options.suppressPlayButton) {
            _this._suppressPlayButton = true;
        }
        _this._logger = Log_1.Logger.getInstance();
        // If debug is enabled, let's log browser features to the console.
        if (_this._logger.defaultLevel === Log_1.LogLevel.Debug) {
            detector.logBrowserFeatures();
        }
        _this._logger.debug('Building engine...');
        _this.canvasElementId = options.canvasElementId;
        if (options.canvasElementId) {
            _this._logger.debug('Using Canvas element specified: ' + options.canvasElementId);
            _this.canvas = document.getElementById(options.canvasElementId);
        }
        else if (options.canvasElement) {
            _this._logger.debug('Using Canvas element specified:', options.canvasElement);
            _this.canvas = options.canvasElement;
        }
        else {
            _this._logger.debug('Using generated canvas element');
            _this.canvas = document.createElement('canvas');
        }
        var displayMode = (_a = options.displayMode) !== null && _a !== void 0 ? _a : Screen_1.DisplayMode.Fixed;
        if ((options.width && options.height) || options.viewport) {
            if (options.displayMode === undefined) {
                displayMode = Screen_1.DisplayMode.Fixed;
            }
            _this._logger.debug('Engine viewport is size ' + options.width + ' x ' + options.height);
        }
        else if (!options.displayMode) {
            _this._logger.debug('Engine viewport is fit');
            displayMode = Screen_1.DisplayMode.FitScreen;
        }
        _this._originalDisplayMode = displayMode;
        // Canvas 2D fallback can be flagged on
        var useCanvasGraphicsContext = Flags_1.Flags.isEnabled('use-canvas-context');
        if (!useCanvasGraphicsContext) {
            // Attempt webgl first
            try {
                _this.graphicsContext = new Graphics_1.ExcaliburGraphicsContextWebGL({
                    canvasElement: _this.canvas,
                    enableTransparency: _this.enableCanvasTransparency,
                    smoothing: options.antialiasing,
                    backgroundColor: options.backgroundColor,
                    snapToPixel: options.snapToPixel,
                    useDrawSorting: options.useDrawSorting
                });
            }
            catch (e) {
                _this._logger.warn("Excalibur could not load webgl for some reason (".concat(e.message, ") and loaded a Canvas 2D fallback. ") +
                    "Some features of Excalibur will not work in this mode. \n\n" +
                    'Read more about this issue at https://excaliburjs.com/docs/webgl');
                // fallback to canvas in case of failure
                useCanvasGraphicsContext = true;
            }
        }
        if (useCanvasGraphicsContext) {
            _this.graphicsContext = new Graphics_1.ExcaliburGraphicsContext2DCanvas({
                canvasElement: _this.canvas,
                enableTransparency: _this.enableCanvasTransparency,
                smoothing: options.antialiasing,
                backgroundColor: options.backgroundColor,
                snapToPixel: options.snapToPixel,
                useDrawSorting: options.useDrawSorting
            });
        }
        _this.screen = new Screen_1.Screen({
            canvas: _this.canvas,
            context: _this.graphicsContext,
            antialiasing: (_b = options.antialiasing) !== null && _b !== void 0 ? _b : true,
            browser: _this.browser,
            viewport: (_c = options.viewport) !== null && _c !== void 0 ? _c : (options.width && options.height ? { width: options.width, height: options.height } : Screen_1.Resolution.SVGA),
            resolution: options.resolution,
            displayMode: displayMode,
            pixelRatio: options.suppressHiDPIScaling ? 1 : ((_d = options.pixelRatio) !== null && _d !== void 0 ? _d : null)
        });
        // Set default filtering based on antialiasing
        Graphics_1.TextureLoader.filtering = options.antialiasing ? Filtering_1.ImageFiltering.Blended : Filtering_1.ImageFiltering.Pixel;
        if (options.backgroundColor) {
            _this.backgroundColor = options.backgroundColor.clone();
        }
        _this.maxFps = (_e = options.maxFps) !== null && _e !== void 0 ? _e : _this.maxFps;
        _this.fixedUpdateFps = (_f = options.fixedUpdateFps) !== null && _f !== void 0 ? _f : _this.fixedUpdateFps;
        _this.clock = new Clock_1.StandardClock({
            maxFps: _this.maxFps,
            tick: _this._mainloop.bind(_this),
            onFatalException: function (e) { return _this.onFatalException(e); }
        });
        _this.enableCanvasTransparency = options.enableCanvasTransparency;
        _this._loader = new Loader_1.Loader();
        _this._loader.wireEngine(_this);
        _this.debug = new Debug_1.Debug(_this);
        _this._initialize(options);
        _this.rootScene = _this.currentScene = new Scene_1.Scene();
        _this.addScene('root', _this.rootScene);
        window.___EXCALIBUR_DEVTOOL = _this;
        return _this;
    }
    Object.defineProperty(Engine.prototype, "canvasWidth", {
        /**
         * The width of the game canvas in pixels (physical width component of the
         * resolution of the canvas element)
         */
        get: function () {
            return this.screen.canvasWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfCanvasWidth", {
        /**
         * Returns half width of the game canvas in pixels (half physical width component)
         */
        get: function () {
            return this.screen.halfCanvasWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "canvasHeight", {
        /**
         * The height of the game canvas in pixels, (physical height component of
         * the resolution of the canvas element)
         */
        get: function () {
            return this.screen.canvasHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfCanvasHeight", {
        /**
         * Returns half height of the game canvas in pixels (half physical height component)
         */
        get: function () {
            return this.screen.halfCanvasHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "drawWidth", {
        /**
         * Returns the width of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.screen.drawWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfDrawWidth", {
        /**
         * Returns half the width of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.screen.halfDrawWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "drawHeight", {
        /**
         * Returns the height of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.screen.drawHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfDrawHeight", {
        /**
         * Returns half the height of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.screen.halfDrawHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "isHiDpi", {
        /**
         * Returns whether excalibur detects the current screen to be HiDPI
         */
        get: function () {
            return this.screen.isHiDpi;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "stats", {
        /**
         * Access [[stats]] that holds frame statistics.
         */
        get: function () {
            return this.debug.stats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "isFullscreen", {
        /**
         * Indicates whether the engine is set to fullscreen or not
         */
        get: function () {
            return this.screen.isFullScreen;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "displayMode", {
        /**
         * Indicates the current [[DisplayMode]] of the engine.
         */
        get: function () {
            return this.screen.displayMode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "pixelRatio", {
        /**
         * Returns the calculated pixel ration for use in rendering
         */
        get: function () {
            return this.screen.pixelRatio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "isDebug", {
        get: function () {
            return this._isDebug;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "snapToPixel", {
        /**
         * Hints the graphics context to truncate fractional world space coordinates
         */
        get: function () {
            return this.graphicsContext.snapToPixel;
        },
        set: function (shouldSnapToPixel) {
            this.graphicsContext.snapToPixel = shouldSnapToPixel;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Engine.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    Engine.prototype.once = function (eventName, handler) {
        _super.prototype.once.call(this, eventName, handler);
    };
    Engine.prototype.off = function (eventName, handler) {
        _super.prototype.off.call(this, eventName, handler);
    };
    Engine.prototype._monitorPerformanceThresholdAndTriggerFallback = function () {
        var allow = this._originalOptions.configurePerformanceCanvas2DFallback.allow;
        var _a = this._originalOptions.configurePerformanceCanvas2DFallback, threshold = _a.threshold, showPlayerMessage = _a.showPlayerMessage;
        if (threshold === undefined) {
            threshold = Engine._DEFAULT_ENGINE_OPTIONS.configurePerformanceCanvas2DFallback.threshold;
        }
        if (showPlayerMessage === undefined) {
            showPlayerMessage = Engine._DEFAULT_ENGINE_OPTIONS.configurePerformanceCanvas2DFallback.showPlayerMessage;
        }
        if (!Flags_1.Flags.isEnabled('use-canvas-context') && allow && this.ready && !this._performanceThresholdTriggered) {
            // Calculate Average fps for last X number of frames after start
            if (this._fpsSamples.length === threshold.numberOfFrames) {
                this._fpsSamples.splice(0, 1);
            }
            this._fpsSamples.push(this.clock.fpsSampler.fps);
            var total = 0;
            for (var i = 0; i < this._fpsSamples.length; i++) {
                total += this._fpsSamples[i];
            }
            var average = total / this._fpsSamples.length;
            if (this._fpsSamples.length === threshold.numberOfFrames) {
                if (average <= threshold.fps) {
                    this._performanceThresholdTriggered = true;
                    this._logger.warn("Switching to browser 2D Canvas fallback due to performance. Some features of Excalibur will not work in this mode.\n" +
                        'this might mean your browser doesn\'t have webgl enabled or hardware acceleration is unavailable.\n\n' +
                        'If in Chrome:\n' +
                        '  * Visit Settings > Advanced > System, and ensure "Use Hardware Acceleration" is checked.\n' +
                        '  * Visit chrome://flags/#ignore-gpu-blocklist and ensure "Override software rendering list" is "enabled"\n' +
                        'If in Firefox, visit about:config\n' +
                        '  * Ensure webgl.disabled = false\n' +
                        '  * Ensure webgl.force-enabled = true\n' +
                        '  * Ensure layers.acceleration.force-enabled = true\n\n' +
                        'Read more about this issue at https://excaliburjs.com/docs/performance');
                    if (showPlayerMessage) {
                        this._toaster.toast('Excalibur is encountering performance issues. ' +
                            'It\'s possible that your browser doesn\'t have hardware acceleration enabled. ' +
                            'Visit [LINK] for more information and potential solutions.', 'https://excaliburjs.com/docs/performance');
                    }
                    this.useCanvas2DFallback();
                    this.emit('fallbackgraphicscontext', this.graphicsContext);
                }
            }
        }
    };
    /**
     * Switches the engine's graphics context to the 2D Canvas.
     * @warning Some features of Excalibur will not work in this mode.
     */
    Engine.prototype.useCanvas2DFallback = function () {
        var _a, _b, _c;
        // Swap out the canvas
        var newCanvas = this.canvas.cloneNode(false);
        this.canvas.parentNode.replaceChild(newCanvas, this.canvas);
        this.canvas = newCanvas;
        var options = this._originalOptions;
        var displayMode = this._originalDisplayMode;
        // New graphics context
        this.graphicsContext = new Graphics_1.ExcaliburGraphicsContext2DCanvas({
            canvasElement: this.canvas,
            enableTransparency: this.enableCanvasTransparency,
            smoothing: options.antialiasing,
            backgroundColor: options.backgroundColor,
            snapToPixel: options.snapToPixel,
            useDrawSorting: options.useDrawSorting
        });
        // Reset screen
        if (this.screen) {
            this.screen.dispose();
        }
        this.screen = new Screen_1.Screen({
            canvas: this.canvas,
            context: this.graphicsContext,
            antialiasing: (_a = options.antialiasing) !== null && _a !== void 0 ? _a : true,
            browser: this.browser,
            viewport: (_b = options.viewport) !== null && _b !== void 0 ? _b : (options.width && options.height ? { width: options.width, height: options.height } : Screen_1.Resolution.SVGA),
            resolution: options.resolution,
            displayMode: displayMode,
            pixelRatio: options.suppressHiDPIScaling ? 1 : ((_c = options.pixelRatio) !== null && _c !== void 0 ? _c : null)
        });
        this.screen.setCurrentCamera(this.currentScene.camera);
        // Reset pointers
        this.input.pointers.detach();
        var pointerTarget = options && options.pointerScope === Input.PointerScope.Document ? document : this.canvas;
        this.input.pointers = this.input.pointers.recreate(pointerTarget, this);
        this.input.pointers.init();
    };
    /**
     * Returns a BoundingBox of the top left corner of the screen
     * and the bottom right corner of the screen.
     */
    Engine.prototype.getWorldBounds = function () {
        return this.screen.getWorldBounds();
    };
    Object.defineProperty(Engine.prototype, "timescale", {
        /**
         * Gets the current engine timescale factor (default is 1.0 which is 1:1 time)
         */
        get: function () {
            return this._timescale;
        },
        /**
         * Sets the current engine timescale factor. Useful for creating slow-motion effects or fast-forward effects
         * when using time-based movement.
         */
        set: function (value) {
            if (value <= 0) {
                Log_1.Logger.getInstance().error('Cannot set engine.timescale to a value of 0 or less than 0.');
                return;
            }
            this._timescale = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a [[Timer]] to the [[currentScene]].
     * @param timer  The timer to add to the [[currentScene]].
     */
    Engine.prototype.addTimer = function (timer) {
        return this.currentScene.addTimer(timer);
    };
    /**
     * Removes a [[Timer]] from the [[currentScene]].
     * @param timer  The timer to remove to the [[currentScene]].
     */
    Engine.prototype.removeTimer = function (timer) {
        return this.currentScene.removeTimer(timer);
    };
    /**
     * Adds a [[Scene]] to the engine, think of scenes in Excalibur as you
     * would levels or menus.
     *
     * @param key  The name of the scene, must be unique
     * @param scene The scene to add to the engine
     */
    Engine.prototype.addScene = function (key, scene) {
        if (this.scenes[key]) {
            this._logger.warn('Scene', key, 'already exists overwriting');
        }
        this.scenes[key] = scene;
    };
    /**
     * @internal
     */
    Engine.prototype.removeScene = function (entity) {
        if (entity instanceof Scene_1.Scene) {
            // remove scene
            for (var key in this.scenes) {
                if (this.scenes.hasOwnProperty(key)) {
                    if (this.scenes[key] === entity) {
                        delete this.scenes[key];
                    }
                }
            }
        }
        if (typeof entity === 'string') {
            // remove scene
            delete this.scenes[entity];
        }
    };
    Engine.prototype.add = function (entity) {
        if (arguments.length === 2) {
            this.addScene(arguments[0], arguments[1]);
            return;
        }
        if (this._deferredGoTo && this.scenes[this._deferredGoTo]) {
            this.scenes[this._deferredGoTo].add(entity);
        }
        else {
            this.currentScene.add(entity);
        }
    };
    Engine.prototype.remove = function (entity) {
        if (entity instanceof Entity_1.Entity) {
            this.currentScene.remove(entity);
        }
        if (entity instanceof Scene_1.Scene) {
            this.removeScene(entity);
        }
        if (typeof entity === 'string') {
            this.removeScene(entity);
        }
    };
    /**
     * Changes the currently updating and drawing scene to a different,
     * named scene. Calls the [[Scene]] lifecycle events.
     * @param key  The key of the scene to transition to.
     * @param data Optional data to send to the scene's onActivate method
     */
    Engine.prototype.goToScene = function (key, data) {
        // if not yet initialized defer goToScene
        if (!this.isInitialized) {
            this._deferredGoTo = key;
            return;
        }
        if (this.scenes[key]) {
            var previousScene = this.currentScene;
            var nextScene = this.scenes[key];
            this._logger.debug('Going to scene:', key);
            // only deactivate when initialized
            if (this.currentScene.isInitialized) {
                var context_1 = { engine: this, previousScene: previousScene, nextScene: nextScene };
                this.currentScene._deactivate.apply(this.currentScene, [context_1, nextScene]);
                this.currentScene.eventDispatcher.emit('deactivate', new Events_1.DeactivateEvent(context_1, this.currentScene));
            }
            // set current scene to new one
            this.currentScene = nextScene;
            this.screen.setCurrentCamera(nextScene.camera);
            // initialize the current scene if has not been already
            this.currentScene._initialize(this);
            var context = { engine: this, previousScene: previousScene, nextScene: nextScene, data: data };
            this.currentScene._activate.apply(this.currentScene, [context, nextScene]);
            this.currentScene.eventDispatcher.emit('activate', new Events_1.ActivateEvent(context, this.currentScene));
        }
        else {
            this._logger.error('Scene', key, 'does not exist!');
        }
    };
    /**
     * Transforms the current x, y from screen coordinates to world coordinates
     * @param point  Screen coordinate to convert
     */
    Engine.prototype.screenToWorldCoordinates = function (point) {
        return this.screen.screenToWorldCoordinates(point);
    };
    /**
     * Transforms a world coordinate, to a screen coordinate
     * @param point  World coordinate to convert
     */
    Engine.prototype.worldToScreenCoordinates = function (point) {
        return this.screen.worldToScreenCoordinates(point);
    };
    /**
     * Initializes the internal canvas, rendering context, display mode, and native event listeners
     */
    Engine.prototype._initialize = function (options) {
        var _this = this;
        this.pageScrollPreventionMode = options.scrollPreventionMode;
        // initialize inputs
        var pointerTarget = options && options.pointerScope === Input.PointerScope.Document ? document : this.canvas;
        this.input = {
            keyboard: new Input.Keyboard(),
            pointers: new PointerEventReceiver_1.PointerEventReceiver(pointerTarget, this),
            gamepads: new Input.Gamepads()
        };
        this.input.keyboard.init();
        this.input.pointers.init();
        this.input.gamepads.init();
        // Issue #385 make use of the visibility api
        // https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
        var hidden, visibilityChange;
        if (typeof document.hidden !== 'undefined') {
            // Opera 12.10 and Firefox 18 and later support
            hidden = 'hidden';
            visibilityChange = 'visibilitychange';
        }
        else if ('msHidden' in document) {
            hidden = 'msHidden';
            visibilityChange = 'msvisibilitychange';
        }
        else if ('webkitHidden' in document) {
            hidden = 'webkitHidden';
            visibilityChange = 'webkitvisibilitychange';
        }
        this.browser.document.on(visibilityChange, function () {
            if (document[hidden]) {
                _this.eventDispatcher.emit('hidden', new Events_1.HiddenEvent(_this));
                _this._logger.debug('Window hidden');
            }
            else {
                _this.eventDispatcher.emit('visible', new Events_1.VisibleEvent(_this));
                _this._logger.debug('Window visible');
            }
        });
        if (!this.canvasElementId && !options.canvasElement) {
            document.body.appendChild(this.canvas);
        }
    };
    Engine.prototype.onInitialize = function (_engine) {
        // Override me
    };
    /**
     * If supported by the browser, this will set the antialiasing flag on the
     * canvas. Set this to `false` if you want a 'jagged' pixel art look to your
     * image resources.
     * @param isSmooth  Set smoothing to true or false
     */
    Engine.prototype.setAntialiasing = function (isSmooth) {
        this.screen.antialiasing = isSmooth;
    };
    /**
     * Return the current smoothing status of the canvas
     */
    Engine.prototype.getAntialiasing = function () {
        return this.screen.antialiasing;
    };
    Object.defineProperty(Engine.prototype, "isInitialized", {
        /**
         * Gets whether the actor is Initialized
         */
        get: function () {
            return this._isInitialized;
        },
        enumerable: false,
        configurable: true
    });
    Engine.prototype._overrideInitialize = function (engine) {
        if (!this.isInitialized) {
            this.onInitialize(engine);
            _super.prototype.emit.call(this, 'initialize', new Events_1.InitializeEvent(engine, this));
            this._isInitialized = true;
            if (this._deferredGoTo) {
                var deferredScene = this._deferredGoTo;
                this._deferredGoTo = null;
                this.goToScene(deferredScene);
            }
            else {
                this.goToScene('root');
            }
        }
    };
    /**
     * Updates the entire state of the game
     * @param delta  Number of milliseconds elapsed since the last update.
     */
    Engine.prototype._update = function (delta) {
        if (!this.ready) {
            // suspend updates until loading is finished
            this._loader.update(this, delta);
            // Update input listeners
            this.input.keyboard.update();
            this.input.gamepads.update();
            return;
        }
        // Publish preupdate events
        this._preupdate(delta);
        // process engine level events
        this.currentScene.update(this, delta);
        // Publish update event
        this._postupdate(delta);
        // Update input listeners
        this.input.keyboard.update();
        this.input.gamepads.update();
    };
    /**
     * @internal
     */
    Engine.prototype._preupdate = function (delta) {
        this.emit('preupdate', new Events_1.PreUpdateEvent(this, delta, this));
        this.onPreUpdate(this, delta);
    };
    Engine.prototype.onPreUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     * @internal
     */
    Engine.prototype._postupdate = function (delta) {
        this.emit('postupdate', new Events_1.PostUpdateEvent(this, delta, this));
        this.onPostUpdate(this, delta);
    };
    Engine.prototype.onPostUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     * Draws the entire game
     * @param delta  Number of milliseconds elapsed since the last draw.
     */
    Engine.prototype._draw = function (delta) {
        this.graphicsContext.beginDrawLifecycle();
        this.graphicsContext.clear();
        this._predraw(this.graphicsContext, delta);
        // Drawing nothing else while loading
        if (!this._isReady) {
            this._loader.canvas.draw(this.graphicsContext, 0, 0);
            this.graphicsContext.flush();
            return;
        }
        this.graphicsContext.backgroundColor = this.backgroundColor;
        this.currentScene.draw(this.graphicsContext, delta);
        this._postdraw(this.graphicsContext, delta);
        // Flush any pending drawings
        this.graphicsContext.flush();
        this.graphicsContext.endDrawLifecycle();
        this._checkForScreenShots();
    };
    /**
     * @internal
     */
    Engine.prototype._predraw = function (_ctx, delta) {
        this.emit('predraw', new Events_1.PreDrawEvent(_ctx, delta, this));
        this.onPreDraw(_ctx, delta);
    };
    Engine.prototype.onPreDraw = function (_ctx, _delta) {
        // Override me
    };
    /**
     * @internal
     */
    Engine.prototype._postdraw = function (_ctx, delta) {
        this.emit('postdraw', new Events_1.PostDrawEvent(_ctx, delta, this));
        this.onPostDraw(_ctx, delta);
    };
    Engine.prototype.onPostDraw = function (_ctx, _delta) {
        // Override me
    };
    /**
     * Enable or disable Excalibur debugging functionality.
     * @param toggle a value that debug drawing will be changed to
     */
    Engine.prototype.showDebug = function (toggle) {
        this._isDebug = toggle;
    };
    /**
     * Toggle Excalibur debugging functionality.
     */
    Engine.prototype.toggleDebug = function () {
        this._isDebug = !this._isDebug;
        return this._isDebug;
    };
    Object.defineProperty(Engine.prototype, "loadingComplete", {
        /**
         * Returns true when loading is totally complete and the player has clicked start
         */
        get: function () {
            return this._loadingComplete;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "ready", {
        get: function () {
            return this._isReady;
        },
        enumerable: false,
        configurable: true
    });
    Engine.prototype.isReady = function () {
        return this._isReadyPromise;
    };
    /**
     * Starts the internal game loop for Excalibur after loading
     * any provided assets.
     * @param loader  Optional [[Loader]] to use to load resources. The default loader is [[Loader]], override to provide your own
     * custom loader.
     *
     * Note: start() only resolves AFTER the user has clicked the play button
     */
    Engine.prototype.start = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._compatible) {
                            throw new Error('Excalibur is incompatible with your browser');
                        }
                        // Wire loader if we have it
                        if (loader) {
                            // Push the current user entered resolution/viewport
                            this.screen.pushResolutionAndViewport();
                            // Configure resolution for loader, it expects resolution === viewport
                            this.screen.resolution = this.screen.viewport;
                            this.screen.applyResolutionAndViewport();
                            this._loader = loader;
                            this._loader.suppressPlayButton = this._suppressPlayButton || this._loader.suppressPlayButton;
                            this._loader.wireEngine(this);
                        }
                        // Start the excalibur clock which drives the mainloop
                        // has started is a slight misnomer, it's really mainloop started
                        this._logger.debug('Starting game clock...');
                        this.browser.resume();
                        this.clock.start();
                        this._logger.debug('Game clock started');
                        if (!loader) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.load(this._loader)];
                    case 1:
                        _a.sent();
                        this._loadingComplete = true;
                        // reset back to previous user resolution/viewport
                        this.screen.popResolutionAndViewport();
                        this.screen.applyResolutionAndViewport();
                        _a.label = 2;
                    case 2:
                        this._loadingComplete = true;
                        // Initialize before ready
                        this._overrideInitialize(this);
                        this._isReady = true;
                        this._isReadyResolve();
                        this.emit('start', new Events_1.GameStartEvent(this));
                        return [2 /*return*/, this._isReadyPromise];
                }
            });
        });
    };
    Engine.prototype._mainloop = function (elapsed) {
        this.emit('preframe', new Events_1.PreFrameEvent(this, this.stats.prevFrame));
        var delta = elapsed * this.timescale;
        this.currentFrameElapsedMs = delta;
        // reset frame stats (reuse existing instances)
        var frameId = this.stats.prevFrame.id + 1;
        this.stats.currFrame.reset();
        this.stats.currFrame.id = frameId;
        this.stats.currFrame.delta = delta;
        this.stats.currFrame.fps = this.clock.fpsSampler.fps;
        GraphicsDiagnostics_1.GraphicsDiagnostics.clear();
        var beforeUpdate = this.clock.now();
        var fixedTimestepMs = 1000 / this.fixedUpdateFps;
        if (this.fixedUpdateFps) {
            this._lagMs += delta;
            while (this._lagMs >= fixedTimestepMs) {
                this._update(fixedTimestepMs);
                this._lagMs -= fixedTimestepMs;
            }
        }
        else {
            this._update(delta);
        }
        var afterUpdate = this.clock.now();
        this.currentFrameLagMs = this._lagMs;
        this._draw(delta);
        var afterDraw = this.clock.now();
        this.stats.currFrame.duration.update = afterUpdate - beforeUpdate;
        this.stats.currFrame.duration.draw = afterDraw - afterUpdate;
        this.stats.currFrame.graphics.drawnImages = GraphicsDiagnostics_1.GraphicsDiagnostics.DrawnImagesCount;
        this.stats.currFrame.graphics.drawCalls = GraphicsDiagnostics_1.GraphicsDiagnostics.DrawCallCount;
        this.emit('postframe', new Events_1.PostFrameEvent(this, this.stats.currFrame));
        this.stats.prevFrame.reset(this.stats.currFrame);
        this._monitorPerformanceThresholdAndTriggerFallback();
    };
    /**
     * Stops Excalibur's main loop, useful for pausing the game.
     */
    Engine.prototype.stop = function () {
        if (this.clock.isRunning()) {
            this.emit('stop', new Events_1.GameStopEvent(this));
            this.browser.pause();
            this.clock.stop();
            this._logger.debug('Game stopped');
        }
    };
    /**
     * Returns the Engine's running status, Useful for checking whether engine is running or paused.
     */
    Engine.prototype.isRunning = function () {
        return this.clock.isRunning();
    };
    /**
     * Takes a screen shot of the current viewport and returns it as an
     * HTML Image Element.
     * @param preserveHiDPIResolution in the case of HiDPI return the full scaled backing image, by default false
     */
    Engine.prototype.screenshot = function (preserveHiDPIResolution) {
        var _this = this;
        if (preserveHiDPIResolution === void 0) { preserveHiDPIResolution = false; }
        var screenShotPromise = new Promise(function (resolve) {
            _this._screenShotRequests.push({ preserveHiDPIResolution: preserveHiDPIResolution, resolve: resolve });
        });
        return screenShotPromise;
    };
    Engine.prototype._checkForScreenShots = function () {
        // We must grab the draw buffer before we yield to the browser
        // the draw buffer is cleared after compositing
        // the reason for the asynchrony is setting `preserveDrawingBuffer: true`
        // forces the browser to copy buffers which can have a mass perf impact on mobile
        for (var _i = 0, _a = this._screenShotRequests; _i < _a.length; _i++) {
            var request = _a[_i];
            var finalWidth = request.preserveHiDPIResolution ? this.canvas.width : this.screen.resolution.width;
            var finalHeight = request.preserveHiDPIResolution ? this.canvas.height : this.screen.resolution.height;
            var screenshot = document.createElement('canvas');
            screenshot.width = finalWidth;
            screenshot.height = finalHeight;
            var ctx = screenshot.getContext('2d');
            ctx.drawImage(this.canvas, 0, 0, finalWidth, finalHeight);
            var result = new Image();
            var raw = screenshot.toDataURL('image/png');
            result.src = raw;
            request.resolve(result);
        }
        // Reset state
        this._screenShotRequests.length = 0;
    };
    /**
     * Another option available to you to load resources into the game.
     * Immediately after calling this the game will pause and the loading screen
     * will appear.
     * @param loader  Some [[Loadable]] such as a [[Loader]] collection, [[Sound]], or [[Texture]].
     */
    Engine.prototype.load = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, loader.load()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        this._logger.error('Error loading resources, things may not behave properly', e_1);
                        return [4 /*yield*/, Promise.resolve()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Default [[EngineOptions]]
     */
    Engine._DEFAULT_ENGINE_OPTIONS = {
        width: 0,
        height: 0,
        enableCanvasTransparency: true,
        useDrawSorting: true,
        configurePerformanceCanvas2DFallback: {
            allow: true,
            showPlayerMessage: false,
            threshold: { fps: 20, numberOfFrames: 100 }
        },
        canvasElementId: '',
        canvasElement: undefined,
        snapToPixel: false,
        pointerScope: Input.PointerScope.Canvas,
        suppressConsoleBootMessage: null,
        suppressMinimumBrowserFeatureDetection: null,
        suppressHiDPIScaling: null,
        suppressPlayButton: null,
        scrollPreventionMode: ScrollPreventionMode.Canvas,
        backgroundColor: Color_1.Color.fromHex('#2185d0') // Excalibur blue
    };
    return Engine;
}(Class_1.Class));
exports.Engine = Engine;
