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
exports.CircleCollider = void 0;
var BoundingBox_1 = require("../BoundingBox");
var CollisionJumpTable_1 = require("./CollisionJumpTable");
var PolygonCollider_1 = require("./PolygonCollider");
var EdgeCollider_1 = require("./EdgeCollider");
var projection_1 = require("../../Math/projection");
var vector_1 = require("../../Math/vector");
var Color_1 = require("../../Color");
var Collider_1 = require("./Collider");
var ClosestLineJumpTable_1 = require("./ClosestLineJumpTable");
var affine_matrix_1 = require("../../Math/affine-matrix");
/**
 * This is a circle collider for the excalibur rigid body physics simulation
 */
var CircleCollider = /** @class */ (function (_super) {
    __extends(CircleCollider, _super);
    function CircleCollider(options) {
        var _this = _super.call(this) || this;
        /**
         * Position of the circle relative to the collider, by default (0, 0).
         */
        _this.offset = vector_1.Vector.Zero;
        _this._globalMatrix = affine_matrix_1.AffineMatrix.identity();
        _this.offset = options.offset || vector_1.Vector.Zero;
        _this.radius = options.radius || 0;
        _this._globalMatrix.translate(_this.offset.x, _this.offset.y);
        return _this;
    }
    Object.defineProperty(CircleCollider.prototype, "worldPos", {
        get: function () {
            return this._globalMatrix.getPosition();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircleCollider.prototype, "radius", {
        /**
         * Get the radius of the circle
         */
        get: function () {
            var _a;
            var tx = this._transform;
            var scale = (_a = tx === null || tx === void 0 ? void 0 : tx.globalScale) !== null && _a !== void 0 ? _a : vector_1.Vector.One;
            // This is a trade off, the alternative is retooling circles to support ellipse collisions
            return this._naturalRadius * Math.min(scale.x, scale.y);
        },
        /**
         * Set the radius of the circle
         */
        set: function (val) {
            var _a;
            var tx = this._transform;
            var scale = (_a = tx === null || tx === void 0 ? void 0 : tx.globalScale) !== null && _a !== void 0 ? _a : vector_1.Vector.One;
            // This is a trade off, the alternative is retooling circles to support ellipse collisions
            this._naturalRadius = val / Math.min(scale.x, scale.y);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a clone of this shape, not associated with any collider
     */
    CircleCollider.prototype.clone = function () {
        return new CircleCollider({
            offset: this.offset.clone(),
            radius: this.radius
        });
    };
    Object.defineProperty(CircleCollider.prototype, "center", {
        /**
         * Get the center of the collider in world coordinates
         */
        get: function () {
            return this._globalMatrix.getPosition();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Tests if a point is contained in this collider
     */
    CircleCollider.prototype.contains = function (point) {
        var _a, _b;
        var pos = (_b = (_a = this._transform) === null || _a === void 0 ? void 0 : _a.pos) !== null && _b !== void 0 ? _b : this.offset;
        var distance = pos.distance(point);
        if (distance <= this.radius) {
            return true;
        }
        return false;
    };
    /**
     * Casts a ray at the Circle collider and returns the nearest point of collision
     * @param ray
     */
    CircleCollider.prototype.rayCast = function (ray, max) {
        if (max === void 0) { max = Infinity; }
        //https://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection
        var c = this.center;
        var dir = ray.dir;
        var orig = ray.pos;
        var discriminant = Math.sqrt(Math.pow(dir.dot(orig.sub(c)), 2) - Math.pow(orig.sub(c).distance(), 2) + Math.pow(this.radius, 2));
        if (discriminant < 0) {
            // no intersection
            return null;
        }
        else {
            var toi = 0;
            if (discriminant === 0) {
                toi = -dir.dot(orig.sub(c));
                if (toi > 0 && toi < max) {
                    return ray.getPoint(toi);
                }
                return null;
            }
            else {
                var toi1 = -dir.dot(orig.sub(c)) + discriminant;
                var toi2 = -dir.dot(orig.sub(c)) - discriminant;
                var positiveToi = [];
                if (toi1 >= 0) {
                    positiveToi.push(toi1);
                }
                if (toi2 >= 0) {
                    positiveToi.push(toi2);
                }
                var mintoi = Math.min.apply(Math, positiveToi);
                if (mintoi <= max) {
                    return ray.getPoint(mintoi);
                }
                return null;
            }
        }
    };
    CircleCollider.prototype.getClosestLineBetween = function (shape) {
        if (shape instanceof CircleCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.CircleCircleClosestLine(this, shape);
        }
        else if (shape instanceof PolygonCollider_1.PolygonCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.PolygonCircleClosestLine(shape, this).flip();
        }
        else if (shape instanceof EdgeCollider_1.EdgeCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.CircleEdgeClosestLine(this, shape).flip();
        }
        else {
            throw new Error("Polygon could not collide with unknown CollisionShape ".concat(typeof shape));
        }
    };
    /**
     * @inheritdoc
     */
    CircleCollider.prototype.collide = function (collider) {
        if (collider instanceof CircleCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollideCircleCircle(this, collider);
        }
        else if (collider instanceof PolygonCollider_1.PolygonCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollideCirclePolygon(this, collider);
        }
        else if (collider instanceof EdgeCollider_1.EdgeCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollideCircleEdge(this, collider);
        }
        else {
            throw new Error("Circle could not collide with unknown CollisionShape ".concat(typeof collider));
        }
    };
    /**
     * Find the point on the collider furthest in the direction specified
     */
    CircleCollider.prototype.getFurthestPoint = function (direction) {
        return this.center.add(direction.normalize().scale(this.radius));
    };
    /**
     * Find the local point on the shape in the direction specified
     * @param direction
     */
    CircleCollider.prototype.getFurthestLocalPoint = function (direction) {
        var dir = direction.normalize();
        return dir.scale(this.radius);
    };
    Object.defineProperty(CircleCollider.prototype, "bounds", {
        /**
         * Get the axis aligned bounding box for the circle collider in world coordinates
         */
        get: function () {
            var _a, _b, _c;
            var tx = this._transform;
            var scale = (_a = tx === null || tx === void 0 ? void 0 : tx.globalScale) !== null && _a !== void 0 ? _a : vector_1.Vector.One;
            var rotation = (_b = tx === null || tx === void 0 ? void 0 : tx.globalRotation) !== null && _b !== void 0 ? _b : 0;
            var pos = ((_c = tx === null || tx === void 0 ? void 0 : tx.globalPos) !== null && _c !== void 0 ? _c : vector_1.Vector.Zero);
            return new BoundingBox_1.BoundingBox(this.offset.x - this._naturalRadius, this.offset.y - this._naturalRadius, this.offset.x + this._naturalRadius, this.offset.y + this._naturalRadius).rotate(rotation).scale(scale).translate(pos);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircleCollider.prototype, "localBounds", {
        /**
         * Get the axis aligned bounding box for the circle collider in local coordinates
         */
        get: function () {
            return new BoundingBox_1.BoundingBox(this.offset.x - this._naturalRadius, this.offset.y - this._naturalRadius, this.offset.x + this._naturalRadius, this.offset.y + this._naturalRadius);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircleCollider.prototype, "axes", {
        /**
         * Get axis not implemented on circles, since there are infinite axis in a circle
         */
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the moment of inertia of a circle given it's mass
     * https://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    CircleCollider.prototype.getInertia = function (mass) {
        return (mass * this.radius * this.radius) / 2;
    };
    /* istanbul ignore next */
    CircleCollider.prototype.update = function (transform) {
        var _a;
        this._transform = transform;
        var globalMat = (_a = transform.matrix) !== null && _a !== void 0 ? _a : this._globalMatrix;
        globalMat.clone(this._globalMatrix);
        this._globalMatrix.translate(this.offset.x, this.offset.y);
    };
    /**
     * Project the circle along a specified axis
     */
    CircleCollider.prototype.project = function (axis) {
        var scalars = [];
        var point = this.center;
        var dotProduct = point.dot(axis);
        scalars.push(dotProduct);
        scalars.push(dotProduct + this.radius);
        scalars.push(dotProduct - this.radius);
        return new projection_1.Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    };
    CircleCollider.prototype.debug = function (ex, color) {
        var _a, _b, _c, _d;
        var tx = this._transform;
        var scale = (_a = tx === null || tx === void 0 ? void 0 : tx.globalScale) !== null && _a !== void 0 ? _a : vector_1.Vector.One;
        var rotation = (_b = tx === null || tx === void 0 ? void 0 : tx.globalRotation) !== null && _b !== void 0 ? _b : 0;
        var pos = ((_c = tx === null || tx === void 0 ? void 0 : tx.globalPos) !== null && _c !== void 0 ? _c : vector_1.Vector.Zero);
        ex.save();
        ex.translate(pos.x, pos.y);
        ex.rotate(rotation);
        ex.scale(scale.x, scale.y);
        ex.drawCircle(((_d = this.offset) !== null && _d !== void 0 ? _d : vector_1.Vector.Zero), this._naturalRadius, Color_1.Color.Transparent, color, 2);
        ex.restore();
    };
    return CircleCollider;
}(Collider_1.Collider));
exports.CircleCollider = CircleCollider;
