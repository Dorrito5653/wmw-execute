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
exports.TestClock = exports.StandardClock = exports.Clock = void 0;
var __1 = require("..");
var Fps_1 = require("./Fps");
/**
 * Abstract Clock is the base type of all Clocks
 *
 * It has a few opinions
 * 1. It manages the calculation of what "elapsed" time means and thus maximum fps
 * 2. The default timing api is implemented in now()
 *
 * To implement your own clock, extend Clock and override start/stop to start and stop the clock, then call update() with whatever
 * method is unique to your clock implementation.
 */
var Clock = /** @class */ (function () {
    function Clock(options) {
        var _this = this;
        var _a, _b, _c;
        this._onFatalException = function () { };
        this._maxFps = Infinity;
        this._lastTime = 0;
        this._elapsed = 1;
        this._scheduledCbs = [];
        this._totalElapsed = 0;
        this._options = options;
        this.tick = options.tick;
        this._lastTime = (_a = this.now()) !== null && _a !== void 0 ? _a : 0;
        this._maxFps = (_b = options.maxFps) !== null && _b !== void 0 ? _b : this._maxFps;
        this._onFatalException = (_c = options.onFatalException) !== null && _c !== void 0 ? _c : this._onFatalException;
        this.fpsSampler = new Fps_1.FpsSampler({
            initialFps: 60,
            nowFn: function () { return _this.now(); }
        });
    }
    /**
     * Get the elapsed time for the last completed frame
     */
    Clock.prototype.elapsed = function () {
        return this._elapsed;
    };
    /**
     * Get the current time in milliseconds
     */
    Clock.prototype.now = function () {
        return performance.now();
    };
    Clock.prototype.toTestClock = function () {
        var testClock = new TestClock(__assign(__assign({}, this._options), { defaultUpdateMs: 16.6 }));
        return testClock;
    };
    Clock.prototype.toStandardClock = function () {
        var clock = new StandardClock(__assign({}, this._options));
        return clock;
    };
    Clock.prototype.setFatalExceptionHandler = function (handler) {
        this._onFatalException = handler;
    };
    /**
     * Schedule a callback to fire given a timeout in milliseconds using the excalibur [[Clock]]
     *
     * This is useful to use over the built in browser `setTimeout` because callbacks will be tied to the
     * excalibur update clock, instead of browser time, this means that callbacks wont fire if the game is
     * stopped or paused.
     *
     * @param cb callback to fire
     * @param timeoutMs Optionally specify a timeout in milliseconds from now, default is 0ms which means the next possible tick
     */
    Clock.prototype.schedule = function (cb, timeoutMs) {
        if (timeoutMs === void 0) { timeoutMs = 0; }
        // Scheduled based on internal elapsed time
        var scheduledTime = this._totalElapsed + timeoutMs;
        this._scheduledCbs.push([cb, scheduledTime]);
    };
    Clock.prototype._runScheduledCbs = function () {
        // walk backwards to delete items as we loop
        for (var i = this._scheduledCbs.length - 1; i > -1; i--) {
            if (this._scheduledCbs[i][1] <= this._totalElapsed) {
                this._scheduledCbs[i][0]();
                this._scheduledCbs.splice(i, 1);
            }
        }
    };
    Clock.prototype.update = function (overrideUpdateMs) {
        try {
            this.fpsSampler.start();
            // Get the time to calculate time-elapsed
            var now = this.now();
            var elapsed = now - this._lastTime || 1; // first frame
            // Constrain fps
            var fpsInterval = (1000 / this._maxFps);
            // only run frame if enough time has elapsed
            if (elapsed >= fpsInterval) {
                var leftover = 0;
                if (fpsInterval !== 0) {
                    leftover = (elapsed % fpsInterval);
                    elapsed = elapsed - leftover; // shift elapsed to be "in phase" with the current loop fps
                }
                // Resolves issue #138 if the game has been paused, or blurred for
                // more than a 200 milliseconds, reset elapsed time to 1. This improves reliability
                // and provides more expected behavior when the engine comes back
                // into focus
                if (elapsed > 200) {
                    elapsed = 1;
                }
                // tick the mainloop and run scheduled callbacks
                this._elapsed = overrideUpdateMs || elapsed;
                this._totalElapsed += this._elapsed;
                this._runScheduledCbs();
                this.tick(overrideUpdateMs || elapsed);
                if (fpsInterval !== 0) {
                    this._lastTime = now - leftover;
                }
                else {
                    this._lastTime = now;
                }
                this.fpsSampler.end();
            }
        }
        catch (e) {
            this._onFatalException(e);
            this.stop();
        }
    };
    return Clock;
}());
exports.Clock = Clock;
/**
 * The [[StandardClock]] implements the requestAnimationFrame browser api to run the tick()
 */
var StandardClock = /** @class */ (function (_super) {
    __extends(StandardClock, _super);
    function StandardClock(options) {
        var _this = _super.call(this, options) || this;
        _this._running = false;
        return _this;
    }
    StandardClock.prototype.isRunning = function () {
        return this._running;
    };
    StandardClock.prototype.start = function () {
        var _this = this;
        if (this._running) {
            return;
        }
        this._running = true;
        var mainloop = function () {
            // stop the loop
            if (!_this._running) {
                return;
            }
            try {
                // request next loop
                _this._requestId = window.requestAnimationFrame(mainloop);
                _this.update();
            }
            catch (e) {
                window.cancelAnimationFrame(_this._requestId);
                throw e;
            }
        };
        // begin the first frame
        mainloop();
    };
    StandardClock.prototype.stop = function () {
        this._running = false;
    };
    return StandardClock;
}(Clock));
exports.StandardClock = StandardClock;
/**
 * The TestClock is meant for debugging interactions in excalibur that require precise timing to replicate or test
 */
var TestClock = /** @class */ (function (_super) {
    __extends(TestClock, _super);
    function TestClock(options) {
        var _this = _super.call(this, __assign({}, options)) || this;
        _this._logger = __1.Logger.getInstance();
        _this._running = false;
        _this._currentTime = 0;
        _this._updateMs = options.defaultUpdateMs;
        return _this;
    }
    /**
     * Get the current time in milliseconds
     */
    TestClock.prototype.now = function () {
        var _a;
        return (_a = this._currentTime) !== null && _a !== void 0 ? _a : 0;
    };
    TestClock.prototype.isRunning = function () {
        return this._running;
    };
    TestClock.prototype.start = function () {
        this._running = true;
    };
    TestClock.prototype.stop = function () {
        this._running = false;
    };
    /**
     * Manually step the clock forward 1 tick, optionally specify an elapsed time in milliseconds
     * @param overrideUpdateMs
     */
    TestClock.prototype.step = function (overrideUpdateMs) {
        var time = overrideUpdateMs !== null && overrideUpdateMs !== void 0 ? overrideUpdateMs : this._updateMs;
        if (this._running) {
            // to be comparable to RAF this needs to be a full blown Task
            // For example, images cannot decode synchronously in a single step
            this.update(time);
            this._currentTime += time;
        }
        else {
            this._logger.warn('The clock is not running, no step will be performed');
        }
    };
    /**
     * Run a number of steps that tick the clock, optionally specify an elapsed time in milliseconds
     * @param numberOfSteps
     * @param overrideUpdateMs
     */
    TestClock.prototype.run = function (numberOfSteps, overrideUpdateMs) {
        for (var i = 0; i < numberOfSteps; i++) {
            this.step(overrideUpdateMs !== null && overrideUpdateMs !== void 0 ? overrideUpdateMs : this._updateMs);
        }
    };
    return TestClock;
}(Clock));
exports.TestClock = TestClock;
