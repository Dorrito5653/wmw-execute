"use strict";
exports.__esModule = true;
exports.RotateTo = void 0;
var RotationType_1 = require("../RotationType");
var TransformComponent_1 = require("../../EntityComponentSystem/Components/TransformComponent");
var MotionComponent_1 = require("../../EntityComponentSystem/Components/MotionComponent");
var util_1 = require("../../Math/util");
var RotateTo = /** @class */ (function () {
    function RotateTo(entity, angleRadians, speed, rotationType) {
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent_1.TransformComponent);
        this._motion = entity.get(MotionComponent_1.MotionComponent);
        this._end = angleRadians;
        this._speed = speed;
        this._rotationType = rotationType || RotationType_1.RotationType.ShortestPath;
    }
    RotateTo.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._start = this._tx.rotation;
            this._currentNonCannonAngle = this._tx.rotation;
            var distance1 = Math.abs(this._end - this._start);
            var distance2 = util_1.TwoPI - distance1;
            if (distance1 > distance2) {
                this._shortDistance = distance2;
                this._longDistance = distance1;
            }
            else {
                this._shortDistance = distance1;
                this._longDistance = distance2;
            }
            this._shortestPathIsPositive = (this._start - this._end + util_1.TwoPI) % util_1.TwoPI >= Math.PI;
            switch (this._rotationType) {
                case RotationType_1.RotationType.ShortestPath:
                    this._distance = this._shortDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = 1;
                    }
                    else {
                        this._direction = -1;
                    }
                    break;
                case RotationType_1.RotationType.LongestPath:
                    this._distance = this._longDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = -1;
                    }
                    else {
                        this._direction = 1;
                    }
                    break;
                case RotationType_1.RotationType.Clockwise:
                    this._direction = 1;
                    if (this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
                case RotationType_1.RotationType.CounterClockwise:
                    this._direction = -1;
                    if (!this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
            }
        }
        this._motion.angularVelocity = this._direction * this._speed;
        this._currentNonCannonAngle += this._direction * this._speed * (_delta / 1000);
        if (this.isComplete()) {
            this._tx.rotation = this._end;
            this._motion.angularVelocity = 0;
            this._stopped = true;
        }
    };
    RotateTo.prototype.isComplete = function () {
        var distanceTraveled = Math.abs(this._currentNonCannonAngle - this._start);
        return this._stopped || distanceTraveled >= Math.abs(this._distance);
    };
    RotateTo.prototype.stop = function () {
        this._motion.angularVelocity = 0;
        this._stopped = true;
    };
    RotateTo.prototype.reset = function () {
        this._started = false;
        this._stopped = false;
    };
    return RotateTo;
}());
exports.RotateTo = RotateTo;
