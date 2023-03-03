"use strict";
exports.__esModule = true;
exports.MoveBy = void 0;
var MotionComponent_1 = require("../../EntityComponentSystem/Components/MotionComponent");
var TransformComponent_1 = require("../../EntityComponentSystem/Components/TransformComponent");
var vector_1 = require("../../Math/vector");
var Log_1 = require("../../Util/Log");
var MoveBy = /** @class */ (function () {
    function MoveBy(entity, offsetX, offsetY, speed) {
        this._started = false;
        this._stopped = false;
        this._entity = entity;
        this._tx = entity.get(TransformComponent_1.TransformComponent);
        this._motion = entity.get(MotionComponent_1.MotionComponent);
        this._speed = speed;
        this._offset = new vector_1.Vector(offsetX, offsetY);
        if (speed <= 0) {
            Log_1.Logger.getInstance().error('Attempted to moveBy with speed less than or equal to zero : ' + speed);
            throw new Error('Speed must be greater than 0 pixels per second');
        }
    }
    MoveBy.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._start = new vector_1.Vector(this._tx.pos.x, this._tx.pos.y);
            this._end = this._start.add(this._offset);
            this._distance = this._offset.size;
            this._dir = this._end.sub(this._start).normalize();
        }
        if (this.isComplete(this._entity)) {
            this._tx.pos = (0, vector_1.vec)(this._end.x, this._end.y);
            this._motion.vel = (0, vector_1.vec)(0, 0);
        }
        else {
            this._motion.vel = this._dir.scale(this._speed);
        }
    };
    MoveBy.prototype.isComplete = function (entity) {
        var tx = entity.get(TransformComponent_1.TransformComponent);
        return this._stopped || tx.pos.distance(this._start) >= this._distance;
    };
    MoveBy.prototype.stop = function () {
        this._motion.vel = (0, vector_1.vec)(0, 0);
        this._stopped = true;
    };
    MoveBy.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
    };
    return MoveBy;
}());
exports.MoveBy = MoveBy;
