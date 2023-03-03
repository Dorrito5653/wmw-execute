"use strict";
exports.__esModule = true;
exports.RealisticSolver = void 0;
var Events_1 = require("../../Events");
var util_1 = require("../../Math/util");
var CollisionType_1 = require("../CollisionType");
var ContactConstraintPoint_1 = require("./ContactConstraintPoint");
var Side_1 = require("../Side");
var Physics_1 = require("../Physics");
var BodyComponent_1 = require("../BodyComponent");
var CollisionJumpTable_1 = require("../Colliders/CollisionJumpTable");
var RealisticSolver = /** @class */ (function () {
    function RealisticSolver() {
        this.lastFrameContacts = new Map();
        // map contact id to contact points
        this.idToContactConstraint = new Map();
    }
    RealisticSolver.prototype.getContactConstraints = function (id) {
        var _a;
        return (_a = this.idToContactConstraint.get(id)) !== null && _a !== void 0 ? _a : [];
    };
    RealisticSolver.prototype.solve = function (contacts) {
        // Events and init
        this.preSolve(contacts);
        // Remove any canceled contacts
        contacts = contacts.filter(function (c) { return !c.isCanceled(); });
        // Solve velocity first
        this.solveVelocity(contacts);
        // Solve position last because non-overlap is the most important
        this.solvePosition(contacts);
        // Events and any contact house-keeping the solver needs
        this.postSolve(contacts);
        return contacts;
    };
    RealisticSolver.prototype.preSolve = function (contacts) {
        var _a, _b, _c;
        for (var _i = 0, contacts_1 = contacts; _i < contacts_1.length; _i++) {
            var contact = contacts_1[_i];
            // Publish collision events on both participants
            var side = Side_1.Side.fromDirection(contact.mtv);
            contact.colliderA.events.emit('precollision', new Events_1.PreCollisionEvent(contact.colliderA, contact.colliderB, side, contact.mtv));
            contact.colliderA.events.emit('beforecollisionresolve', new Events_1.CollisionPreSolveEvent(contact.colliderA, contact.colliderB, side, contact.mtv, contact));
            contact.colliderB.events.emit('precollision', new Events_1.PreCollisionEvent(contact.colliderB, contact.colliderA, Side_1.Side.getOpposite(side), contact.mtv.negate()));
            contact.colliderB.events.emit('beforecollisionresolve', new Events_1.CollisionPreSolveEvent(contact.colliderB, contact.colliderA, Side_1.Side.getOpposite(side), contact.mtv.negate(), contact));
            // Match awake state for sleeping
            contact.matchAwake();
        }
        // Keep track of contacts that done
        var finishedContactIds = Array.from(this.idToContactConstraint.keys());
        for (var _d = 0, contacts_2 = contacts; _d < contacts_2.length; _d++) {
            var contact = contacts_2[_d];
            // Remove all current contacts that are not done
            var index = finishedContactIds.indexOf(contact.id);
            if (index > -1) {
                finishedContactIds.splice(index, 1);
            }
            var contactPoints = (_a = this.idToContactConstraint.get(contact.id)) !== null && _a !== void 0 ? _a : [];
            var pointIndex = 0;
            var bodyA = contact.colliderA.owner.get(BodyComponent_1.BodyComponent);
            var bodyB = contact.colliderB.owner.get(BodyComponent_1.BodyComponent);
            if (bodyA && bodyB) {
                for (var _e = 0, _f = contact.points; _e < _f.length; _e++) {
                    var point = _f[_e];
                    var normal = contact.normal;
                    var tangent = contact.tangent;
                    var aToContact = point.sub(bodyA.globalPos);
                    var bToContact = point.sub(bodyB.globalPos);
                    var aToContactNormal = aToContact.cross(normal);
                    var bToContactNormal = bToContact.cross(normal);
                    var normalMass = bodyA.inverseMass +
                        bodyB.inverseMass +
                        bodyA.inverseInertia * aToContactNormal * aToContactNormal +
                        bodyB.inverseInertia * bToContactNormal * bToContactNormal;
                    var aToContactTangent = aToContact.cross(tangent);
                    var bToContactTangent = bToContact.cross(tangent);
                    var tangentMass = bodyA.inverseMass +
                        bodyB.inverseMass +
                        bodyA.inverseInertia * aToContactTangent * aToContactTangent +
                        bodyB.inverseInertia * bToContactTangent * bToContactTangent;
                    // Preserve normal/tangent impulse by re-using the contact point if it's close
                    if (contactPoints[pointIndex] && ((_c = (_b = contactPoints[pointIndex]) === null || _b === void 0 ? void 0 : _b.point) === null || _c === void 0 ? void 0 : _c.squareDistance(point)) < 4) {
                        contactPoints[pointIndex].point = point;
                        contactPoints[pointIndex].local = contact.localPoints[pointIndex];
                    }
                    else {
                        // new contact if it's not close or doesn't exist
                        contactPoints[pointIndex] = new ContactConstraintPoint_1.ContactConstraintPoint(point, contact.localPoints[pointIndex], contact);
                    }
                    // Update contact point calculations
                    contactPoints[pointIndex].aToContact = aToContact;
                    contactPoints[pointIndex].bToContact = bToContact;
                    contactPoints[pointIndex].normalMass = 1.0 / normalMass;
                    contactPoints[pointIndex].tangentMass = 1.0 / tangentMass;
                    // Calculate relative velocity before solving to accurately do restitution
                    var restitution = bodyA.bounciness > bodyB.bounciness ? bodyA.bounciness : bodyB.bounciness;
                    var relativeVelocity = contact.normal.dot(contactPoints[pointIndex].getRelativeVelocity());
                    contactPoints[pointIndex].originalVelocityAndRestitution = 0;
                    if (relativeVelocity < -0.1) { // TODO what's a good threshold here?
                        contactPoints[pointIndex].originalVelocityAndRestitution = -restitution * relativeVelocity;
                    }
                    pointIndex++;
                }
            }
            this.idToContactConstraint.set(contact.id, contactPoints);
        }
        // Clean up any contacts that did not occur last frame
        for (var _g = 0, finishedContactIds_1 = finishedContactIds; _g < finishedContactIds_1.length; _g++) {
            var id = finishedContactIds_1[_g];
            this.idToContactConstraint["delete"](id);
        }
        // Warm contacts with accumulated impulse
        // Useful for tall stacks
        if (Physics_1.Physics.warmStart) {
            this.warmStart(contacts);
        }
        else {
            for (var _h = 0, contacts_3 = contacts; _h < contacts_3.length; _h++) {
                var contact = contacts_3[_h];
                var contactPoints = this.getContactConstraints(contact.id);
                for (var _j = 0, contactPoints_1 = contactPoints; _j < contactPoints_1.length; _j++) {
                    var point = contactPoints_1[_j];
                    point.normalImpulse = 0;
                    point.tangentImpulse = 0;
                }
            }
        }
    };
    RealisticSolver.prototype.postSolve = function (contacts) {
        for (var _i = 0, contacts_4 = contacts; _i < contacts_4.length; _i++) {
            var contact = contacts_4[_i];
            var bodyA = contact.colliderA.owner.get(BodyComponent_1.BodyComponent);
            var bodyB = contact.colliderB.owner.get(BodyComponent_1.BodyComponent);
            if (bodyA && bodyB) {
                // Skip post solve for active+passive collisions
                if (bodyA.collisionType === CollisionType_1.CollisionType.Passive || bodyB.collisionType === CollisionType_1.CollisionType.Passive) {
                    continue;
                }
                // Update motion values for sleeping
                bodyA.updateMotion();
                bodyB.updateMotion();
            }
            // Publish collision events on both participants
            var side = Side_1.Side.fromDirection(contact.mtv);
            contact.colliderA.events.emit('postcollision', new Events_1.PostCollisionEvent(contact.colliderA, contact.colliderB, side, contact.mtv));
            contact.colliderA.events.emit('aftercollisionresolve', new Events_1.CollisionPostSolveEvent(contact.colliderA, contact.colliderB, side, contact.mtv, contact));
            contact.colliderB.events.emit('postcollision', new Events_1.PostCollisionEvent(contact.colliderB, contact.colliderA, Side_1.Side.getOpposite(side), contact.mtv.negate()));
            contact.colliderB.events.emit('aftercollisionresolve', new Events_1.CollisionPostSolveEvent(contact.colliderB, contact.colliderA, Side_1.Side.getOpposite(side), contact.mtv.negate(), contact));
        }
        // Store contacts
        this.lastFrameContacts.clear();
        for (var _a = 0, contacts_5 = contacts; _a < contacts_5.length; _a++) {
            var c = contacts_5[_a];
            this.lastFrameContacts.set(c.id, c);
        }
    };
    /**
     * Warm up body's based on previous frame contact points
     * @param contacts
     */
    RealisticSolver.prototype.warmStart = function (contacts) {
        var _a, _b, _c;
        for (var _i = 0, contacts_6 = contacts; _i < contacts_6.length; _i++) {
            var contact = contacts_6[_i];
            var bodyA = (_a = contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
            var bodyB = (_b = contact.colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
            if (bodyA && bodyB) {
                var contactPoints = (_c = this.idToContactConstraint.get(contact.id)) !== null && _c !== void 0 ? _c : [];
                for (var _d = 0, contactPoints_2 = contactPoints; _d < contactPoints_2.length; _d++) {
                    var point = contactPoints_2[_d];
                    if (Physics_1.Physics.warmStart) {
                        var normalImpulse = contact.normal.scale(point.normalImpulse);
                        var tangentImpulse = contact.tangent.scale(point.tangentImpulse);
                        var impulse = normalImpulse.add(tangentImpulse);
                        bodyA.applyImpulse(point.point, impulse.negate());
                        bodyB.applyImpulse(point.point, impulse);
                    }
                    else {
                        point.normalImpulse = 0;
                        point.tangentImpulse = 0;
                    }
                }
            }
        }
    };
    /**
     * Iteratively solve the position overlap constraint
     * @param contacts
     */
    RealisticSolver.prototype.solvePosition = function (contacts) {
        var _a, _b, _c;
        for (var i = 0; i < Physics_1.Physics.positionIterations; i++) {
            for (var _i = 0, contacts_7 = contacts; _i < contacts_7.length; _i++) {
                var contact = contacts_7[_i];
                var bodyA = (_a = contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
                var bodyB = (_b = contact.colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
                if (bodyA && bodyB) {
                    // Skip solving active+passive
                    if (bodyA.collisionType === CollisionType_1.CollisionType.Passive || bodyB.collisionType === CollisionType_1.CollisionType.Passive) {
                        continue;
                    }
                    var constraints = (_c = this.idToContactConstraint.get(contact.id)) !== null && _c !== void 0 ? _c : [];
                    for (var _d = 0, constraints_1 = constraints; _d < constraints_1.length; _d++) {
                        var point = constraints_1[_d];
                        var normal = contact.normal;
                        var separation = CollisionJumpTable_1.CollisionJumpTable.FindContactSeparation(contact, point.local);
                        var steeringConstant = Physics_1.Physics.steeringFactor; //0.2;
                        var maxCorrection = -5;
                        var slop = Physics_1.Physics.slop; //1;
                        // Clamp to avoid over-correction
                        // Remember that we are shooting for 0 overlap in the end
                        var steeringForce = (0, util_1.clamp)(steeringConstant * (separation + slop), maxCorrection, 0);
                        var impulse = normal.scale(-steeringForce * point.normalMass);
                        // This is a pseudo impulse, meaning we aren't doing a real impulse calculation
                        // We adjust position and rotation instead of doing the velocity
                        if (bodyA.collisionType === CollisionType_1.CollisionType.Active) {
                            // TODO make applyPseudoImpulse function?
                            var impulseForce = impulse.negate().scale(bodyA.inverseMass);
                            if (bodyA.limitDegreeOfFreedom.includes(BodyComponent_1.DegreeOfFreedom.X)) {
                                impulseForce.x = 0;
                            }
                            if (bodyA.limitDegreeOfFreedom.includes(BodyComponent_1.DegreeOfFreedom.Y)) {
                                impulseForce.y = 0;
                            }
                            bodyA.globalPos = bodyA.globalPos.add(impulseForce);
                            if (!bodyA.limitDegreeOfFreedom.includes(BodyComponent_1.DegreeOfFreedom.Rotation)) {
                                bodyA.rotation -= point.aToContact.cross(impulse) * bodyA.inverseInertia;
                            }
                        }
                        if (bodyB.collisionType === CollisionType_1.CollisionType.Active) {
                            var impulseForce = impulse.scale(bodyB.inverseMass);
                            if (bodyB.limitDegreeOfFreedom.includes(BodyComponent_1.DegreeOfFreedom.X)) {
                                impulseForce.x = 0;
                            }
                            if (bodyB.limitDegreeOfFreedom.includes(BodyComponent_1.DegreeOfFreedom.Y)) {
                                impulseForce.y = 0;
                            }
                            bodyB.globalPos = bodyB.globalPos.add(impulseForce);
                            if (!bodyB.limitDegreeOfFreedom.includes(BodyComponent_1.DegreeOfFreedom.Rotation)) {
                                bodyB.rotation += point.bToContact.cross(impulse) * bodyB.inverseInertia;
                            }
                        }
                    }
                }
            }
        }
    };
    RealisticSolver.prototype.solveVelocity = function (contacts) {
        var _a, _b, _c;
        for (var i = 0; i < Physics_1.Physics.velocityIterations; i++) {
            for (var _i = 0, contacts_8 = contacts; _i < contacts_8.length; _i++) {
                var contact = contacts_8[_i];
                var bodyA = (_a = contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
                var bodyB = (_b = contact.colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
                if (bodyA && bodyB) {
                    // Skip solving active+passive
                    if (bodyA.collisionType === CollisionType_1.CollisionType.Passive || bodyB.collisionType === CollisionType_1.CollisionType.Passive) {
                        continue;
                    }
                    var friction = Math.min(bodyA.friction, bodyB.friction);
                    var constraints = (_c = this.idToContactConstraint.get(contact.id)) !== null && _c !== void 0 ? _c : [];
                    // Friction constraint
                    for (var _d = 0, constraints_2 = constraints; _d < constraints_2.length; _d++) {
                        var point = constraints_2[_d];
                        var relativeVelocity = point.getRelativeVelocity();
                        // Negate velocity in tangent direction to simulate friction
                        var tangentVelocity = -relativeVelocity.dot(contact.tangent);
                        var impulseDelta = tangentVelocity * point.tangentMass;
                        // Clamping based in Erin Catto's GDC 2006 talk
                        // Correct clamping https://github.com/erincatto/box2d-lite/blob/master/docs/GDC2006_Catto_Erin_PhysicsTutorial.pdf
                        // Accumulated fiction impulse is always between -uMaxFriction < dT < uMaxFriction
                        // But deltas can vary
                        var maxFriction = friction * point.normalImpulse;
                        var newImpulse = (0, util_1.clamp)(point.tangentImpulse + impulseDelta, -maxFriction, maxFriction);
                        impulseDelta = newImpulse - point.tangentImpulse;
                        point.tangentImpulse = newImpulse;
                        var impulse = contact.tangent.scale(impulseDelta);
                        bodyA.applyImpulse(point.point, impulse.negate());
                        bodyB.applyImpulse(point.point, impulse);
                    }
                    // Bounce constraint
                    for (var _e = 0, constraints_3 = constraints; _e < constraints_3.length; _e++) {
                        var point = constraints_3[_e];
                        // Need to recalc relative velocity because the previous step could have changed vel
                        var relativeVelocity = point.getRelativeVelocity();
                        // Compute impulse in normal direction
                        var normalVelocity = relativeVelocity.dot(contact.normal);
                        // Per Erin it is a mistake to apply the restitution inside the iteration
                        // From Erin Catto's Box2D we keep original contact velocity and adjust by small impulses
                        var impulseDelta = -point.normalMass * (normalVelocity - point.originalVelocityAndRestitution);
                        // Clamping based in Erin Catto's GDC 2014 talk
                        // Accumulated impulse stored in the contact is always positive (dV > 0)
                        // But deltas can be negative
                        var newImpulse = Math.max(point.normalImpulse + impulseDelta, 0);
                        impulseDelta = newImpulse - point.normalImpulse;
                        point.normalImpulse = newImpulse;
                        var impulse = contact.normal.scale(impulseDelta);
                        bodyA.applyImpulse(point.point, impulse.negate());
                        bodyB.applyImpulse(point.point, impulse);
                    }
                }
            }
        }
    };
    return RealisticSolver;
}());
exports.RealisticSolver = RealisticSolver;
