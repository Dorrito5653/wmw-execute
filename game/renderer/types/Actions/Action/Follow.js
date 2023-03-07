"use strict";
exports.__esModule = true;
exports.Follow = void 0;
var MotionComponent_1 = require("../../EntityComponentSystem/Components/MotionComponent");
var TransformComponent_1 = require("../../EntityComponentSystem/Components/TransformComponent");
var vector_1 = require("../../Math/vector");
var Follow = /** @class */ (function () {
    function Follow(entity, entityToFollow, followDistance) {
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent_1.TransformComponent);
        this._motion = entity.get(MotionComponent_1.MotionComponent);
        this._followTx = entityToFollow.get(TransformComponent_1.TransformComponent);
        this._followMotion = entityToFollow.get(MotionComponent_1.MotionComponent);
        this._current = new vector_1.Vector(this._tx.pos.x, this._tx.pos.y);
        this._end = new vector_1.Vector(this._followTx.pos.x, this._followTx.pos.y);
        this._maximumDistance = followDistance !== undefined ? followDistance : this._current.distance(this._end);
        this._speed = 0;
    }
    Follow.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._distanceBetween = this._current.distance(this._end);
            this._dir = this._end.sub(this._current).normalize();
        }
        var actorToFollowSpeed = Math.sqrt(Math.pow(this._followMotion.vel.x, 2) + Math.pow(this._followMotion.vel.y, 2));
        if (actorToFollowSpeed !== 0) {
            this._speed = actorToFollowSpeed;
        }
        this._current = (0, vector_1.vec)(this._tx.pos.x, this._tx.pos.y);
        this._end = (0, vector_1.vec)(this._followTx.pos.x, this._followTx.pos.y);
        this._distanceBetween = this._current.distance(this._end);
        this._dir = this._end.sub(this._current).normalize();
        if (this._distanceBetween >= this._maximumDistance) {
            var m = this._dir.scale(this._speed);
            this._motion.vel = (0, vector_1.vec)(m.x, m.y);
        }
        else {
            this._motion.vel = (0, vector_1.vec)(0, 0);
        }
        if (this.isComplete()) {
            this._tx.pos = (0, vector_1.vec)(this._end.x, this._end.y);
            this._motion.vel = (0, vector_1.vec)(0, 0);
        }
    };
    Follow.prototype.stop = function () {
        this._motion.vel = (0, vector_1.vec)(0, 0);
        this._stopped = true;
    };
    Follow.prototype.isComplete = function () {
        // the actor following should never stop unless specified to do so
        return this._stopped;
    };
    Follow.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
    };
    return Follow;
}());
exports.Follow = Follow;
