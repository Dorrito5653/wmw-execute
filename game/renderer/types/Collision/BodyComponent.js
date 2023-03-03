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
exports.BodyComponent = exports.DegreeOfFreedom = void 0;
var vector_1 = require("../Math/vector");
var CollisionType_1 = require("./CollisionType");
var Physics_1 = require("./Physics");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
var MotionComponent_1 = require("../EntityComponentSystem/Components/MotionComponent");
var Component_1 = require("../EntityComponentSystem/Component");
var CollisionGroup_1 = require("./Group/CollisionGroup");
var EventDispatcher_1 = require("../EventDispatcher");
var Id_1 = require("../Id");
var util_1 = require("../Math/util");
var ColliderComponent_1 = require("./ColliderComponent");
var transform_1 = require("../Math/transform");
var DegreeOfFreedom;
(function (DegreeOfFreedom) {
    DegreeOfFreedom["Rotation"] = "rotation";
    DegreeOfFreedom["X"] = "x";
    DegreeOfFreedom["Y"] = "y";
})(DegreeOfFreedom = exports.DegreeOfFreedom || (exports.DegreeOfFreedom = {}));
/**
 * Body describes all the physical properties pos, vel, acc, rotation, angular velocity for the purpose of
 * of physics simulation.
 */
var BodyComponent = /** @class */ (function (_super) {
    __extends(BodyComponent, _super);
    function BodyComponent(options) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this) || this;
        _this.type = 'ex.body';
        _this.dependencies = [TransformComponent_1.TransformComponent, MotionComponent_1.MotionComponent];
        _this.id = (0, Id_1.createId)('body', BodyComponent._ID++);
        _this.events = new EventDispatcher_1.EventDispatcher();
        _this._oldTransform = new transform_1.Transform();
        /**
         * Indicates whether the old transform has been captured at least once for interpolation
         * @internal
         */
        _this.__oldTransformCaptured = false;
        /**
         * Enable or disabled the fixed update interpolation, by default interpolation is on.
         */
        _this.enableFixedUpdateInterpolate = true;
        /**
         * Collision type for the rigidbody physics simulation, by default [[CollisionType.PreventCollision]]
         */
        _this.collisionType = CollisionType_1.CollisionType.PreventCollision;
        /**
         * The collision group for the body's colliders, by default body colliders collide with everything
         */
        _this.group = CollisionGroup_1.CollisionGroup.All;
        /**
         * The amount of mass the body has
         */
        _this._mass = Physics_1.Physics.defaultMass;
        /**
         * Amount of "motion" the body has before sleeping. If below [[Physics.sleepEpsilon]] it goes to "sleep"
         */
        _this.sleepMotion = Physics_1.Physics.sleepEpsilon * 5;
        /**
         * Can this body sleep, by default bodies do not sleep
         */
        _this.canSleep = Physics_1.Physics.bodiesCanSleepByDefault;
        _this._sleeping = false;
        /**
         * The also known as coefficient of restitution of this actor, represents the amount of energy preserved after collision or the
         * bounciness. If 1, it is 100% bouncy, 0 it completely absorbs.
         */
        _this.bounciness = 0.2;
        /**
         * The coefficient of friction on this actor
         */
        _this.friction = 0.99;
        /**
         * Should use global gravity [[Physics.gravity]] in it's physics simulation, default is true
         */
        _this.useGravity = true;
        /**
         * Degrees of freedom to limit
         *
         * Note: this only limits responses in the realistic solver, if velocity/angularVelocity is set the actor will still respond
         */
        _this.limitDegreeOfFreedom = [];
        /**
         * The velocity of the actor last frame (vx, vy) in pixels/second
         */
        _this.oldVel = new vector_1.Vector(0, 0);
        /**
         * Gets/sets the acceleration of the actor from the last frame. This does not include the global acc [[Physics.acc]].
         */
        _this.oldAcc = vector_1.Vector.Zero;
        if (options) {
            _this.collisionType = (_a = options.type) !== null && _a !== void 0 ? _a : _this.collisionType;
            _this.group = (_b = options.group) !== null && _b !== void 0 ? _b : _this.group;
            _this.useGravity = (_c = options.useGravity) !== null && _c !== void 0 ? _c : _this.useGravity;
        }
        return _this;
    }
    Object.defineProperty(BodyComponent.prototype, "matrix", {
        get: function () {
            return this.transform.get().matrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "mass", {
        get: function () {
            return this._mass;
        },
        set: function (newMass) {
            this._mass = newMass;
            this._cachedInertia = undefined;
            this._cachedInverseInertia = undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "inverseMass", {
        /**
         * The inverse mass (1/mass) of the body. If [[CollisionType.Fixed]] this is 0, meaning "infinite" mass
         */
        get: function () {
            return this.collisionType === CollisionType_1.CollisionType.Fixed ? 0 : 1 / this.mass;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "sleeping", {
        /**
         * Whether this body is sleeping or not
         */
        get: function () {
            return this._sleeping;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Set the sleep state of the body
     * @param sleeping
     */
    BodyComponent.prototype.setSleeping = function (sleeping) {
        this._sleeping = sleeping;
        if (!sleeping) {
            // Give it a kick to keep it from falling asleep immediately
            this.sleepMotion = Physics_1.Physics.sleepEpsilon * 5;
        }
        else {
            this.vel = vector_1.Vector.Zero;
            this.acc = vector_1.Vector.Zero;
            this.angularVelocity = 0;
            this.sleepMotion = 0;
        }
    };
    /**
     * Update body's [[BodyComponent.sleepMotion]] for the purpose of sleeping
     */
    BodyComponent.prototype.updateMotion = function () {
        if (this._sleeping) {
            this.setSleeping(true);
        }
        var currentMotion = this.vel.size * this.vel.size + Math.abs(this.angularVelocity * this.angularVelocity);
        var bias = Physics_1.Physics.sleepBias;
        this.sleepMotion = bias * this.sleepMotion + (1 - bias) * currentMotion;
        this.sleepMotion = (0, util_1.clamp)(this.sleepMotion, 0, 10 * Physics_1.Physics.sleepEpsilon);
        if (this.canSleep && this.sleepMotion < Physics_1.Physics.sleepEpsilon) {
            this.setSleeping(true);
        }
    };
    Object.defineProperty(BodyComponent.prototype, "inertia", {
        /**
         * Get the moment of inertia from the [[ColliderComponent]]
         */
        get: function () {
            var _this = this;
            if (this._cachedInertia) {
                return this._cachedInertia;
            }
            // Inertia is a property of the geometry, so this is a little goofy but seems to be okay?
            var collider = this.owner.get(ColliderComponent_1.ColliderComponent);
            if (collider) {
                collider.$colliderAdded.subscribe(function () {
                    _this._cachedInertia = null;
                });
                collider.$colliderRemoved.subscribe(function () {
                    _this._cachedInertia = null;
                });
                var maybeCollider = collider.get();
                if (maybeCollider) {
                    return this._cachedInertia = maybeCollider.getInertia(this.mass);
                }
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "inverseInertia", {
        /**
         * Get the inverse moment of inertial from the [[ColliderComponent]]. If [[CollisionType.Fixed]] this is 0, meaning "infinite" mass
         */
        get: function () {
            if (this._cachedInverseInertia) {
                return this._cachedInverseInertia;
            }
            return this._cachedInverseInertia = this.collisionType === CollisionType_1.CollisionType.Fixed ? 0 : 1 / this.inertia;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "active", {
        /**
         * Returns if the owner is active
         */
        get: function () {
            var _a;
            return !!((_a = this.owner) === null || _a === void 0 ? void 0 : _a.active);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "center", {
        /**
         * @deprecated Use globalP0s
         */
        get: function () {
            return this.globalPos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "transform", {
        get: function () {
            var _a;
            return (_a = this.owner) === null || _a === void 0 ? void 0 : _a.get(TransformComponent_1.TransformComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "motion", {
        get: function () {
            var _a;
            return (_a = this.owner) === null || _a === void 0 ? void 0 : _a.get(MotionComponent_1.MotionComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "pos", {
        get: function () {
            return this.transform.pos;
        },
        set: function (val) {
            this.transform.pos = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "globalPos", {
        /**
         * The (x, y) position of the actor this will be in the middle of the actor if the
         * [[Actor.anchor]] is set to (0.5, 0.5) which is default.
         * If you want the (x, y) position to be the top left of the actor specify an anchor of (0, 0).
         */
        get: function () {
            return this.transform.globalPos;
        },
        set: function (val) {
            this.transform.globalPos = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "oldPos", {
        /**
         * The position of the actor last frame (x, y) in pixels
         */
        get: function () {
            return this._oldTransform.pos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "vel", {
        /**
         * The current velocity vector (vx, vy) of the actor in pixels/second
         */
        get: function () {
            return this.motion.vel;
        },
        set: function (val) {
            this.motion.vel = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "acc", {
        /**
         * The current acceleration vector (ax, ay) of the actor in pixels/second/second. An acceleration pointing down such as (0, 100) may
         * be useful to simulate a gravitational effect.
         */
        get: function () {
            return this.motion.acc;
        },
        set: function (val) {
            this.motion.acc = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "torque", {
        /**
         * The current torque applied to the actor
         */
        get: function () {
            return this.motion.torque;
        },
        set: function (val) {
            this.motion.torque = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "oldRotation", {
        /**
         * Gets/sets the rotation of the body from the last frame.
         */
        get: function () {
            return this._oldTransform.rotation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "rotation", {
        /**
         * The rotation of the body in radians
         */
        get: function () {
            return this.transform.globalRotation;
        },
        set: function (val) {
            this.transform.globalRotation = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "scale", {
        /**
         * The scale vector of the actor
         */
        get: function () {
            return this.transform.globalScale;
        },
        set: function (val) {
            this.transform.globalScale = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "oldScale", {
        /**
         * The scale of the actor last frame
         */
        get: function () {
            return this._oldTransform.scale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "scaleFactor", {
        /**
         * The scale rate of change of the actor in scale/second
         */
        get: function () {
            return this.motion.scaleFactor;
        },
        set: function (scaleFactor) {
            this.motion.scaleFactor = scaleFactor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BodyComponent.prototype, "angularVelocity", {
        /**
         * Get the angular velocity in radians/second
         */
        get: function () {
            return this.motion.angularVelocity;
        },
        /**
         * Set the angular velocity in radians/second
         */
        set: function (value) {
            this.motion.angularVelocity = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Apply a specific impulse to the body
     * @param point
     * @param impulse
     */
    BodyComponent.prototype.applyImpulse = function (point, impulse) {
        if (this.collisionType !== CollisionType_1.CollisionType.Active) {
            return; // only active objects participate in the simulation
        }
        var finalImpulse = impulse.scale(this.inverseMass);
        if (this.limitDegreeOfFreedom.includes(DegreeOfFreedom.X)) {
            finalImpulse.x = 0;
        }
        if (this.limitDegreeOfFreedom.includes(DegreeOfFreedom.Y)) {
            finalImpulse.y = 0;
        }
        this.vel.addEqual(finalImpulse);
        if (!this.limitDegreeOfFreedom.includes(DegreeOfFreedom.Rotation)) {
            var distanceFromCenter = point.sub(this.globalPos);
            this.angularVelocity += this.inverseInertia * distanceFromCenter.cross(impulse);
        }
    };
    /**
     * Apply only linear impulse to the body
     * @param impulse
     */
    BodyComponent.prototype.applyLinearImpulse = function (impulse) {
        if (this.collisionType !== CollisionType_1.CollisionType.Active) {
            return; // only active objects participate in the simulation
        }
        var finalImpulse = impulse.scale(this.inverseMass);
        if (this.limitDegreeOfFreedom.includes(DegreeOfFreedom.X)) {
            finalImpulse.x = 0;
        }
        if (this.limitDegreeOfFreedom.includes(DegreeOfFreedom.Y)) {
            finalImpulse.y = 0;
        }
        this.vel = this.vel.add(finalImpulse);
    };
    /**
     * Apply only angular impulse to the body
     * @param point
     * @param impulse
     */
    BodyComponent.prototype.applyAngularImpulse = function (point, impulse) {
        if (this.collisionType !== CollisionType_1.CollisionType.Active) {
            return; // only active objects participate in the simulation
        }
        if (!this.limitDegreeOfFreedom.includes(DegreeOfFreedom.Rotation)) {
            var distanceFromCenter = point.sub(this.globalPos);
            this.angularVelocity += this.inverseInertia * distanceFromCenter.cross(impulse);
        }
    };
    /**
     * Sets the old versions of pos, vel, acc, and scale.
     */
    BodyComponent.prototype.captureOldTransform = function () {
        // Capture old values before integration step updates them
        this.__oldTransformCaptured = true;
        this.transform.get().clone(this._oldTransform);
        this.oldVel.setTo(this.vel.x, this.vel.y);
        this.oldAcc.setTo(this.acc.x, this.acc.y);
    };
    BodyComponent._ID = 0;
    return BodyComponent;
}(Component_1.Component));
exports.BodyComponent = BodyComponent;
