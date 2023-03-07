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
exports.Animation = exports.AnimationStrategy = exports.AnimationDirection = void 0;
var Graphic_1 = require("./Graphic");
var EventDispatcher_1 = require("../EventDispatcher");
var Log_1 = require("../Util/Log");
var util_1 = require("../Math/util");
var AnimationDirection;
(function (AnimationDirection) {
    /**
     * Animation is playing forwards
     */
    AnimationDirection["Forward"] = "forward";
    /**
     * Animation is play backwards
     */
    AnimationDirection["Backward"] = "backward";
})(AnimationDirection = exports.AnimationDirection || (exports.AnimationDirection = {}));
var AnimationStrategy;
(function (AnimationStrategy) {
    /**
     * Animation ends without displaying anything
     */
    AnimationStrategy["End"] = "end";
    /**
     * Animation loops to the first frame after the last frame
     */
    AnimationStrategy["Loop"] = "loop";
    /**
     * Animation plays to the last frame, then backwards to the first frame, then repeats
     */
    AnimationStrategy["PingPong"] = "pingpong";
    /**
     * Animation ends stopping on the last frame
     */
    AnimationStrategy["Freeze"] = "freeze";
})(AnimationStrategy = exports.AnimationStrategy || (exports.AnimationStrategy = {}));
/**
 * Create an Animation given a list of [[Frame|frames]] in [[AnimationOptions]]
 *
 * To create an Animation from a [[SpriteSheet]], use [[Animation.fromSpriteSheet]]
 */
