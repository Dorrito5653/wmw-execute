"use strict";
exports.__esModule = true;
exports.MoveTo = void 0;
var MotionComponent_1 = require("../../EntityComponentSystem/Components/MotionComponent");
var TransformComponent_1 = require("../../EntityComponentSystem/Components/TransformComponent");
var vector_1 = require("../../Math/vector");
var MoveTo = /** @class */ (function () {
    function MoveTo(entity, destx, desty, speed) {
        this.entity = entity;
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent_1.TransformComponent);
        this._motion = entity.get(MotionComponent_1.MotionComponent);
        this._end = new vector_1.Vector(destx, desty);
        this._speed = speed;
    }
    MoveTo.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._start = new vector_1.Vector(this._tx.pos.x, this._tx.pos.y);
            this._distance = this._start.distance(this._end);
            this._dir = this._end.sub(this._start).normalize();
        }
        var m = this._dir.scale(this._speed);
        this._motion.vel = (0, vector_1.vec)(m.x, m.y);
        if (this.isComplete(this.entity)) {
            this._tx.pos = (0, vector_1.vec)(this._end.x, this._end.y);
            this._motion.vel = (0, vector_1.vec)(0, 0);
        }
    };
    MoveTo.prototype.isComplete = function (entity) {
        var tx = entity.get(TransformComponent_1.TransformComponent);
        return this._stopped || new vector_1.Vector(tx.pos.x, tx.pos.y).distance(this._start) >= this._distance;
    };
    MoveTo.prototype.stop = function () {
        this._motion.vel = (0, vector_1.vec)(0, 0);
        this._stopped = true;
    };
    MoveTo.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
    };
    return MoveTo;
}());
exports.MoveTo = MoveTo;
