"use strict";
exports.__esModule = true;
exports.LineSegment = void 0;
var vector_1 = require("./vector");
/**
 * A 2D line segment
 */
var LineSegment = /** @class */ (function () {
    /**
     * @param begin  The starting point of the line segment
     * @param end  The ending point of the line segment
     */
    function LineSegment(begin, end) {
        this.begin = begin;
        this.end = end;
    }
    Object.defineProperty(LineSegment.prototype, "slope", {
        /**
         * Gets the raw slope (m) of the line. Will return (+/-)Infinity for vertical lines.
         */
        get: function () {
            return (this.end.y - this.begin.y) / (this.end.x - this.begin.x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "intercept", {
        /**
         * Gets the Y-intercept (b) of the line. Will return (+/-)Infinity if there is no intercept.
         */
        get: function () {
            return this.begin.y - this.slope * this.begin.x;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the normal of the line
     */
    LineSegment.prototype.normal = function () {
        if (this._normal) {
            return this._normal;
        }
        return this._normal = this.end.sub(this.begin).normal();
    };
    LineSegment.prototype.dir = function () {
        if (this._dir) {
            return this._dir;
        }
        return this._dir = this.end.sub(this.begin);
    };
    LineSegment.prototype.getPoints = function () {
        return [this.begin, this.end];
    };
    /**
     * Returns the slope of the line in the form of a vector of length 1
     */
    LineSegment.prototype.getSlope = function () {
        if (this._slope) {
            return this._slope;
        }
        var begin = this.begin;
        var end = this.end;
        var distance = begin.distance(end);
        return this._slope = end.sub(begin).scale(1 / distance);
    };
    /**
     * Returns the edge of the line as vector, the length of the vector is the length of the edge
     */
    LineSegment.prototype.getEdge = function () {
        var begin = this.begin;
        var end = this.end;
        return end.sub(begin);
    };
    /**
     * Returns the length of the line segment in pixels
     */
    LineSegment.prototype.getLength = function () {
        if (this._length) {
            return this._length;
        }
        var begin = this.begin;
        var end = this.end;
        var distance = begin.distance(end);
        return this._length = distance;
    };
    Object.defineProperty(LineSegment.prototype, "midpoint", {
        /**
         * Returns the midpoint of the edge
         */
        get: function () {
            return this.begin.add(this.end).scale(0.5);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Flips the direction of the line segment
     */
    LineSegment.prototype.flip = function () {
        return new LineSegment(this.end, this.begin);
    };
    /**
     * Tests if a given point is below the line, points in the normal direction above the line are considered above.
     * @param point
     */
    LineSegment.prototype.below = function (point) {
        var above2 = (this.end.x - this.begin.x) * (point.y - this.begin.y) - (this.end.y - this.begin.y) * (point.x - this.begin.x);
        return above2 >= 0;
    };
    /**
     * Returns the clip point
     * @param sideVector Vector that traces the line
     * @param length Length to clip along side
     */
    LineSegment.prototype.clip = function (sideVector, length) {
        var dir = sideVector;
        dir = dir.normalize();
        var near = dir.dot(this.begin) - length;
        var far = dir.dot(this.end) - length;
        var results = [];
        if (near <= 0) {
            results.push(this.begin);
        }
        if (far <= 0) {
            results.push(this.end);
        }
        if (near * far < 0) {
            var clipTime = near / (near - far);
            results.push(this.begin.add(this.end.sub(this.begin).scale(clipTime)));
        }
        if (results.length !== 2) {
            return null;
        }
        return new LineSegment(results[0], results[1]);
    };
    /**
     * Find the perpendicular distance from the line to a point
     * https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     * @param point
     */
    LineSegment.prototype.distanceToPoint = function (point, signed) {
        if (signed === void 0) { signed = false; }
        var x0 = point.x;
        var y0 = point.y;
        var l = this.getLength();
        var dy = this.end.y - this.begin.y;
        var dx = this.end.x - this.begin.x;
        var distance = (dy * x0 - dx * y0 + this.end.x * this.begin.y - this.end.y * this.begin.x) / l;
        return signed ? distance : Math.abs(distance);
    };
    /**
     * Find the perpendicular line from the line to a point
     * https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     * (a - p) - ((a - p) * n)n
     * a is a point on the line
     * p is the arbitrary point above the line
     * n is a unit vector in direction of the line
     * @param point
     */
    LineSegment.prototype.findVectorToPoint = function (point) {
        var aMinusP = this.begin.sub(point);
        var n = this.getSlope();
        return aMinusP.sub(n.scale(aMinusP.dot(n)));
    };
    /**
     * Finds a point on the line given only an X or a Y value. Given an X value, the function returns
     * a new point with the calculated Y value and vice-versa.
     *
     * @param x The known X value of the target point
     * @param y The known Y value of the target point
     * @returns A new point with the other calculated axis value
     */
    LineSegment.prototype.findPoint = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        var m = this.slope;
        var b = this.intercept;
        if (x !== null) {
            return new vector_1.Vector(x, m * x + b);
        }
        else if (y !== null) {
            return new vector_1.Vector((y - b) / m, y);
        }
        else {
            throw new Error('You must provide an X or a Y value');
        }
    };
    /**
     * @see http://stackoverflow.com/a/11908158/109458
     */
    LineSegment.prototype.hasPoint = function () {
        var currPoint;
        var threshold = 0;
        if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            currPoint = new vector_1.Vector(arguments[0], arguments[1]);
            threshold = arguments[2] || 0;
        }
        else if (arguments[0] instanceof vector_1.Vector) {
            currPoint = arguments[0];
            threshold = arguments[1] || 0;
        }
        else {
            throw 'Could not determine the arguments for Vector.hasPoint';
        }
        var dxc = currPoint.x - this.begin.x;
        var dyc = currPoint.y - this.begin.y;
        var dx1 = this.end.x - this.begin.x;
        var dy1 = this.end.y - this.begin.y;
        var cross = dxc * dy1 - dyc * dx1;
        // check whether point lines on the line
        if (Math.abs(cross) > threshold) {
            return false;
        }
        // check whether point lies in-between start and end
        if (Math.abs(dx1) >= Math.abs(dy1)) {
            return dx1 > 0 ? this.begin.x <= currPoint.x && currPoint.x <= this.end.x : this.end.x <= currPoint.x && currPoint.x <= this.begin.x;
        }
        else {
            return dy1 > 0 ? this.begin.y <= currPoint.y && currPoint.y <= this.end.y : this.end.y <= currPoint.y && currPoint.y <= this.begin.y;
        }
    };
    return LineSegment;
}());
exports.LineSegment = LineSegment;
