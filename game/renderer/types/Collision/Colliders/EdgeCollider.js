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
exports.EdgeCollider = void 0;
var BoundingBox_1 = require("../BoundingBox");
var CollisionJumpTable_1 = require("./CollisionJumpTable");
var CircleCollider_1 = require("./CircleCollider");
var PolygonCollider_1 = require("./PolygonCollider");
var projection_1 = require("../../Math/projection");
var line_segment_1 = require("../../Math/line-segment");
var vector_1 = require("../../Math/vector");
var Collider_1 = require("./Collider");
var ClosestLineJumpTable_1 = require("./ClosestLineJumpTable");
var affine_matrix_1 = require("../../Math/affine-matrix");
/**
 * Edge is a single line collider to create collisions with a single line.
 */
var EdgeCollider = /** @class */ (function (_super) {
    __extends(EdgeCollider, _super);
    function EdgeCollider(options) {
        var _this = this;
        var _a;
        _this = _super.call(this) || this;
        _this._globalMatrix = affine_matrix_1.AffineMatrix.identity();
        _this.begin = options.begin || vector_1.Vector.Zero;
        _this.end = options.end || vector_1.Vector.Zero;
        _this.offset = (_a = options.offset) !== null && _a !== void 0 ? _a : vector_1.Vector.Zero;
        return _this;
    }
    /**
     * Returns a clone of this Edge, not associated with any collider
     */
    EdgeCollider.prototype.clone = function () {
        return new EdgeCollider({
            begin: this.begin.clone(),
            end: this.end.clone()
        });
    };
    Object.defineProperty(EdgeCollider.prototype, "worldPos", {
        get: function () {
            var _a;
            var tx = this._transform;
            return (_a = tx === null || tx === void 0 ? void 0 : tx.globalPos.add(this.offset)) !== null && _a !== void 0 ? _a : this.offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgeCollider.prototype, "center", {
        /**
         * Get the center of the collision area in world coordinates
         */
        get: function () {
            var begin = this._getTransformedBegin();
            var end = this._getTransformedEnd();
            var pos = begin.average(end);
            return pos;
        },
        enumerable: false,
        configurable: true
    });
    EdgeCollider.prototype._getTransformedBegin = function () {
        return this._globalMatrix.multiply(this.begin);
    };
    EdgeCollider.prototype._getTransformedEnd = function () {
        return this._globalMatrix.multiply(this.end);
    };
    /**
     * Returns the slope of the line in the form of a vector
     */
    EdgeCollider.prototype.getSlope = function () {
        var begin = this._getTransformedBegin();
        var end = this._getTransformedEnd();
        var distance = begin.distance(end);
        return end.sub(begin).scale(1 / distance);
    };
    /**
     * Returns the length of the line segment in pixels
     */
    EdgeCollider.prototype.getLength = function () {
        var begin = this._getTransformedBegin();
        var end = this._getTransformedEnd();
        var distance = begin.distance(end);
        return distance;
    };
    /**
     * Tests if a point is contained in this collision area
     */
    EdgeCollider.prototype.contains = function () {
        return false;
    };
    /**
     * @inheritdoc
     */
    EdgeCollider.prototype.rayCast = function (ray, max) {
        if (max === void 0) { max = Infinity; }
        var numerator = this._getTransformedBegin().sub(ray.pos);
        // Test is line and ray are parallel and non intersecting
        if (ray.dir.cross(this.getSlope()) === 0 && numerator.cross(ray.dir) !== 0) {
            return null;
        }
        // Lines are parallel
        var divisor = ray.dir.cross(this.getSlope());
        if (divisor === 0) {
            return null;
        }
        var t = numerator.cross(this.getSlope()) / divisor;
        if (t >= 0 && t <= max) {
            var u = numerator.cross(ray.dir) / divisor / this.getLength();
            if (u >= 0 && u <= 1) {
                return ray.getPoint(t);
            }
        }
        return null;
    };
    /**
     * Returns the closes line between this and another collider, from this -> collider
     * @param shape
     */
    EdgeCollider.prototype.getClosestLineBetween = function (shape) {
        if (shape instanceof CircleCollider_1.CircleCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.CircleEdgeClosestLine(shape, this);
        }
        else if (shape instanceof PolygonCollider_1.PolygonCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.PolygonEdgeClosestLine(shape, this).flip();
        }
        else if (shape instanceof EdgeCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.EdgeEdgeClosestLine(this, shape);
        }
        else {
            throw new Error("Polygon could not collide with unknown CollisionShape ".concat(typeof shape));
        }
    };
    /**
     * @inheritdoc
     */
    EdgeCollider.prototype.collide = function (shape) {
        if (shape instanceof CircleCollider_1.CircleCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollideCircleEdge(shape, this);
        }
        else if (shape instanceof PolygonCollider_1.PolygonCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollidePolygonEdge(shape, this);
        }
        else if (shape instanceof EdgeCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollideEdgeEdge();
        }
        else {
            throw new Error("Edge could not collide with unknown CollisionShape ".concat(typeof shape));
        }
    };
    /**
     * Find the point on the collider furthest in the direction specified
     */
    EdgeCollider.prototype.getFurthestPoint = function (direction) {
        var transformedBegin = this._getTransformedBegin();
        var transformedEnd = this._getTransformedEnd();
        if (direction.dot(transformedBegin) > 0) {
            return transformedBegin;
        }
        else {
            return transformedEnd;
        }
    };
    EdgeCollider.prototype._boundsFromBeginEnd = function (begin, end, padding) {
        if (padding === void 0) { padding = 10; }
        // A perfectly vertical or horizontal edge would have a bounds 0 width or height
        // this causes problems for the collision system so we give them some padding
        return new BoundingBox_1.BoundingBox(Math.min(begin.x, end.x) - padding, Math.min(begin.y, end.y) - padding, Math.max(begin.x, end.x) + padding, Math.max(begin.y, end.y) + padding);
    };
    Object.defineProperty(EdgeCollider.prototype, "bounds", {
        /**
         * Get the axis aligned bounding box for the edge collider in world space
         */
        get: function () {
            var transformedBegin = this._getTransformedBegin();
            var transformedEnd = this._getTransformedEnd();
            return this._boundsFromBeginEnd(transformedBegin, transformedEnd);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgeCollider.prototype, "localBounds", {
        /**
         * Get the axis aligned bounding box for the edge collider in local space
         */
        get: function () {
            return this._boundsFromBeginEnd(this.begin, this.end);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns this edge represented as a line in world coordinates
     */
    EdgeCollider.prototype.asLine = function () {
        return new line_segment_1.LineSegment(this._getTransformedBegin(), this._getTransformedEnd());
    };
    /**
     * Return this edge as a line in local line coordinates (relative to the position)
     */
    EdgeCollider.prototype.asLocalLine = function () {
        return new line_segment_1.LineSegment(this.begin, this.end);
    };
    Object.defineProperty(EdgeCollider.prototype, "axes", {
        /**
         * Get the axis associated with the edge
         */
        get: function () {
            var e = this._getTransformedEnd().sub(this._getTransformedBegin());
            var edgeNormal = e.normal();
            var axes = [];
            axes.push(edgeNormal);
            axes.push(edgeNormal.negate());
            axes.push(edgeNormal.normal());
            axes.push(edgeNormal.normal().negate());
            return axes;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the moment of inertia for an edge
     * https://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    EdgeCollider.prototype.getInertia = function (mass) {
        var length = this.end.sub(this.begin).distance() / 2;
        return mass * length * length;
    };
    /**
     * @inheritdoc
     */
    EdgeCollider.prototype.update = function (transform) {
        var _a;
        this._transform = transform;
        var globalMat = (_a = transform.matrix) !== null && _a !== void 0 ? _a : this._globalMatrix;
        globalMat.clone(this._globalMatrix);
        this._globalMatrix.translate(this.offset.x, this.offset.y);
    };
    /**
     * Project the edge along a specified axis
     */
    EdgeCollider.prototype.project = function (axis) {
        var scalars = [];
        var points = [this._getTransformedBegin(), this._getTransformedEnd()];
        var len = points.length;
        for (var i = 0; i < len; i++) {
            scalars.push(points[i].dot(axis));
        }
        return new projection_1.Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    };
    EdgeCollider.prototype.debug = function (ex, color) {
        var begin = this._getTransformedBegin();
        var end = this._getTransformedEnd();
        ex.drawLine(begin, end, color, 2);
        ex.drawCircle(begin, 2, color);
        ex.drawCircle(end, 2, color);
    };
    return EdgeCollider;
}(Collider_1.Collider));
exports.EdgeCollider = EdgeCollider;
