"use strict";
exports.__esModule = true;
exports.EaseTo = void 0;
var TransformComponent_1 = require("../../EntityComponentSystem/Components/TransformComponent");
var MotionComponent_1 = require("../../EntityComponentSystem/Components/MotionComponent");
var vector_1 = require("../../Math/vector");
var EaseTo = /** @class */ (function () {
    function EaseTo(entity, x, y, duration, easingFcn) {
        this.easingFcn = easingFcn;
        this._currentLerpTime = 0;
        this._lerpDuration = 1 * 1000; // 1 second
        this._lerpStart = new vector_1.Vector(0, 0);
        this._lerpEnd = new vector_1.Vector(0, 0);
        this._initialized = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent_1.TransformComponent);
        this._motion = entity.get(MotionComponent_1.MotionComponent);
        this._lerpDuration = duration;
        this._lerpEnd = new vector_1.Vector(x, y);
    }
    EaseTo.prototype._initialize = function () {
        this._lerpStart = new vector_1.Vector(this._tx.pos.x, this._tx.pos.y);
        this._currentLerpTime = 0;
    };
    EaseTo.prototype.update = function (delta) {
        if (!this._initialized) {
            this._initialize();
            this._initialized = true;
        }
        // Need to update lerp time first, otherwise the first update will always be zero
        this._currentLerpTime += delta;
        var newX = this._tx.pos.x;
        var newY = this._tx.pos.y;
        if (this._currentLerpTime < this._lerpDuration) {
            if (this._lerpEnd.x < this._lerpStart.x) {
                newX =
                    this._lerpStart.x -
                        (this.easingFcn(this._currentLerpTime, this._lerpEnd.x, this._lerpStart.x, this._lerpDuration) - this._lerpEnd.x);
            }
            else {
                newX = this.easingFcn(this._currentLerpTime, this._lerpStart.x, this._lerpEnd.x, this._lerpDuration);
            }
            if (this._lerpEnd.y < this._lerpStart.y) {
                newY =
                    this._lerpStart.y -
                        (this.easingFcn(this._currentLerpTime, this._lerpEnd.y, this._lerpStart.y, this._lerpDuration) - this._lerpEnd.y);
            }
            else {
                newY = this.easingFcn(this._currentLerpTime, this._lerpStart.y, this._lerpEnd.y, this._lerpDuration);
            }
            // Given the lerp position figure out the velocity in pixels per second
            this._motion.vel = (0, vector_1.vec)((newX - this._tx.pos.x) / (delta / 1000), (newY - this._tx.pos.y) / (delta / 1000));
        }
        else {
            this._tx.pos = (0, vector_1.vec)(this._lerpEnd.x, this._lerpEnd.y);
            this._motion.vel = vector_1.Vector.Zero;
        }
    };
    EaseTo.prototype.isComplete = function () {
        return this._stopped || this._currentLerpTime >= this._lerpDuration;
    };
    EaseTo.prototype.reset = function () {
        this._initialized = false;
        this._stopped = false;
        this._currentLerpTime = 0;
    };
    EaseTo.prototype.stop = function () {
        this._motion.vel = (0, vector_1.vec)(0, 0);
        this._stopped = true;
    };
    return EaseTo;
}());
exports.EaseTo = EaseTo;
