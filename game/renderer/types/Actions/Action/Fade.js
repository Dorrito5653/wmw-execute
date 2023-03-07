"use strict";
exports.__esModule = true;
exports.Fade = void 0;
var GraphicsComponent_1 = require("../../Graphics/GraphicsComponent");
var Log_1 = require("../../Util/Log");
var Fade = /** @class */ (function () {
    function Fade(entity, endOpacity, speed) {
        this._multiplier = 1;
        this._started = false;
        this._stopped = false;
        this._graphics = entity.get(GraphicsComponent_1.GraphicsComponent);
        this._endOpacity = endOpacity;
        this._speed = this._ogspeed = speed;
    }
    Fade.prototype.update = function (delta) {
        if (!this._graphics) {
            return;
        }
        if (!this._started) {
            this._started = true;
            this._speed = this._ogspeed;
            // determine direction when we start
            if (this._endOpacity < this._graphics.opacity) {
                this._multiplier = -1;
            }
            else {
                this._multiplier = 1;
            }
        }
        if (this._speed > 0) {
            this._graphics.opacity += (this._multiplier *
                (Math.abs(this._graphics.opacity - this._endOpacity) * delta)) / this._speed;
        }
        this._speed -= delta;
        if (this.isComplete()) {
            this._graphics.opacity = this._endOpacity;
        }
        Log_1.Logger.getInstance().debug('[Action fade] Actor opacity:', this._graphics.opacity);
    };
    Fade.prototype.isComplete = function () {
        return this._stopped || Math.abs(this._graphics.opacity - this._endOpacity) < 0.05;
    };
    Fade.prototype.stop = function () {
        this._stopped = true;
    };
    Fade.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
    };
    return Fade;
}());
exports.Fade = Fade;
