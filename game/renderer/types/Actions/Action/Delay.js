"use strict";
exports.__esModule = true;
exports.Delay = void 0;
var Delay = /** @class */ (function () {
    function Delay(delay) {
        this._elapsedTime = 0;
        this._started = false;
        this._stopped = false;
        this._delay = delay;
    }
    Delay.prototype.update = function (delta) {
        if (!this._started) {
            this._started = true;
        }
        this._elapsedTime += delta;
    };
    Delay.prototype.isComplete = function () {
        return this._stopped || this._elapsedTime >= this._delay;
    };
    Delay.prototype.stop = function () {
        this._stopped = true;
    };
    Delay.prototype.reset = function () {
        this._elapsedTime = 0;
        this._started = false;
        this._stopped = false;
    };
    return Delay;
}());
exports.Delay = Delay;
