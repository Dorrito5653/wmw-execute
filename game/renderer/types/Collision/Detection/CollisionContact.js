"use strict";
exports.__esModule = true;
exports.CollisionContact = void 0;
var Physics_1 = require("../Physics");
var CollisionType_1 = require("../CollisionType");
var Pair_1 = require("./Pair");
var BodyComponent_1 = require("../BodyComponent");
/**
 * Collision contacts are used internally by Excalibur to resolve collision between colliders. This
 * Pair prevents collisions from being evaluated more than one time
 */
var CollisionContact = /** @class */ (function () {
    function CollisionContact(colliderA, colliderB, mtv, normal, tangent, points, localPoints, info) {
        var _a, _b;
        this._canceled = false;
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.mtv = mtv;
        this.normal = normal;
        this.tangent = tangent;
        this.points = points;
        this.localPoints = localPoints;
        this.info = info;
        this.id = Pair_1.Pair.calculatePairHash(colliderA.id, colliderB.id);
        if (colliderA.__compositeColliderId || colliderB.__compositeColliderId) {
            // Add on the parent composite pair for start/end contact
            this.id += '|' + Pair_1.Pair.calculatePairHash((_a = colliderA.__compositeColliderId) !== null && _a !== void 0 ? _a : colliderA.id, (_b = colliderB.__compositeColliderId) !== null && _b !== void 0 ? _b : colliderB.id);
        }
    }
    /**
     * Match contact awake state, except if body's are Fixed
     */
    CollisionContact.prototype.matchAwake = function () {
        var bodyA = this.colliderA.owner.get(BodyComponent_1.BodyComponent);
        var bodyB = this.colliderB.owner.get(BodyComponent_1.BodyComponent);
        if (bodyA && bodyB) {
            if (bodyA.sleeping !== bodyB.sleeping) {
                if (bodyA.sleeping && bodyA.collisionType !== CollisionType_1.CollisionType.Fixed && bodyB.sleepMotion >= Physics_1.Physics.wakeThreshold) {
                    bodyA.setSleeping(false);
                }
                if (bodyB.sleeping && bodyB.collisionType !== CollisionType_1.CollisionType.Fixed && bodyA.sleepMotion >= Physics_1.Physics.wakeThreshold) {
                    bodyB.setSleeping(false);
                }
            }
        }
    };
    CollisionContact.prototype.isCanceled = function () {
        return this._canceled;
    };
    CollisionContact.prototype.cancel = function () {
        this._canceled = true;
    };
    return CollisionContact;
}());
exports.CollisionContact = CollisionContact;
