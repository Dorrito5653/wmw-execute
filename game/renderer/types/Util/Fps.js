"use strict";
exports.__esModule = true;
exports.FpsSampler = void 0;
var FpsSampler = /** @class */ (function () {
    function FpsSampler(options) {
        var _a;
        this._samplePeriod = 100;
        this._currentFrameTime = 0;
        this._frames = 0;
        this._previousSampleTime = 0;
        this._beginFrameTime = 0;
        this._fps = options.initialFps;
        this._samplePeriod = (_a = options.samplePeriod) !== null && _a !== void 0 ? _a : this._samplePeriod;
        this._currentFrameTime = 1000 / options.initialFps;
        this._nowFn = options.nowFn;
        this._previousSampleTime = this._nowFn();
    }
    /**
     * Start of code block to sample FPS for
     */
    FpsSampler.prototype.start = function () {
        this._beginFrameTime = this._nowFn();
    };
    /**
     * End of code block to sample FPS for
     */
    FpsSampler.prototype.end = function () {
        this._frames++;
        var time = this._nowFn();
        this._currentFrameTime = time - this._beginFrameTime;
        if (time >= this._previousSampleTime + this._samplePeriod) {
            this._fps = (this._frames * 1000) / (time - this._previousSampleTime);
            this._previousSampleTime = time;
            this._frames = 0;
        }
    };
    Object.defineProperty(FpsSampler.prototype, "fps", {
        /**
         * Return the currently sampled fps over the last sample period, by default every 100ms
         */
        get: function () {
            return this._fps;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FpsSampler.prototype, "instant", {
        /**
         * Return the instantaneous fps, this can be less useful because it will fluctuate given the current frames time
         */
        get: function () {
            return 1000 / this._currentFrameTime;
        },
        enumerable: false,
        configurable: true
    });
    return FpsSampler;
}());
exports.FpsSampler = FpsSampler;
