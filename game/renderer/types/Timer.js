"use strict";
exports.__esModule = true;
exports.Timer = void 0;
var Log_1 = require("./Util/Log");
var Random_1 = require("./Math/Random");
/**
 * The Excalibur timer hooks into the internal timer and fires callbacks,
 * after a certain interval, optionally repeating.
 */
var Timer = /** @class */ (function () {
    function Timer(fcn, interval, repeats, numberOfRepeats, randomRange, random) {
        var _this = this;
        this._logger = Log_1.Logger.getInstance();
        this.id = 0;
        this._elapsedTime = 0;
        this._totalTimeAlive = 0;
        this._running = false;
        this._numberOfTicks = 0;
        this.interval = 10;
        this.repeats = false;
        this.maxNumberOfRepeats = -1;
        this.randomRange = [0, 0];
        this._baseInterval = 10;
        this._generateRandomInterval = function () {
            return _this._baseInterval + _this.random.integer(_this.randomRange[0], _this.randomRange[1]);
        };
        this._complete = false;
        this.scene = null;
        if (typeof fcn !== 'function') {
            var options = fcn;
            fcn = options.fcn;
            interval = options.interval;
            repeats = options.repeats;
            numberOfRepeats = options.numberOfRepeats;
            randomRange = options.randomRange;
            random = options.random;
        }
        if (!!numberOfRepeats && numberOfRepeats >= 0) {
            this.maxNumberOfRepeats = numberOfRepeats;
            if (!repeats) {
                throw new Error('repeats must be set to true if numberOfRepeats is set');
            }
        }
        this.id = Timer._MAX_ID++;
        this._callbacks = [];
        this._baseInterval = this.interval = interval;
        if (!!randomRange) {
            if (randomRange[0] > randomRange[1]) {
                throw new Error('min value must be lower than max value for range');
            }
            //We use the instance of ex.Random to generate the range
            this.random = random !== null && random !== void 0 ? random : new Random_1.Random();
            this.randomRange = randomRange;
            this.interval = this._generateRandomInterval();
            this.on(function () {
                _this.interval = _this._generateRandomInterval();
            });
        }
        ;
        this.repeats = repeats || this.repeats;
        if (fcn) {
            this.on(fcn);
        }
    }
    Object.defineProperty(Timer.prototype, "complete", {
        get: function () {
            return this._complete;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a new callback to be fired after the interval is complete
     * @param fcn The callback to be added to the callback list, to be fired after the interval is complete.
     */
    Timer.prototype.on = function (fcn) {
        this._callbacks.push(fcn);
    };
    /**
     * Removes a callback from the callback list to be fired after the interval is complete.
     * @param fcn The callback to be removed from the callback list, to be fired after the interval is complete.
     */
    Timer.prototype.off = function (fcn) {
        var index = this._callbacks.indexOf(fcn);
        this._callbacks.splice(index, 1);
    };
    /**
     * Updates the timer after a certain number of milliseconds have elapsed. This is used internally by the engine.
     * @param delta  Number of elapsed milliseconds since the last update.
     */
    Timer.prototype.update = function (delta) {
        var _this = this;
        if (this._running) {
            this._totalTimeAlive += delta;
            this._elapsedTime += delta;
            if (this.maxNumberOfRepeats > -1 && this._numberOfTicks >= this.maxNumberOfRepeats) {
                this._complete = true;
                this._running = false;
                this._elapsedTime = 0;
            }
            if (!this.complete && this._elapsedTime >= this.interval) {
                this._callbacks.forEach(function (c) {
                    c.call(_this);
                });
                this._numberOfTicks++;
                if (this.repeats) {
                    this._elapsedTime = 0;
                }
                else {
                    this._complete = true;
                    this._running = false;
                    this._elapsedTime = 0;
                }
            }
        }
    };
    /**
     * Resets the timer so that it can be reused, and optionally reconfigure the timers interval.
     *
     * Warning** you may need to call `timer.start()` again if the timer had completed
     * @param newInterval If specified, sets a new non-negative interval in milliseconds to refire the callback
     * @param newNumberOfRepeats If specified, sets a new non-negative upper limit to the number of time this timer executes
     */
    Timer.prototype.reset = function (newInterval, newNumberOfRepeats) {
        if (!!newInterval && newInterval >= 0) {
            this._baseInterval = this.interval = newInterval;
        }
        if (!!this.maxNumberOfRepeats && this.maxNumberOfRepeats >= 0) {
            this.maxNumberOfRepeats = newNumberOfRepeats;
            if (!this.repeats) {
                throw new Error('repeats must be set to true if numberOfRepeats is set');
            }
        }
        this._complete = false;
        this._elapsedTime = 0;
        this._numberOfTicks = 0;
    };
    Object.defineProperty(Timer.prototype, "timesRepeated", {
        get: function () {
            return this._numberOfTicks;
        },
        enumerable: false,
        configurable: true
    });
    Timer.prototype.getTimeRunning = function () {
        return this._totalTimeAlive;
    };
    Object.defineProperty(Timer.prototype, "timeToNextAction", {
        /**
         * @returns milliseconds until the next action callback, if complete will return 0
         */
        get: function () {
            if (this.complete) {
                return 0;
            }
            return this.interval - this._elapsedTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "timeElapsedTowardNextAction", {
        /**
         * @returns milliseconds elapsed toward the next action
         */
        get: function () {
            return this._elapsedTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "isRunning", {
        get: function () {
            return this._running;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Pauses the timer, time will no longer increment towards the next call
     */
    Timer.prototype.pause = function () {
        this._running = false;
        return this;
    };
    /**
     * Resumes the timer, time will now increment towards the next call.
     */
    Timer.prototype.resume = function () {
        this._running = true;
        return this;
    };
    /**
     * Starts the timer, if the timer was complete it will restart the timer and reset the elapsed time counter
     */
    Timer.prototype.start = function () {
        if (!this.scene) {
            this._logger.warn('Cannot start a timer not part of a scene, timer wont start until added');
        }
        this._running = true;
        if (this.complete) {
            this._complete = false;
            this._elapsedTime = 0;
            this._numberOfTicks = 0;
        }
        return this;
    };
    /**
     * Stops the timer and resets the elapsed time counter towards the next action invocation
     */
    Timer.prototype.stop = function () {
        this._running = false;
        this._elapsedTime = 0;
        this._numberOfTicks = 0;
        return this;
    };
    /**
     * Cancels the timer, preventing any further executions.
     */
    Timer.prototype.cancel = function () {
        this.pause();
        if (this.scene) {
            this.scene.cancelTimer(this);
        }
    };
    Timer._MAX_ID = 0;
    return Timer;
}());
exports.Timer = Timer;
