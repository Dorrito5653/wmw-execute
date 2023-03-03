"use strict";
exports.__esModule = true;
exports.ArcadeSolver = void 0;
var Events_1 = require("../../Events");
var CollisionType_1 = require("../CollisionType");
var Side_1 = require("../Side");
var BodyComponent_1 = require("../BodyComponent");
/**
 * ArcadeSolver is the default in Excalibur. It solves collisions so that there is no overlap between contacts,
 * and negates velocity along the collision normal.
 *
 * This is usually the type of collisions used for 2D games that don't need a more realistic collision simulation.
 *
 */
var ArcadeSolver = /** @class */ (function () {
    function ArcadeSolver() {
        this.directionMap = new Map();
        this.distanceMap = new Map();
    }
    ArcadeSolver.prototype.solve = function (contacts) {
        var _this = this;
        // Events and init
        this.preSolve(contacts);
        // Remove any canceled contacts
        contacts = contacts.filter(function (c) { return !c.isCanceled(); });
        // Sort contacts by distance to avoid artifacts with seams
        // It's important to solve in a specific order
        contacts.sort(function (a, b) {
            var aDist = _this.distanceMap.get(a.id);
            var bDist = _this.distanceMap.get(b.id);
            return aDist - bDist;
        });
        for (var _i = 0, contacts_1 = contacts; _i < contacts_1.length; _i++) {
            var contact = contacts_1[_i];
            // Solve position first in arcade
            this.solvePosition(contact);
            // Solve velocity second in arcade
            this.solveVelocity(contact);
        }
        // Events and any contact house-keeping the solver needs
        this.postSolve(contacts);
        return contacts;
    };
    ArcadeSolver.prototype.preSolve = function (contacts) {
        for (var _i = 0, contacts_2 = contacts; _i < contacts_2.length; _i++) {
            var contact = contacts_2[_i];
            var side = Side_1.Side.fromDirection(contact.mtv);
            var mtv = contact.mtv.negate();
            var distance = contact.colliderA.worldPos.squareDistance(contact.colliderB.worldPos);
            this.distanceMap.set(contact.id, distance);
            // Publish collision events on both participants
            contact.colliderA.events.emit('precollision', new Events_1.PreCollisionEvent(contact.colliderA, contact.colliderB, side, mtv));
            contact.colliderB.events.emit('precollision', new Events_1.PreCollisionEvent(contact.colliderB, contact.colliderA, Side_1.Side.getOpposite(side), mtv.negate()));
        }
    };
    ArcadeSolver.prototype.postSolve = function (contacts) {
        var _a, _b;
        for (var _i = 0, contacts_3 = contacts; _i < contacts_3.length; _i++) {
            var contact = contacts_3[_i];
            if (contact.isCanceled()) {
                continue;
            }
            var colliderA = contact.colliderA;
            var colliderB = contact.colliderB;
            var bodyA = (_a = colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
            var bodyB = (_b = colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
            if (bodyA && bodyB) {
                if (bodyA.collisionType === CollisionType_1.CollisionType.Passive || bodyB.collisionType === CollisionType_1.CollisionType.Passive) {
                    continue;
                }
            }
            var side = Side_1.Side.fromDirection(contact.mtv);
            var mtv = contact.mtv.negate();
            // Publish collision events on both participants
            contact.colliderA.events.emit('postcollision', new Events_1.PostCollisionEvent(contact.colliderA, contact.colliderB, side, mtv));
            contact.colliderB.events.emit('postcollision', new Events_1.PostCollisionEvent(contact.colliderB, contact.colliderA, Side_1.Side.getOpposite(side), mtv.negate()));
        }
    };
    ArcadeSolver.prototype.solvePosition = function (contact) {
        var _a, _b;
        var epsilon = .0001;
        // if bounds no longer intersect skip to the next
        // this removes jitter from overlapping/stacked solid tiles or a wall of solid tiles
        if (!contact.colliderA.bounds.overlaps(contact.colliderB.bounds, epsilon)) {
            // Cancel the contact to prevent and solving
            contact.cancel();
            return;
        }
        if (Math.abs(contact.mtv.x) < epsilon && Math.abs(contact.mtv.y) < epsilon) {
            // Cancel near 0 mtv collisions
            contact.cancel();
            return;
        }
        var mtv = contact.mtv;
        var colliderA = contact.colliderA;
        var colliderB = contact.colliderB;
        var bodyA = (_a = colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
        var bodyB = (_b = colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
        if (bodyA && bodyB) {
            if (bodyA.collisionType === CollisionType_1.CollisionType.Passive || bodyB.collisionType === CollisionType_1.CollisionType.Passive) {
                return;
            }
            if (bodyA.collisionType === CollisionType_1.CollisionType.Active && bodyB.collisionType === CollisionType_1.CollisionType.Active) {
                // split overlaps if both are Active
                mtv = mtv.scale(0.5);
            }
            // Resolve overlaps
            if (bodyA.collisionType === CollisionType_1.CollisionType.Active) {
                bodyA.globalPos.x -= mtv.x;
                bodyA.globalPos.y -= mtv.y;
                colliderA.update(bodyA.transform.get());
            }
            if (bodyB.collisionType === CollisionType_1.CollisionType.Active) {
                bodyB.globalPos.x += mtv.x;
                bodyB.globalPos.y += mtv.y;
                colliderB.update(bodyB.transform.get());
            }
        }
    };
    ArcadeSolver.prototype.solveVelocity = function (contact) {
        var _a, _b;
        if (contact.isCanceled()) {
            return;
        }
        var colliderA = contact.colliderA;
        var colliderB = contact.colliderB;
        var bodyA = (_a = colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
        var bodyB = (_b = colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
        if (bodyA && bodyB) {
            if (bodyA.collisionType === CollisionType_1.CollisionType.Passive || bodyB.collisionType === CollisionType_1.CollisionType.Passive) {
                return;
            }
            var normal = contact.normal;
            var opposite = normal.negate();
            if (bodyA.collisionType === CollisionType_1.CollisionType.Active) {
                // only adjust velocity if the contact normal is opposite to the current velocity
                // this avoids catching edges on a platform when sliding off
                if (bodyA.vel.normalize().dot(opposite) < 0) {
                    // Cancel out velocity opposite direction of collision normal
                    var velAdj = normal.scale(normal.dot(bodyA.vel.negate()));
                    bodyA.vel = bodyA.vel.add(velAdj);
                }
            }
            if (bodyB.collisionType === CollisionType_1.CollisionType.Active) {
                // only adjust velocity if the contact normal is opposite to the current velocity
                // this avoids catching edges on a platform
                if (bodyB.vel.normalize().dot(normal) < 0) {
                    var velAdj = opposite.scale(opposite.dot(bodyB.vel.negate()));
                    bodyB.vel = bodyB.vel.add(velAdj);
                }
            }
        }
    };
    return ArcadeSolver;
}());
exports.ArcadeSolver = ArcadeSolver;
