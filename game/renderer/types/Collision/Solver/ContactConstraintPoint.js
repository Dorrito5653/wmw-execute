"use strict";
exports.__esModule = true;
exports.ContactConstraintPoint = void 0;
var vector_1 = require("../../Math/vector");
var BodyComponent_1 = require("../BodyComponent");
/**
 * Holds information about contact points, meant to be reused over multiple frames of contact
 */
var ContactConstraintPoint = /** @class */ (function () {
    function ContactConstraintPoint(point, local, contact) {
        this.point = point;
        this.local = local;
        this.contact = contact;
        /**
         * Impulse accumulated over time in normal direction
         */
        this.normalImpulse = 0;
        /**
         * Impulse accumulated over time in the tangent direction
         */
        this.tangentImpulse = 0;
        /**
         * Effective mass seen in the normal direction
         */
        this.normalMass = 0;
        /**
         * Effective mass seen in the tangent direction
         */
        this.tangentMass = 0;
        /**
         * Direction from center of mass of bodyA to contact point
         */
        this.aToContact = new vector_1.Vector(0, 0);
        /**
         * Direction from center of mass of bodyB to contact point
         */
        this.bToContact = new vector_1.Vector(0, 0);
        /**
         * Original contact velocity combined with bounciness
         */
        this.originalVelocityAndRestitution = 0;
        this.update();
    }
    /**
     * Updates the contact information
     */
    ContactConstraintPoint.prototype.update = function () {
        var _a, _b;
        var bodyA = (_a = this.contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
        var bodyB = (_b = this.contact.colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
        if (bodyA && bodyB) {
            var normal = this.contact.normal;
            var tangent = this.contact.tangent;
            this.aToContact = this.point.sub(bodyA.globalPos);
            this.bToContact = this.point.sub(bodyB.globalPos);
            var aToContactNormal = this.aToContact.cross(normal);
            var bToContactNormal = this.bToContact.cross(normal);
            this.normalMass =
                bodyA.inverseMass +
                    bodyB.inverseMass +
                    bodyA.inverseInertia * aToContactNormal * aToContactNormal +
                    bodyB.inverseInertia * bToContactNormal * bToContactNormal;
            var aToContactTangent = this.aToContact.cross(tangent);
            var bToContactTangent = this.bToContact.cross(tangent);
            this.tangentMass =
                bodyA.inverseMass +
                    bodyB.inverseMass +
                    bodyA.inverseInertia * aToContactTangent * aToContactTangent +
                    bodyB.inverseInertia * bToContactTangent * bToContactTangent;
        }
        return this;
    };
    /**
     * Returns the relative velocity between bodyA and bodyB
     */
    ContactConstraintPoint.prototype.getRelativeVelocity = function () {
        var _a, _b;
        var bodyA = (_a = this.contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent_1.BodyComponent);
        var bodyB = (_b = this.contact.colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent_1.BodyComponent);
        if (bodyA && bodyB) {
            // Relative velocity in linear terms
            // Angular to linear velocity formula -> omega = velocity/radius so omega x radius = velocity
            var velA = bodyA.vel.add(vector_1.Vector.cross(bodyA.angularVelocity, this.aToContact));
            var velB = bodyB.vel.add(vector_1.Vector.cross(bodyB.angularVelocity, this.bToContact));
            return velB.sub(velA);
        }
        return vector_1.Vector.Zero;
    };
    return ContactConstraintPoint;
}());
exports.ContactConstraintPoint = ContactConstraintPoint;
