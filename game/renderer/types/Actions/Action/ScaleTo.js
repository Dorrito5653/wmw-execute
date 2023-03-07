"use strict";
exports.__esModule = true;
exports.ScaleTo = void 0;
var vector_1 = require("../../Math/vector");
var MotionComponent_1 = require("../../EntityComponentSystem/Components/MotionComponent");
var TransformComponent_1 = require("../../EntityComponentSystem/Components/TransformComponent");
var ScaleTo = /** @class */ (function () {
    function ScaleTo(entity, scaleX, scaleY, speedX, speedY) {
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent_1.TransformComponent);
        this._motion = entity.get(MotionComponent_1.MotionComponent);
        this._endX = scaleX;
        this._endY = scaleY;
        this._speedX = speedX;
        this._speedY = speedY;
    }
    ScaleTo.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._startX = this._tx.scale.x;
            this._startY = this._tx.scale.y;
            this._distanceX = Math.abs(this._endX - this._startX);
            this._distanceY = Math.abs(this._endY - this._startY);
        }
        if (!(Math.abs(this._tx.scale.x - this._startX) >= this._distanceX)) {
            var directionX = this._endY < this._startY ? -1 : 1;
            this._motion.scaleFactor.x = this._speedX * directionX;
        }
        else {
            this._motion.scaleFactor.x = 0;
        }
        if (!(Math.abs(this._tx.scale.y - this._startY) >= this._distanceY)) {
            var directionY = this._endY < this._startY ? -1 : 1;
            this._motion.scaleFactor.y = this._speedY * directionY;
        }
        else {
            this._motion.scaleFactor.y = 0;
        }
        if (this.isComplete()) {
            this._tx.scale = (0, vector_1.vec)(this._endX, this._endY);
            this._motion.scaleFactor.x = 0;
            this._motion.scaleFactor.y = 0;
        }
    };
    ScaleTo.prototype.isComplete = function () {
        return (this._stopped ||
            (Math.abs(this._tx.scale.y - this._startX) >= (this._distanceX - 0.01) &&
                Math.abs(this._tx.scale.y - this._startY) >= (this._distanceY - 0.01)));
    };
    ScaleTo.prototype.stop = function () {
        this._motion.scaleFactor.x = 0;
        this._motion.scaleFactor.y = 0;
        this._stopped = true;
    };
    ScaleTo.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
    };
    return ScaleTo;
}());
exports.ScaleTo = ScaleTo;
