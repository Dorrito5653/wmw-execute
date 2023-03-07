"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Physics = exports.Integrator = exports.BroadphaseStrategy = exports.CollisionResolutionStrategy = void 0;
var vector_1 = require("../Math/vector");
var Decorators_1 = require("../Util/Decorators");
/**
 * Possible collision resolution strategies
 *
 * The default is [[CollisionResolutionStrategy.Arcade]] which performs simple axis aligned arcade style physics. This is useful for things
 * like platformers or top down games.
 *
 * More advanced rigid body physics are enabled by setting [[CollisionResolutionStrategy.Realistic]] which allows for complicated
 * simulated physical interactions.
 */
var CollisionResolutionStrategy;
(function (CollisionResolutionStrategy) {
    CollisionResolutionStrategy["Arcade"] = "arcade";
    CollisionResolutionStrategy["Realistic"] = "realistic";
})(CollisionResolutionStrategy = exports.CollisionResolutionStrategy || (exports.CollisionResolutionStrategy = {}));
/**
 * Possible broadphase collision pair identification strategies
 *
 * The default strategy is [[BroadphaseStrategy.DynamicAABBTree]] which uses a binary tree of axis-aligned bounding boxes to identify
 * potential collision pairs which is O(nlog(n)) faster.
 */
var BroadphaseStrategy;
(function (BroadphaseStrategy) {
    BroadphaseStrategy[BroadphaseStrategy["DynamicAABBTree"] = 0] = "DynamicAABBTree";
})(BroadphaseStrategy = exports.BroadphaseStrategy || (exports.BroadphaseStrategy = {}));
/**
 * Possible numerical integrators for position and velocity
 */
var Integrator;
(function (Integrator) {
    Integrator[Integrator["Euler"] = 0] = "Euler";
})(Integrator = exports.Integrator || (exports.Integrator = {}));
/**
 * The [[Physics]] object is the global configuration object for all Excalibur physics.
 */
/* istanbul ignore next */
var Physics = /** @class */ (function () {
    function Physics() {
    }
    Object.defineProperty(Physics, "gravity", {
        get: function () {
            return Physics.acc;
        },
        set: function (v) {
            Physics.acc = v;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Configures Excalibur to use "arcade" physics. Arcade physics which performs simple axis aligned arcade style physics.
     */
    Physics.useArcadePhysics = function () {
        Physics.collisionResolutionStrategy = CollisionResolutionStrategy.Arcade;
    };
    /**
     * Configures Excalibur to use rigid body physics. Rigid body physics allows for complicated
     * simulated physical interactions.
     */
    Physics.useRealisticPhysics = function () {
        Physics.collisionResolutionStrategy = CollisionResolutionStrategy.Realistic;
    };
    Object.defineProperty(Physics, "dynamicTreeVelocityMultiplyer", {
        get: function () {
            return Physics.dynamicTreeVelocityMultiplier;
        },
        set: function (value) {
            Physics.dynamicTreeVelocityMultiplier = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Global acceleration that is applied to all vanilla actors that have a [[CollisionType.Active|active]] collision type.
     * Global acceleration won't effect [[Label|labels]], [[ScreenElement|ui actors]], or [[Trigger|triggers]] in Excalibur.
     *
     * This is a great way to globally simulate effects like gravity.
     */
    Physics.acc = new vector_1.Vector(0, 0);
    /**
     * Globally switches all Excalibur physics behavior on or off.
     */
    Physics.enabled = true;
    /**
     * Gets or sets the broadphase pair identification strategy.
     *
     * The default strategy is [[BroadphaseStrategy.DynamicAABBTree]] which uses a binary tree of axis-aligned bounding boxes to identify
     * potential collision pairs which is O(nlog(n)) faster.
     */
    Physics.broadphaseStrategy = BroadphaseStrategy.DynamicAABBTree;
    /**
     * Gets or sets the global collision resolution strategy (narrowphase).
     *
     * The default is [[CollisionResolutionStrategy.Arcade]] which performs simple axis aligned arcade style physics.
     *
     * More advanced rigid body physics are enabled by setting [[CollisionResolutionStrategy.Realistic]] which allows for complicated
     * simulated physical interactions.
     */
    Physics.collisionResolutionStrategy = CollisionResolutionStrategy.Arcade;
    /**
     * The default mass to use if none is specified
     */
    Physics.defaultMass = 10;
    /**
     * Gets or sets the position and velocity positional integrator, currently only Euler is supported.
     */
    Physics.integrator = Integrator.Euler;
    /**
     * Factor to add to the RigidBody BoundingBox, bounding box (dimensions += vel * dynamicTreeVelocityMultiplier);
     */
    Physics.dynamicTreeVelocityMultiplier = 2;
    /**
     * Pad RigidBody BoundingBox by a constant amount
     */
    Physics.boundsPadding = 5;
    /**
     * Number of position iterations (overlap) to run in the solver
     */
    Physics.positionIterations = 3;
    /**
     * Number of velocity iteration (response) to run in the solver
     */
    Physics.velocityIterations = 8;
    /**
     * Amount of overlap to tolerate in pixels
     */
    Physics.slop = 1;
    /**
     * Amount of positional overlap correction to apply each position iteration of the solver
     * O - meaning no correction, 1 - meaning correct all overlap
     */
    Physics.steeringFactor = 0.2;
    /**
     * Warm start set to true re-uses impulses from previous frames back in the solver
     */
    Physics.warmStart = true;
    /**
     * By default bodies do not sleep
     */
    Physics.bodiesCanSleepByDefault = false;
    /**
     * Surface epsilon is used to help deal with surface penetration
     */
    Physics.surfaceEpsilon = 0.1;
    Physics.sleepEpsilon = 0.07;
    Physics.wakeThreshold = Physics.sleepEpsilon * 3;
    Physics.sleepBias = 0.9;
    /**
     * Enable fast moving body checking, this enables checking for collision pairs via raycast for fast moving objects to prevent
     * bodies from tunneling through one another.
     */
    Physics.checkForFastBodies = true;
    /**
     * Disable minimum fast moving body raycast, by default if ex.Physics.checkForFastBodies = true Excalibur will only check if the
     * body is moving at least half of its minimum dimension in an update. If ex.Physics.disableMinimumSpeedForFastBody is set to true,
     * Excalibur will always perform the fast body raycast regardless of speed.
     */
    Physics.disableMinimumSpeedForFastBody = false;
    __decorate([
        (0, Decorators_1.obsolete)({
            message: 'Alias for incorrect spelling used in older versions, will be removed in v0.25.0',
            alternateMethod: 'dynamicTreeVelocityMultiplier'
        })
    ], Physics, "dynamicTreeVelocityMultiplyer");
    return Physics;
}());
exports.Physics = Physics;
