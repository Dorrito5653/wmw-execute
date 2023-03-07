"use strict";
exports.__esModule = true;
exports.Pair = void 0;
var CollisionType_1 = require("../CollisionType");
var BodyComponent_1 = require("../BodyComponent");
/**
 * Models a potential collision between 2 colliders
 */
var Pair = /** @class */ (function () {
    function Pair(colliderA, colliderB) {
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.id = null;
        this.id = Pair.calculatePairHash(colliderA.id, colliderB.id);
    }
    /**
     * Returns whether a it is allowed for 2 colliders in a Pair to collide
     * @param colliderA
     * @param colliderB
     */
    Pair.canCollide = function (colliderA, colliderB) {
        var _a, _b;
        var bodyA = (_a = colliderA === null || colliderA === void 0 ? void 0 : colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
        var bodyB = (_b = colliderB === null || colliderB === void 0 ? void 0 : colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
        // Prevent self collision
        if (colliderA.id === colliderB.id) {
            return false;
        }
        // Colliders with the same owner do not collide (composite colliders)
        if (colliderA.owner &&
            colliderB.owner &&
            colliderA.owner.id === colliderB.owner.id) {
            return false;
        }
        // if the pair has a member with zero dimension don't collide
        if (colliderA.localBounds.hasZeroDimensions() || colliderB.localBounds.hasZeroDimensions()) {
            return false;
        }
        // Body's needed for collision in the current state
        // TODO can we collide without a body?
        if (!bodyA || !bodyB) {
            return false;
        }
        // If both are in the same collision group short circuit
        if (!bodyA.group.canCollide(bodyB.group)) {
            return false;
        }
        // if both are fixed short circuit
        if (bodyA.collisionType === CollisionType_1.CollisionType.Fixed && bodyB.collisionType === CollisionType_1.CollisionType.Fixed) {
            return false;
        }
        // if the either is prevent collision short circuit
        if (bodyB.collisionType === CollisionType_1.CollisionType.PreventCollision || bodyA.collisionType === CollisionType_1.CollisionType.PreventCollision) {
            return false;
        }
        // if either is dead short circuit
        if (!bodyA.active || !bodyB.active) {
            return false;
        }
        return true;
    };
    Object.defineProperty(Pair.prototype, "canCollide", {
        /**
         * Returns whether or not it is possible for the pairs to collide
         */
        get: function () {
            var colliderA = this.colliderA;
            var colliderB = this.colliderB;
            return Pair.canCollide(colliderA, colliderB);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Runs the collision intersection logic on the members of this pair
     */
    Pair.prototype.collide = function () {
        return this.colliderA.collide(this.colliderB);
    };
    /**
     * Check if the collider is part of the pair
     * @param collider
     */
    Pair.prototype.hasCollider = function (collider) {
        return collider === this.colliderA || collider === this.colliderB;
    };
    /**
     * Calculates the unique pair hash id for this collision pair (owning id)
     */
    Pair.calculatePairHash = function (idA, idB) {
        if (idA.value < idB.value) {
            return "#".concat(idA.value, "+").concat(idB.value);
        }
        else {
            return "#".concat(idB.value, "+").concat(idA.value);
        }
    };
    return Pair;
}());
exports.Pair = Pair;
