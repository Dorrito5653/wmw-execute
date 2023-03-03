"use strict";
exports.__esModule = true;
exports.vec = exports.Vector = void 0;
var util_1 = require("./util");
/**
 * A 2D vector on a plane.
 */
var Vector = /** @class */ (function () {
    /**
     * @param x  X component of the Vector
     * @param y  Y component of the Vector
     */
    function Vector(x, y) {
        this._x = 0;
        this._y = 0;
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector, "Zero", {
        /**
         * A (0, 0) vector
         */
        get: function () {
            return new Vector(0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector, "One", {
        /**
         * A (1, 1) vector
         */
        get: function () {
            return new Vector(1, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector, "Half", {
        /**
         * A (0.5, 0.5) vector
         */
        get: function () {
            return new Vector(0.5, 0.5);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector, "Up", {
        /**
         * A unit vector pointing up (0, -1)
         */
        get: function () {
            return new Vector(0, -1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector, "Down", {
        /**
         * A unit vector pointing down (0, 1)
         */
        get: function () {
            return new Vector(0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector, "Left", {
        /**
         * A unit vector pointing left (-1, 0)
         */
        get: function () {
            return new Vector(-1, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector, "Right", {
        /**
         * A unit vector pointing right (1, 0)
         */
        get: function () {
            return new Vector(1, 0);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a vector of unit length in the direction of the specified angle in Radians.
     * @param angle The angle to generate the vector
     */
    Vector.fromAngle = function (angle) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    };
    /**
     * Checks if vector is not null, undefined, or if any of its components are NaN or Infinity.
     */
    Vector.isValid = function (vec) {
        if (vec === null || vec === undefined) {
            return false;
        }
        if (isNaN(vec.x) || isNaN(vec.y)) {
            return false;
        }
        if (vec.x === Infinity || vec.y === Infinity || vec.x === -Infinity || vec.y === -Infinity) {
            return false;
        }
        return true;
    };
    /**
     * Calculates distance between two Vectors
     * @param vec1
     * @param vec2
     */
    Vector.distance = function (vec1, vec2) {
        return Math.sqrt(Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2));
    };
    Vector.min = function (vec1, vec2) {
        return new Vector(Math.min(vec1.x, vec2.x), Math.min(vec1.y, vec2.y));
    };
    Vector.max = function (vec1, vec2) {
        return new Vector(Math.max(vec1.x, vec2.x), Math.max(vec1.y, vec2.y));
    };
    Object.defineProperty(Vector.prototype, "x", {
        /**
         * Get the x component of the vector
         */
        get: function () {
            return this._x;
        },
        /**
         * Set the x component, THIS MUTATES the current vector. It is usually better to create a new vector.
         * @warning **Be very careful setting components on shared vectors, mutating shared vectors can cause hard to find bugs**
         */
        set: function (val) {
            this._x = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        /**
         * Get the y component of the vector
         */
        get: function () {
            return this._y;
        },
        /**
         * Set the y component, THIS MUTATES the current vector. It is usually better to create a new vector.
         * @warning **Be very careful setting components on shared vectors, mutating shared vectors can cause hard to find bugs**
         */
        set: function (val) {
            this._y = val;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the x and y components at once, THIS MUTATES the current vector. It is usually better to create a new vector.
     *
     * @warning **Be very careful using this, mutating vectors can cause hard to find bugs**
     */
    Vector.prototype.setTo = function (x, y) {
        this.x = x;
        this.y = y;
    };
    /**
     * Compares this point against another and tests for equality
     * @param vector The other point to compare to
     * @param tolerance Amount of euclidean distance off we are willing to tolerate
     */
    Vector.prototype.equals = function (vector, tolerance) {
        if (tolerance === void 0) { tolerance = 0.001; }
        return Math.abs(this.x - vector.x) <= tolerance && Math.abs(this.y - vector.y) <= tolerance;
    };
    /**
     * The distance to another vector. If no other Vector is specified, this will return the [[magnitude]].
     * @param v  The other vector. Leave blank to use origin vector.
     */
    Vector.prototype.distance = function (v) {
        if (!v) {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        var deltaX = this.x - v.x;
        var deltaY = this.y - v.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };
    Vector.prototype.squareDistance = function (v) {
        if (!v) {
            v = Vector.Zero;
        }
        var deltaX = this.x - v.x;
        var deltaY = this.y - v.y;
        return deltaX * deltaX + deltaY * deltaY;
    };
    /**
     * Clamps the current vector's magnitude mutating it
     * @param magnitude
     */
    Vector.prototype.clampMagnitude = function (magnitude) {
        var size = this.size;
        var newSize = (0, util_1.clamp)(size, 0, magnitude);
        this.size = newSize;
        return this;
    };
    Object.defineProperty(Vector.prototype, "size", {
        /**
         * The size (magnitude) of the Vector
         */
        get: function () {
            return this.distance();
        },
        /**
         * Setting the size mutates the current vector
         *
         * @warning Can be used to set the size of the vector, **be very careful using this, mutating vectors can cause hard to find bugs**
         */
        set: function (newLength) {
            var v = this.normalize().scale(newLength);
            this.setTo(v.x, v.y);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Normalizes a vector to have a magnitude of 1.
     */
    Vector.prototype.normalize = function () {
        var d = this.distance();
        if (d > 0) {
            return new Vector(this.x / d, this.y / d);
        }
        else {
            return new Vector(0, 1);
        }
    };
    /**
     * Returns the average (midpoint) between the current point and the specified
     */
    Vector.prototype.average = function (vec) {
        return this.add(vec).scale(0.5);
    };
    Vector.prototype.scale = function (sizeOrScale, dest) {
        var result = dest || new Vector(0, 0);
        if (sizeOrScale instanceof Vector) {
            result.x = this.x * sizeOrScale.x;
            result.y = this.y * sizeOrScale.y;
        }
        else {
            result.x = this.x * sizeOrScale;
            result.y = this.y * sizeOrScale;
        }
        return result;
    };
    /**
     * Adds one vector to another
     * @param v The vector to add
     * @param dest Optionally copy the result into a provided vector
     */
    Vector.prototype.add = function (v, dest) {
        if (dest) {
            dest.x = this.x + v.x;
            dest.y = this.y + v.y;
            return dest;
        }
        return new Vector(this.x + v.x, this.y + v.y);
    };
    /**
     * Subtracts a vector from another, if you subtract vector `B.sub(A)` the resulting vector points from A -> B
     * @param v The vector to subtract
     */
    Vector.prototype.sub = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    /**
     * Adds one vector to this one modifying the original
     * @param v The vector to add
     * @warning Be very careful using this, mutating vectors can cause hard to find bugs
     */
    Vector.prototype.addEqual = function (v) {
        this.setTo(this.x + v.x, this.y + v.y);
        return this;
    };
    /**
     * Subtracts a vector from this one modifying the original
     * @param v The vector to subtract
     * @warning Be very careful using this, mutating vectors can cause hard to find bugs
     */
    Vector.prototype.subEqual = function (v) {
        this.setTo(this.x - v.x, this.y - v.y);
        return this;
    };
    /**
     * Scales this vector by a factor of size and modifies the original
     * @warning Be very careful using this, mutating vectors can cause hard to find bugs
     */
    Vector.prototype.scaleEqual = function (size) {
        this.setTo(this.x * size, this.y * size);
        return this;
    };
    /**
     * Performs a dot product with another vector
     * @param v  The vector to dot
     */
    Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.cross = function (v) {
        if (v instanceof Vector) {
            return this.x * v.y - this.y * v.x;
        }
        else if (typeof v === 'number') {
            return new Vector(v * this.y, -v * this.x);
        }
    };
    Vector.cross = function (num, vec) {
        return new Vector(-num * vec.y, num * vec.x);
    };
    /**
     * Returns the perpendicular vector to this one
     */
    Vector.prototype.perpendicular = function () {
        return new Vector(this.y, -this.x);
    };
    /**
     * Returns the normal vector to this one, same as the perpendicular of length 1
     */
    Vector.prototype.normal = function () {
        return this.perpendicular().normalize();
    };
    /**
     * Negate the current vector
     */
    Vector.prototype.negate = function () {
        return this.scale(-1);
    };
    /**
     * Returns the angle of this vector.
     */
    Vector.prototype.toAngle = function () {
        return Math.atan2(this.y, this.x);
    };
    /**
     * Rotates the current vector around a point by a certain number of
     * degrees in radians
     */
    Vector.prototype.rotate = function (angle, anchor) {
        if (!anchor) {
            anchor = new Vector(0, 0);
        }
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);
        var x = cosAngle * (this.x - anchor.x) - sinAngle * (this.y - anchor.y) + anchor.x;
        var y = sinAngle * (this.x - anchor.x) + cosAngle * (this.y - anchor.y) + anchor.y;
        return new Vector(x, y);
    };
    /**
     * Creates new vector that has the same values as the previous.
     */
    Vector.prototype.clone = function (dest) {
        var v = dest !== null && dest !== void 0 ? dest : new Vector(0, 0);
        v.x = this.x;
        v.y = this.y;
        return v;
    };
    /**
     * Returns a string representation of the vector.
     */
    Vector.prototype.toString = function (fixed) {
        if (fixed) {
            return "(".concat(this.x.toFixed(fixed), ", ").concat(this.y.toFixed(fixed), ")");
        }
        return "(".concat(this.x, ", ").concat(this.y, ")");
    };
    return Vector;
}());
exports.Vector = Vector;
/**
 * Shorthand for creating new Vectors - returns a new Vector instance with the
 * provided X and Y components.
 *
 * @param x  X component of the Vector
 * @param y  Y component of the Vector
 */
function vec(x, y) {
    return new Vector(x, y);
}
exports.vec = vec;
