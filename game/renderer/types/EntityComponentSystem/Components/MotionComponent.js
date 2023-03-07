"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.MotionComponent = void 0;
var vector_1 = require("../../Math/vector");
var Component_1 = require("../Component");
var MotionComponent = /** @class */ (function (_super) {
    __extends(MotionComponent, _super);
    function MotionComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ex.motion';
        /**
         * The velocity of an entity in pixels per second
         */
        _this.vel = vector_1.Vector.Zero;
        /**
         * The acceleration of entity in pixels per second^2
         */
        _this.acc = vector_1.Vector.Zero;
        /**
         * The scale rate of change in scale units per second
         */
        _this.scaleFactor = vector_1.Vector.Zero;
        /**
         * The angular velocity which is how quickly the entity is rotating in radians per second
         */
        _this.angularVelocity = 0;
        /**
         * The amount of torque applied to the entity, angular acceleration is torque * inertia
         */
        _this.torque = 0;
        /**
         * Inertia can be thought of as the resistance to motion
         */
        _this.inertia = 1;
        return _this;
    }
    return MotionComponent;
}(Component_1.Component));
exports.MotionComponent = MotionComponent;
