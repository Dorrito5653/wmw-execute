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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.PolygonCollider = void 0;
var BoundingBox_1 = require("../BoundingBox");
var EdgeCollider_1 = require("./EdgeCollider");
var CollisionJumpTable_1 = require("./CollisionJumpTable");
var CircleCollider_1 = require("./CircleCollider");
var projection_1 = require("../../Math/projection");
var line_segment_1 = require("../../Math/line-segment");
var vector_1 = require("../../Math/vector");
var affine_matrix_1 = require("../../Math/affine-matrix");
var ray_1 = require("../../Math/ray");
var ClosestLineJumpTable_1 = require("./ClosestLineJumpTable");
var Collider_1 = require("./Collider");
var __1 = require("../..");
var CompositeCollider_1 = require("./CompositeCollider");
var Shape_1 = require("./Shape");
/**
 * Polygon collider for detecting collisions
 */
var PolygonCollider = /** @class */ (function (_super) {
    __extends(PolygonCollider, _super);
    function PolygonCollider(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this) || this;
        _this._logger = __1.Logger.getInstance();
        _this._transformedPoints = [];
        _this._sides = [];
        _this._localSides = [];
        _this._globalMatrix = affine_matrix_1.AffineMatrix.identity();
        _this._transformedPointsDirty = true;
        _this._sidesDirty = true;
        _this._localSidesDirty = true;
        _this._localBoundsDirty = true;
        _this.offset = (_a = options.offset) !== null && _a !== void 0 ? _a : vector_1.Vector.Zero;
        _this._globalMatrix.translate(_this.offset.x, _this.offset.y);
        _this.points = (_b = options.points) !== null && _b !== void 0 ? _b : [];
        var counterClockwise = _this._isCounterClockwiseWinding(_this.points);
        if (!counterClockwise) {
            _this.points.reverse();
        }
        if (!_this.isConvex()) {
            _this._logger.warn('Excalibur only supports convex polygon colliders and will not behave properly.' +
                'Call PolygonCollider.triangulate() to build a new collider composed of smaller convex triangles');
        }
        // calculate initial transformation
        _this._calculateTransformation();
        return _this;
    }
    Object.defineProperty(PolygonCollider.prototype, "points", {
        /**
         * Points in the polygon in order around the perimeter in local coordinates. These are relative from the body transform position.
         * Excalibur stores these in counter-clockwise order
         */
        get: function () {
            return this._points;
        },
        /**
         * Points in the polygon in order around the perimeter in local coordinates. These are relative from the body transform position.
         * Excalibur stores these in counter-clockwise order
         */
        set: function (points) {
            this._localBoundsDirty = true;
            this._localSidesDirty = true;
            this._sidesDirty = true;
            this._points = points;
        },
        enumerable: false,
        configurable: true
    });
    PolygonCollider.prototype._isCounterClockwiseWinding = function (points) {
        // https://stackoverflow.com/a/1165943
        var sum = 0;
        for (var i = 0; i < points.length; i++) {
            sum += (points[(i + 1) % points.length].x - points[i].x) * (points[(i + 1) % points.length].y + points[i].y);
        }
        return sum < 0;
    };
    /**
     * Returns if the polygon collider is convex, Excalibur does not handle non-convex collision shapes.
     * Call [[Polygon.triangulate]] to generate a [[CompositeCollider]] from this non-convex shape
     */
    PolygonCollider.prototype.isConvex = function () {
        // From SO: https://stackoverflow.com/a/45372025
        if (this.points.length < 3) {
            return false;
        }
        var oldPoint = this.points[this.points.length - 2];
        var newPoint = this.points[this.points.length - 1];
        var direction = Math.atan2(newPoint.y - oldPoint.y, newPoint.x - oldPoint.x);
        var oldDirection = 0;
        var orientation = 0;
        var angleSum = 0;
        for (var _i = 0, _a = this.points.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], point = _b[1];
            oldPoint = newPoint;
            oldDirection = direction;
            newPoint = point;
            direction = Math.atan2(newPoint.y - oldPoint.y, newPoint.x - oldPoint.x);
            if (oldPoint.equals(newPoint)) {
                return false; // repeat point
            }
            var angle = direction - oldDirection;
            if (angle <= -Math.PI) {
                angle += Math.PI * 2;
            }
            else if (angle > Math.PI) {
                angle -= Math.PI * 2;
            }
            if (i === 0) {
                if (angle === 0.0) {
                    return false;
                }
                orientation = angle > 0 ? 1 : -1;
            }
            else {
                if (orientation * angle <= 0) {
                    return false;
                }
            }
            angleSum += angle;
        }
        return Math.abs(Math.round(angleSum / (Math.PI * 2))) === 1;
    };
    /**
     * Tessellates the polygon into a triangle fan as a [[CompositeCollider]] of triangle polygons
     */
    PolygonCollider.prototype.tessellate = function () {
        var polygons = [];
        for (var i = 1; i < this.points.length - 2; i++) {
            polygons.push([this.points[0], this.points[i + 1], this.points[i + 2]]);
        }
        polygons.push([this.points[0], this.points[1], this.points[2]]);
        return new CompositeCollider_1.CompositeCollider(polygons.map(function (points) { return Shape_1.Shape.Polygon(points); }));
    };
    /**
     * Triangulate the polygon collider using the "Ear Clipping" algorithm.
     * Returns a new [[CompositeCollider]] made up of smaller triangles.
     */
    PolygonCollider.prototype.triangulate = function () {
        // https://www.youtube.com/watch?v=hTJFcHutls8
        if (this.points.length < 3) {
            throw Error('Invalid polygon');
        }
        /**
         * Helper to get a vertex in the list
         */
        function getItem(index, list) {
            if (index >= list.length) {
                return list[index % list.length];
            }
            else if (index < 0) {
                return list[index % list.length + list.length];
            }
            else {
                return list[index];
            }
        }
        /**
         * Quick test for point in triangle
         */
        function isPointInTriangle(point, a, b, c) {
            var ab = b.sub(a);
            var bc = c.sub(b);
            var ca = a.sub(c);
            var ap = point.sub(a);
            var bp = point.sub(b);
            var cp = point.sub(c);
            var cross1 = ab.cross(ap);
            var cross2 = bc.cross(bp);
            var cross3 = ca.cross(cp);
            if (cross1 > 0 || cross2 > 0 || cross3 > 0) {
                return false;
            }
            return true;
        }
        var triangles = [];
        var vertices = __spreadArray([], this.points, true);
        var indices = (0, __1.range)(0, this.points.length - 1);
        // 1. Loop through vertices clockwise
        //    if the vertex is convex (interior angle is < 180) (cross product positive)
        //    if the polygon formed by it's edges doesn't contain the points
        //         it's an ear add it to our list of triangles, and restart
        while (indices.length > 3) {
            for (var i = 0; i < indices.length; i++) {
                var a = indices[i];
                var b = getItem(i - 1, indices);
                var c = getItem(i + 1, indices);
                var va = vertices[a];
                var vb = vertices[b];
                var vc = vertices[c];
                // Check convexity
                var leftArm = vb.sub(va);
                var rightArm = vc.sub(va);
                var isConvex = rightArm.cross(leftArm) > 0; // positive cross means convex
                if (!isConvex) {
                    continue;
                }
                var isEar = true;
                // Check that if any vertices are in the triangle a, b, c
                for (var j = 0; j < indices.length; j++) {
                    var vertIndex = indices[j];
                    // We can skip these
                    if (vertIndex === a || vertIndex === b || vertIndex === c) {
                        continue;
                    }
                    var point = vertices[vertIndex];
                    if (isPointInTriangle(point, vb, va, vc)) {
                        isEar = false;
                        break;
                    }
                }
                // Add ear to polygon list and remove from list
                if (isEar) {
                    triangles.push([vb, va, vc]);
                    indices.splice(i, 1);
                    break;
                }
            }
        }
        triangles.push([vertices[indices[0]], vertices[indices[1]], vertices[indices[2]]]);
        return new CompositeCollider_1.CompositeCollider(triangles.map(function (points) { return Shape_1.Shape.Polygon(points); }));
    };
    /**
     * Returns a clone of this ConvexPolygon, not associated with any collider
     */
    PolygonCollider.prototype.clone = function () {
        return new PolygonCollider({
            offset: this.offset.clone(),
            points: this.points.map(function (p) { return p.clone(); })
        });
    };
    Object.defineProperty(PolygonCollider.prototype, "worldPos", {
        /**
         * Returns the world position of the collider, which is the current body transform plus any defined offset
         */
        get: function () {
            if (this._transform) {
                return this._transform.pos.add(this.offset);
            }
            return this.offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonCollider.prototype, "center", {
        /**
         * Get the center of the collider in world coordinates
         */
        get: function () {
            return this.bounds.center;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Calculates the underlying transformation from the body relative space to world space
     */
    PolygonCollider.prototype._calculateTransformation = function () {
        var points = this.points;
        var len = points.length;
        this._transformedPoints.length = 0; // clear out old transform
        for (var i = 0; i < len; i++) {
            this._transformedPoints[i] = this._globalMatrix.multiply(points[i].clone());
        }
    };
    /**
     * Gets the points that make up the polygon in world space, from actor relative space (if specified)
     */
    PolygonCollider.prototype.getTransformedPoints = function () {
        if (this._transformedPointsDirty) {
            this._calculateTransformation();
            this._transformedPointsDirty = false;
        }
        return this._transformedPoints;
    };
    /**
     * Gets the sides of the polygon in world space
     */
    PolygonCollider.prototype.getSides = function () {
        if (this._sidesDirty) {
            var lines = [];
            var points = this.getTransformedPoints();
            var len = points.length;
            for (var i = 0; i < len; i++) {
                // This winding is important
                lines.push(new line_segment_1.LineSegment(points[i], points[(i + 1) % len]));
            }
            this._sides = lines;
            this._sidesDirty = false;
        }
        return this._sides;
    };
    /**
     * Returns the local coordinate space sides
     */
    PolygonCollider.prototype.getLocalSides = function () {
        if (this._localSidesDirty) {
            var lines = [];
            var points = this.points;
            var len = points.length;
            for (var i = 0; i < len; i++) {
                // This winding is important
                lines.push(new line_segment_1.LineSegment(points[i], points[(i + 1) % len]));
            }
            this._localSides = lines;
            this._localSidesDirty = false;
        }
        return this._localSides;
    };
    /**
     * Given a direction vector find the world space side that is most in that direction
     * @param direction
     */
    PolygonCollider.prototype.findSide = function (direction) {
        var sides = this.getSides();
        var bestSide = sides[0];
        var maxDistance = -Number.MAX_VALUE;
        for (var side = 0; side < sides.length; side++) {
            var currentSide = sides[side];
            var sideNormal = currentSide.normal();
            var mostDirection = sideNormal.dot(direction);
            if (mostDirection > maxDistance) {
                bestSide = currentSide;
                maxDistance = mostDirection;
            }
        }
        return bestSide;
    };
    /**
     * Given a direction vector find the local space side that is most in that direction
     * @param direction
     */
    PolygonCollider.prototype.findLocalSide = function (direction) {
        var sides = this.getLocalSides();
        var bestSide = sides[0];
        var maxDistance = -Number.MAX_VALUE;
        for (var side = 0; side < sides.length; side++) {
            var currentSide = sides[side];
            var sideNormal = currentSide.normal();
            var mostDirection = sideNormal.dot(direction);
            if (mostDirection > maxDistance) {
                bestSide = currentSide;
                maxDistance = mostDirection;
            }
        }
        return bestSide;
    };
    Object.defineProperty(PolygonCollider.prototype, "axes", {
        /**
         * Get the axis associated with the convex polygon
         */
        get: function () {
            var axes = [];
            var sides = this.getSides();
            for (var i = 0; i < sides.length; i++) {
                axes.push(sides[i].normal());
            }
            return axes;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Updates the transform for the collision geometry
     *
     * Collision geometry (points/bounds) will not change until this is called.
     * @param transform
     */
    PolygonCollider.prototype.update = function (transform) {
        var _a;
        this._transform = transform;
        this._transformedPointsDirty = true;
        this._sidesDirty = true;
        // This change means an update must be performed in order for geometry to update
        var globalMat = (_a = transform.matrix) !== null && _a !== void 0 ? _a : this._globalMatrix;
        globalMat.clone(this._globalMatrix);
        this._globalMatrix.translate(this.offset.x, this.offset.y);
    };
    /**
     * Tests if a point is contained in this collider in world space
     */
    PolygonCollider.prototype.contains = function (point) {
        // Always cast to the right, as long as we cast in a consistent fixed direction we
        // will be fine
        var testRay = new ray_1.Ray(point, new vector_1.Vector(1, 0));
        var intersectCount = this.getSides().reduce(function (accum, side) {
            if (testRay.intersect(side) >= 0) {
                return accum + 1;
            }
            return accum;
        }, 0);
        if (intersectCount % 2 === 0) {
            return false;
        }
        return true;
    };
    PolygonCollider.prototype.getClosestLineBetween = function (collider) {
        if (collider instanceof CircleCollider_1.CircleCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.PolygonCircleClosestLine(this, collider);
        }
        else if (collider instanceof PolygonCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.PolygonPolygonClosestLine(this, collider);
        }
        else if (collider instanceof EdgeCollider_1.EdgeCollider) {
            return ClosestLineJumpTable_1.ClosestLineJumpTable.PolygonEdgeClosestLine(this, collider);
        }
        else {
            throw new Error("Polygon could not collide with unknown CollisionShape ".concat(typeof collider));
        }
    };
    /**
     * Returns a collision contact if the 2 colliders collide, otherwise collide will
     * return null.
     * @param collider
     */
    PolygonCollider.prototype.collide = function (collider) {
        if (collider instanceof CircleCollider_1.CircleCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollideCirclePolygon(collider, this);
        }
        else if (collider instanceof PolygonCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollidePolygonPolygon(this, collider);
        }
        else if (collider instanceof EdgeCollider_1.EdgeCollider) {
            return CollisionJumpTable_1.CollisionJumpTable.CollidePolygonEdge(this, collider);
        }
        else {
            throw new Error("Polygon could not collide with unknown CollisionShape ".concat(typeof collider));
        }
    };
    /**
     * Find the point on the collider furthest in the direction specified
     */
    PolygonCollider.prototype.getFurthestPoint = function (direction) {
        var pts = this.getTransformedPoints();
        var furthestPoint = null;
        var maxDistance = -Number.MAX_VALUE;
        for (var i = 0; i < pts.length; i++) {
            var distance = direction.dot(pts[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                furthestPoint = pts[i];
            }
        }
        return furthestPoint;
    };
    /**
     * Find the local point on the collider furthest in the direction specified
     * @param direction
     */
    PolygonCollider.prototype.getFurthestLocalPoint = function (direction) {
        var pts = this.points;
        var furthestPoint = pts[0];
        var maxDistance = -Number.MAX_VALUE;
        for (var i = 0; i < pts.length; i++) {
            var distance = direction.dot(pts[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                furthestPoint = pts[i];
            }
        }
        return furthestPoint;
    };
    /**
     * Finds the closes face to the point using perpendicular distance
     * @param point point to test against polygon
     */
    PolygonCollider.prototype.getClosestFace = function (point) {
        var sides = this.getSides();
        var min = Number.POSITIVE_INFINITY;
        var faceIndex = -1;
        var distance = -1;
        for (var i = 0; i < sides.length; i++) {
            var dist = sides[i].distanceToPoint(point);
            if (dist < min) {
                min = dist;
                faceIndex = i;
                distance = dist;
            }
        }
        if (faceIndex !== -1) {
            return {
                distance: sides[faceIndex].normal().scale(distance),
                face: sides[faceIndex]
            };
        }
        return null;
    };
    Object.defineProperty(PolygonCollider.prototype, "bounds", {
        /**
         * Get the axis aligned bounding box for the polygon collider in world coordinates
         */
        get: function () {
            return this.localBounds.transform(this._globalMatrix);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonCollider.prototype, "localBounds", {
        /**
         * Get the axis aligned bounding box for the polygon collider in local coordinates
         */
        get: function () {
            if (this._localBoundsDirty) {
                this._localBounds = BoundingBox_1.BoundingBox.fromPoints(this.points);
                this._localBoundsDirty = false;
            }
            return this._localBounds;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the moment of inertia for an arbitrary polygon
     * https://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    PolygonCollider.prototype.getInertia = function (mass) {
        if (this._cachedMass === mass && this._cachedInertia) {
            return this._cachedInertia;
        }
        var numerator = 0;
        var denominator = 0;
        var points = this.points;
        for (var i = 0; i < points.length; i++) {
            var iplusone = (i + 1) % points.length;
            var crossTerm = points[iplusone].cross(points[i]);
            numerator +=
                crossTerm *
                    (points[i].dot(points[i]) + points[i].dot(points[iplusone]) + points[iplusone].dot(points[iplusone]));
            denominator += crossTerm;
        }
        this._cachedMass = mass;
        return this._cachedInertia = (mass / 6) * (numerator / denominator);
    };
    /**
     * Casts a ray into the polygon and returns a vector representing the point of contact (in world space) or null if no collision.
     */
    PolygonCollider.prototype.rayCast = function (ray, max) {
        if (max === void 0) { max = Infinity; }
        // find the minimum contact time greater than 0
        // contact times less than 0 are behind the ray and we don't want those
        var sides = this.getSides();
        var len = sides.length;
        var minContactTime = Number.MAX_VALUE;
        var contactIndex = -1;
        for (var i = 0; i < len; i++) {
            var contactTime = ray.intersect(sides[i]);
            if (contactTime >= 0 && contactTime < minContactTime && contactTime <= max) {
                minContactTime = contactTime;
                contactIndex = i;
            }
        }
        // contact was found
        if (contactIndex >= 0) {
            return ray.getPoint(minContactTime);
        }
        // no contact found
        return null;
    };
    /**
     * Project the edges of the polygon along a specified axis
     */
    PolygonCollider.prototype.project = function (axis) {
        var points = this.getTransformedPoints();
        var len = points.length;
        var min = Number.MAX_VALUE;
        var max = -Number.MAX_VALUE;
        for (var i = 0; i < len; i++) {
            var scalar = points[i].dot(axis);
            min = Math.min(min, scalar);
            max = Math.max(max, scalar);
        }
        return new projection_1.Projection(min, max);
    };
    PolygonCollider.prototype.debug = function (ex, color) {
        var firstPoint = this.getTransformedPoints()[0];
        var points = __spreadArray(__spreadArray([firstPoint], this.getTransformedPoints(), true), [firstPoint], false);
        for (var i = 0; i < points.length - 1; i++) {
            ex.drawLine(points[i], points[i + 1], color, 2);
            ex.drawCircle(points[i], 2, color);
            ex.drawCircle(points[i + 1], 2, color);
        }
    };
    return PolygonCollider;
}(Collider_1.Collider));
exports.PolygonCollider = PolygonCollider;
