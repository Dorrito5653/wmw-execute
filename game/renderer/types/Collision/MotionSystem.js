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
exports.MotionSystem = void 0;
var MotionComponent_1 = require("../EntityComponentSystem/Components/MotionComponent");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
var System_1 = require("../EntityComponentSystem/System");
var Physics_1 = require("./Physics");
var BodyComponent_1 = require("./BodyComponent");
var CollisionType_1 = require("./CollisionType");
var Integrator_1 = require("./Integrator");
var MotionSystem = /** @class */ (function (_super) {
    __extends(MotionSystem, _super);
    function MotionSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.transform', 'ex.motion'];
        _this.systemType = System_1.SystemType.Update;
        _this.priority = -1;
        return _this;
    }
    MotionSystem.prototype.update = function (entities, elapsedMs) {
        var transform;
        var motion;
        for (var i = 0; i < entities.length; i++) {
            transform = entities[i].get(TransformComponent_1.TransformComponent);
            motion = entities[i].get(MotionComponent_1.MotionComponent);
            var optionalBody = entities[i].get(BodyComponent_1.BodyComponent);
            if (optionalBody === null || optionalBody === void 0 ? void 0 : optionalBody.sleeping) {
                continue;
            }
            var totalAcc = motion.acc.clone();
            if ((optionalBody === null || optionalBody === void 0 ? void 0 : optionalBody.collisionType) === CollisionType_1.CollisionType.Active && (optionalBody === null || optionalBody === void 0 ? void 0 : optionalBody.useGravity)) {
                totalAcc.addEqual(Physics_1.Physics.gravity);
            }
            optionalBody === null || optionalBody === void 0 ? void 0 : optionalBody.captureOldTransform();
            // Update transform and motion based on Euler linear algebra
            Integrator_1.EulerIntegrator.integrate(transform, motion, totalAcc, elapsedMs);
        }
    };
    return MotionSystem;
}(System_1.System));
exports.MotionSystem = MotionSystem;
