"use strict";
exports.__esModule = true;
exports.Meet = void 0;
var MotionComponent_1 = require("../../EntityComponentSystem/Components/MotionComponent");
var TransformComponent_1 = require("../../EntityComponentSystem/Components/TransformComponent");
var vector_1 = require("../../Math/vector");
var Meet = /** @class */ (function () {
    function Meet(actor, actorToMeet, speed) {
        this._started = false;
        this._stopped = false;
        this._speedWasSpecified = false;
        this._tx = actor.get(TransformComponent_1.TransformComponent);
        this._motion = actor.get(MotionComponent_1.MotionComponent);
        this._meetTx = actorToMeet.get(TransformComponent_1.TransformComponent);
        this._meetMotion = actorToMeet.get(MotionComponent_1.MotionComponent);
        this._current = new vector_1.Vector(this._tx.pos.x, this._tx.pos.y);
        this._end = new vector_1.Vector(this._meetTx.pos.x, this._meetTx.pos.y);
        this._speed = speed || 0;
        if (speed !== undefined) {
            this._speedWasSpecified = true;
        }
    }
    Meet.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._distanceBetween = this._current.distance(this._end);
            this._dir = this._end.sub(this._current).normalize();
        }
        var actorToMeetSpeed = Math.sqrt(Math.pow(this._meetMotion.vel.x, 2) + Math.pow(this._meetMotion.vel.y, 2));
        if (actorToMeetSpeed !== 0 && !this._speedWasSpecified) {
            this._speed = actorToMeetSpeed;
        }
        this._current = (0, vector_1.vec)(this._tx.pos.x, this._tx.pos.y);
        this._end = (0, vector_1.vec)(this._meetTx.pos.x, this._meetTx.pos.y);
        this._distanceBetween = this._current.distance(this._end);
        this._dir = this._end.sub(this._current).normalize();
        var m = this._dir.scale(this._speed);
        this._motion.vel = (0, vector_1.vec)(m.x, m.y);
        if (this.isComplete()) {
            this._tx.pos = (0, vector_1.vec)(this._end.x, this._end.y);
            this._motion.vel = (0, vector_1.vec)(0, 0);
        }
    };
    Meet.prototype.isComplete = function () {
        return this._stopped || this._distanceBetween <= 1;
    };
    Meet.prototype.stop = function () {
        this._motion.vel = (0, vector_1.vec)(0, 0);
        this._stopped = true;
    };
    Meet.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
        this._distanceBetween = undefined;
    };
    return Meet;
}());
exports.Meet = Meet;
