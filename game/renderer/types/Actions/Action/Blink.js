"use strict";
exports.__esModule = true;
exports.Blink = void 0;
var GraphicsComponent_1 = require("../../Graphics/GraphicsComponent");
var Blink = /** @class */ (function () {
    function Blink(entity, timeVisible, timeNotVisible, numBlinks) {
        if (numBlinks === void 0) { numBlinks = 1; }
        this._timeVisible = 0;
        this._timeNotVisible = 0;
        this._elapsedTime = 0;
        this._totalTime = 0;
        this._stopped = false;
        this._started = false;
        this._graphics = entity.get(GraphicsComponent_1.GraphicsComponent);
        this._timeVisible = timeVisible;
        this._timeNotVisible = timeNotVisible;
        this._duration = (timeVisible + timeNotVisible) * numBlinks;
    }
    Blink.prototype.update = function (delta) {
        if (!this._started) {
            this._started = true;
            this._elapsedTime = 0;
            this._totalTime = 0;
        }
        if (!this._graphics) {
            return;
        }
        this._elapsedTime += delta;
        this._totalTime += delta;
        if (this._graphics.visible && this._elapsedTime >= this._timeVisible) {
            this._graphics.visible = false;
            this._elapsedTime = 0;
        }
        if (!this._graphics.visible && this._elapsedTime >= this._timeNotVisible) {
            this._graphics.visible = true;
            this._elapsedTime = 0;
        }
        if (this.isComplete()) {
            this._graphics.visible = true;
        }
    };
    Blink.prototype.isComplete = function () {
        return this._stopped || this._totalTime >= this._duration;
    };
    Blink.prototype.stop = function () {
        if (this._graphics) {
            this._graphics.visible = true;
        }
        this._stopped = true;
    };
    Blink.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
        this._elapsedTime = 0;
        this._totalTime = 0;
    };
    return Blink;
}());
exports.Blink = Blink;
