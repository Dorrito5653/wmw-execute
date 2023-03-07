"use strict";
exports.__esModule = true;
exports.DynamicTreeCollisionProcessor = void 0;
var Physics_1 = require("../Physics");
var DynamicTree_1 = require("./DynamicTree");
var Pair_1 = require("./Pair");
var vector_1 = require("../../Math/vector");
var ray_1 = require("../../Math/ray");
var Log_1 = require("../../Util/Log");
var CollisionType_1 = require("../CollisionType");
var BodyComponent_1 = require("../BodyComponent");
var CompositeCollider_1 = require("../Colliders/CompositeCollider");
/**
 * Responsible for performing the collision broadphase (locating potential collisions) and
 * the narrowphase (actual collision contacts)
 */
var DynamicTreeCollisionProcessor = /** @class */ (function () {
    function DynamicTreeCollisionProcessor() {
        this._dynamicCollisionTree = new DynamicTree_1.DynamicTree();
        this._pairs = new Set();
        this._collisionPairCache = [];
        this._colliders = [];
    }
    DynamicTreeCollisionProcessor.prototype.getColliders = function () {
        return this._colliders;
    };
    /**
     * Tracks a physics body for collisions
     */
    DynamicTreeCollisionProcessor.prototype.track = function (target) {
        if (!target) {
            Log_1.Logger.getInstance().warn('Cannot track null collider');
            return;
        }
        if (target instanceof CompositeCollider_1.CompositeCollider) {
            var colliders = target.getColliders();
            for (var _i = 0, colliders_1 = colliders; _i < colliders_1.length; _i++) {
                var c = colliders_1[_i];
                c.owner = target.owner;
                this._colliders.push(c);
                this._dynamicCollisionTree.trackCollider(c);
            }
        }
        else {
            this._colliders.push(target);
            this._dynamicCollisionTree.trackCollider(target);
        }
    };
    /**
     * Untracks a physics body
     */
    DynamicTreeCollisionProcessor.prototype.untrack = function (target) {
        if (!target) {
            Log_1.Logger.getInstance().warn('Cannot untrack a null collider');
            return;
        }
        if (target instanceof CompositeCollider_1.CompositeCollider) {
            var colliders = target.getColliders();
            for (var _i = 0, colliders_2 = colliders; _i < colliders_2.length; _i++) {
                var c = colliders_2[_i];
                var index = this._colliders.indexOf(c);
                if (index !== -1) {
                    this._colliders.splice(index, 1);
                }
                this._dynamicCollisionTree.untrackCollider(c);
            }
        }
        else {
            var index = this._colliders.indexOf(target);
            if (index !== -1) {
                this._colliders.splice(index, 1);
            }
            this._dynamicCollisionTree.untrackCollider(target);
        }
    };
    DynamicTreeCollisionProcessor.prototype._pairExists = function (colliderA, colliderB) {
        // if the collision pair has been calculated already short circuit
        var hash = Pair_1.Pair.calculatePairHash(colliderA.id, colliderB.id);
        return this._pairs.has(hash);
    };
    /**
     * Detects potential collision pairs in a broadphase approach with the dynamic AABB tree strategy
     */
    DynamicTreeCollisionProcessor.prototype.broadphase = function (targets, delta, stats) {
        var _this = this;
        var seconds = delta / 1000;
        // Retrieve the list of potential colliders, exclude killed, prevented, and self
        var potentialColliders = targets.filter(function (other) {
            var _a, _b;
            var body = (_a = other.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
            return ((_b = other.owner) === null || _b === void 0 ? void 0 : _b.active) && body.collisionType !== CollisionType_1.CollisionType.PreventCollision;
        });
        // clear old list of collision pairs
        this._collisionPairCache = [];
        this._pairs.clear();
        // check for normal collision pairs
        var collider;
        for (var j = 0, l = potentialColliders.length; j < l; j++) {
            collider = potentialColliders[j];
            // Query the collision tree for potential colliders
            this._dynamicCollisionTree.query(collider, function (other) {
                if (!_this._pairExists(collider, other) && Pair_1.Pair.canCollide(collider, other)) {
                    var pair = new Pair_1.Pair(collider, other);
                    _this._pairs.add(pair.id);
                    _this._collisionPairCache.push(pair);
                }
                // Always return false, to query whole tree. Returning true in the query method stops searching
                return false;
            });
        }
        if (stats) {
            stats.physics.pairs = this._collisionPairCache.length;
        }
        // Check dynamic tree for fast moving objects
        // Fast moving objects are those moving at least there smallest bound per frame
        if (Physics_1.Physics.checkForFastBodies) {
            var _loop_1 = function (collider_1) {
                var body = collider_1.owner.get(BodyComponent_1.BodyComponent);
                // Skip non-active objects. Does not make sense on other collision types
                if (body.collisionType !== CollisionType_1.CollisionType.Active) {
                    return "continue";
                }
                // Maximum travel distance next frame
                var updateDistance = body.vel.size * seconds + // velocity term
                    body.acc.size * 0.5 * seconds * seconds; // acc term
                // Find the minimum dimension
                var minDimension = Math.min(collider_1.bounds.height, collider_1.bounds.width);
                if (Physics_1.Physics.disableMinimumSpeedForFastBody || updateDistance > minDimension / 2) {
                    if (stats) {
                        stats.physics.fastBodies++;
                    }
                    // start with the oldPos because the integration for actors has already happened
                    // objects resting on a surface may be slightly penetrating in the current position
                    var updateVec = body.globalPos.sub(body.oldPos);
                    var centerPoint = collider_1.center;
                    var furthestPoint = collider_1.getFurthestPoint(body.vel);
                    var origin_1 = furthestPoint.sub(updateVec);
                    var ray_2 = new ray_1.Ray(origin_1, body.vel);
                    // back the ray up by -2x surfaceEpsilon to account for fast moving objects starting on the surface
                    ray_2.pos = ray_2.pos.add(ray_2.dir.scale(-2 * Physics_1.Physics.surfaceEpsilon));
                    var minCollider_1;
                    var minTranslate_1 = new vector_1.Vector(Infinity, Infinity);
                    this_1._dynamicCollisionTree.rayCastQuery(ray_2, updateDistance + Physics_1.Physics.surfaceEpsilon * 2, function (other) {
                        if (!_this._pairExists(collider_1, other) && Pair_1.Pair.canCollide(collider_1, other)) {
                            var hitPoint = other.rayCast(ray_2, updateDistance + Physics_1.Physics.surfaceEpsilon * 10);
                            if (hitPoint) {
                                var translate = hitPoint.sub(origin_1);
                                if (translate.size < minTranslate_1.size) {
                                    minTranslate_1 = translate;
                                    minCollider_1 = other;
                                }
                            }
                        }
                        return false;
                    });
                    if (minCollider_1 && vector_1.Vector.isValid(minTranslate_1)) {
                        var pair = new Pair_1.Pair(collider_1, minCollider_1);
                        if (!this_1._pairs.has(pair.id)) {
                            this_1._pairs.add(pair.id);
                            this_1._collisionPairCache.push(pair);
                        }
                        // move the fast moving object to the other body
                        // need to push into the surface by ex.Physics.surfaceEpsilon
                        var shift = centerPoint.sub(furthestPoint);
                        body.globalPos = origin_1
                            .add(shift)
                            .add(minTranslate_1)
                            .add(ray_2.dir.scale(10 * Physics_1.Physics.surfaceEpsilon)); // needed to push the shape slightly into contact
                        collider_1.update(body.transform.get());
                        if (stats) {
                            stats.physics.fastBodyCollisions++;
                        }
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, potentialColliders_1 = potentialColliders; _i < potentialColliders_1.length; _i++) {
                var collider_1 = potentialColliders_1[_i];
                _loop_1(collider_1);
            }
        }
        // return cache
        return this._collisionPairCache;
    };
    /**
     * Applies narrow phase on collision pairs to find actual area intersections
     * Adds actual colliding pairs to stats' Frame data
     */
    DynamicTreeCollisionProcessor.prototype.narrowphase = function (pairs, stats) {
        var contacts = [];
        for (var i = 0; i < pairs.length; i++) {
            var newContacts = pairs[i].collide();
            contacts = contacts.concat(newContacts);
            if (stats && newContacts.length > 0) {
                for (var _i = 0, newContacts_1 = newContacts; _i < newContacts_1.length; _i++) {
                    var c = newContacts_1[_i];
                    stats.physics.contacts.set(c.id, c);
                }
            }
        }
        if (stats) {
            stats.physics.collisions += contacts.length;
        }
        return contacts;
    };
    /**
     * Update the dynamic tree positions
     */
    DynamicTreeCollisionProcessor.prototype.update = function (targets) {
        var updated = 0;
        var len = targets.length;
        for (var i = 0; i < len; i++) {
            if (this._dynamicCollisionTree.updateCollider(targets[i])) {
                updated++;
            }
        }
        return updated;
    };
    DynamicTreeCollisionProcessor.prototype.debug = function (ex) {
        this._dynamicCollisionTree.debug(ex);
    };
    return DynamicTreeCollisionProcessor;
}());
exports.DynamicTreeCollisionProcessor = DynamicTreeCollisionProcessor;