var Animation = /** @class */ (function (_super) {
    __extends(Animation, _super);
    function Animation(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, options) || this;
        _this.events = new EventDispatcher_1.EventDispatcher(); // TODO replace with new Emitter
        _this.frames = [];
        _this.strategy = AnimationStrategy.Loop;
        _this.frameDuration = 100;
        _this.timeScale = 1;
        _this._idempotencyToken = -1;
        _this._firstTick = true;
        _this._currentFrame = 0;
        _this._timeLeftInFrame = 0;
        _this._direction = 1; // TODO only used in ping-pong
        _this._done = false;
        _this._playing = true;
        _this._reversed = false;
        _this.frames = options.frames;
        _this.strategy = (_a = options.strategy) !== null && _a !== void 0 ? _a : _this.strategy;
        _this.frameDuration = options.totalDuration ? options.totalDuration / _this.frames.length : (_b = options.frameDuration) !== null && _b !== void 0 ? _b : _this.frameDuration;
        if (options.reverse) {
            _this.reverse();
        }
        _this.goToFrame(0);
        return _this;
    }
    Animation.prototype.clone = function () {
        return new Animation(__assign({ frames: this.frames.map(function (f) { return (__assign({}, f)); }), frameDuration: this.frameDuration, reverse: this._reversed, strategy: this.strategy }, this.cloneGraphicOptions()));
    };
    Object.defineProperty(Animation.prototype, "width", {
        get: function () {
            var maybeFrame = this.currentFrame;
            if (maybeFrame) {
                return Math.abs(maybeFrame.graphic.width * this.scale.x);
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "height", {
        get: function () {
            var maybeFrame = this.currentFrame;
            if (maybeFrame) {
                return Math.abs(maybeFrame.graphic.height * this.scale.y);
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create an Animation from a [[SpriteSheet]], a list of indices into the sprite sheet, a duration per frame
     * and optional [[AnimationStrategy]]
     *
     * Example:
     * ```typescript
     * const spriteSheet = SpriteSheet.fromImageSource({...});
     *
     * const anim = Animation.fromSpriteSheet(spriteSheet, range(0, 5), 200, AnimationStrategy.Loop);
     * ```
     *
     * @param spriteSheet
     * @param frameIndices
     * @param durationPerFrameMs
     * @param strategy
     */
    Animation.fromSpriteSheet = function (spriteSheet, frameIndices, durationPerFrameMs, strategy) {
        if (strategy === void 0) { strategy = AnimationStrategy.Loop; }
        var maxIndex = spriteSheet.sprites.length - 1;
        var invalidIndices = frameIndices.filter(function (index) { return index < 0 || index > maxIndex; });
        if (invalidIndices.length) {
            Animation._LOGGER.warn("Indices into SpriteSheet were provided that don't exist: ".concat(invalidIndices.join(','), " no frame will be shown"));
        }
        return new Animation({
            frames: spriteSheet.sprites
                .filter(function (_, index) { return frameIndices.indexOf(index) > -1; })
                .map(function (f) { return ({
                graphic: f,
                duration: durationPerFrameMs
            }); }),
            strategy: strategy
        });
    };
    Object.defineProperty(Animation.prototype, "currentFrame", {
        /**
         * Returns the current Frame of the animation
         */
        get: function () {
            if (this._currentFrame >= 0 && this._currentFrame < this.frames.length) {
                return this.frames[this._currentFrame];
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "currentFrameIndex", {
        /**
         * Returns the current frame index of the animation
         */
        get: function () {
            return this._currentFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "isPlaying", {
        /**
         * Returns `true` if the animation is playing
         */
        get: function () {
            return this._playing;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Reverses the play direction of the Animation, this preserves the current frame
     */
    Animation.prototype.reverse = function () {
        // Don't mutate with the original frame list, create a copy
        this.frames = this.frames.slice().reverse();
        this._reversed = !this._reversed;
    };
    Object.defineProperty(Animation.prototype, "direction", {
        /**
         * Returns the current play direction of the animation
         */
        get: function () {
            // Keep logically consistent with ping-pong direction
            // If ping-pong is forward = 1 and reversed is true then we are logically reversed
            var reversed = (this._reversed && this._direction === 1) ? true : false;
            return reversed ? AnimationDirection.Backward : AnimationDirection.Forward;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Plays or resumes the animation from the current frame
     */
    Animation.prototype.play = function () {
        this._playing = true;
    };
    /**
     * Pauses the animation on the current frame
     */
    Animation.prototype.pause = function () {
        this._playing = false;
        this._firstTick = true; // firstTick must be set to emit the proper frame event
    };
    /**
     * Reset the animation back to the beginning, including if the animation were done
     */
    Animation.prototype.reset = function () {
        this._done = false;
        this._firstTick = true;
        this._currentFrame = 0;
    };
    Object.defineProperty(Animation.prototype, "canFinish", {
        /**
         * Returns `true` if the animation can end
         */
        get: function () {
            switch (this.strategy) {
                case AnimationStrategy.End:
                case AnimationStrategy.Freeze: {
                    return true;
                }
                default: {
                    return false;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "done", {
        /**
         * Returns `true` if the animation is done, for looping type animations
         * `ex.AnimationStrategy.PingPong` and `ex.AnimationStrategy.Loop` this will always return `false`
         *
         * See the `ex.Animation.canFinish()` method to know if an animation type can end
         */
        get: function () {
            return this._done;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Jump the animation immediately to a specific frame if it exists
     * @param frameNumber
     */
    Animation.prototype.goToFrame = function (frameNumber) {
        this._currentFrame = frameNumber;
        this._timeLeftInFrame = this.frameDuration;
        var maybeFrame = this.frames[this._currentFrame];
        if (maybeFrame && !this._done) {
            this._timeLeftInFrame = (maybeFrame === null || maybeFrame === void 0 ? void 0 : maybeFrame.duration) || this.frameDuration;
            this.events.emit('frame', maybeFrame);
        }
    };
    Animation.prototype._nextFrame = function () {
        var currentFrame = this._currentFrame;
        if (this._done) {
            return currentFrame;
        }
        var next = -1;
        switch (this.strategy) {
            case AnimationStrategy.Loop: {
                next = (currentFrame + 1) % this.frames.length;
                if (next === 0) {
                    this.events.emit('loop', this);
                }
                break;
            }
            case AnimationStrategy.End: {
                next = currentFrame + 1;
                if (next >= this.frames.length) {
                    this._done = true;
                    this._currentFrame = this.frames.length;
                    this.events.emit('end', this);
                }
                break;
            }
            case AnimationStrategy.Freeze: {
                next = (0, util_1.clamp)(currentFrame + 1, 0, this.frames.length - 1);
                if (next >= this.frames.length - 1) {
                    this._done = true;
                    this.events.emit('end', this);
                }
                break;
            }
            case AnimationStrategy.PingPong: {
                if (currentFrame + this._direction >= this.frames.length) {
                    this._direction = -1;
                    this.events.emit('loop', this);
                }
                if (currentFrame + this._direction < 0) {
                    this._direction = 1;
                    this.events.emit('loop', this);
                }
                next = currentFrame + (this._direction % this.frames.length);
                break;
            }
        }
        return next;
    };
    /**
     * Called internally by Excalibur to update the state of the animation potential update the current frame
     * @param elapsedMilliseconds Milliseconds elapsed
     * @param idempotencyToken Prevents double ticking in a frame by passing a unique token to the frame
     */
    Animation.prototype.tick = function (elapsedMilliseconds, idempotencyToken) {
        if (idempotencyToken === void 0) { idempotencyToken = 0; }
        if (this._idempotencyToken === idempotencyToken) {
            return;
        }
        this._idempotencyToken = idempotencyToken;
        if (!this._playing) {
            return;
        }
        // if it's the first frame emit frame event
        if (this._firstTick) {
            this._firstTick = false;
            this.events.emit('frame', this.currentFrame);
        }
        this._timeLeftInFrame -= elapsedMilliseconds * this.timeScale;
        if (this._timeLeftInFrame <= 0) {
            this.goToFrame(this._nextFrame());
        }
    };
    Animation.prototype._drawImage = function (ctx, x, y) {
        if (this.currentFrame) {
            this.currentFrame.graphic.draw(ctx, x, y);
        }
    };
    Animation._LOGGER = Log_1.Logger.getInstance();
    return Animation;
}(Graphic_1.Graphic));
exports.Animation = Animation;
