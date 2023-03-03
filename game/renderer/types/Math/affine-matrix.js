"use strict";
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
exports.AffineMatrix = void 0;
var matrix_1 = require("./matrix");
var util_1 = require("./util");
var vector_1 = require("./vector");
var AffineMatrix = /** @class */ (function () {
    function AffineMatrix() {
        /**
         * |         |         |          |
         * | ------- | ------- | -------- |
         * | data[0] | data[2] | data[4]  |
         * | data[1] | data[3] | data[5]  |
         * |   0     |    0    |    1     |
         */
        this.data = new Float64Array(6);
        this._scale = new Float64Array([1, 1]);
        this._scaleSignX = 1;
        this._scaleSignY = 1;
    }
    /**
     * Converts the current matrix into a DOMMatrix
     *
     * This is useful when working with the browser Canvas context
     * @returns {DOMMatrix} DOMMatrix
     */
    AffineMatrix.prototype.toDOMMatrix = function () {
        return new DOMMatrix(__spreadArray([], this.data, true));
    };
    AffineMatrix.identity = function () {
        var mat = new AffineMatrix();
        mat.data[0] = 1;
        mat.data[1] = 0;
        mat.data[2] = 0;
        mat.data[3] = 1;
        mat.data[4] = 0;
        mat.data[5] = 0;
        return mat;
    };
    /**
     * Creates a brand new translation matrix at the specified 3d point
     * @param x
     * @param y
     */
    AffineMatrix.translation = function (x, y) {
        var mat = AffineMatrix.identity();
        mat.data[4] = x;
        mat.data[5] = y;
        return mat;
    };
    /**
     * Creates a brand new scaling matrix with the specified scaling factor
     * @param sx
     * @param sy
     */
    AffineMatrix.scale = function (sx, sy) {
        var mat = AffineMatrix.identity();
        mat.data[0] = sx;
        mat.data[3] = sy;
        mat._scale[0] = sx;
        mat._scale[1] = sy;
        return mat;
    };
    /**
     * Creates a brand new rotation matrix with the specified angle
     * @param angleRadians
     */
    AffineMatrix.rotation = function (angleRadians) {
        var mat = AffineMatrix.identity();
        mat.data[0] = Math.cos(angleRadians);
        mat.data[1] = Math.sin(angleRadians);
        mat.data[2] = -Math.sin(angleRadians);
        mat.data[3] = Math.cos(angleRadians);
        return mat;
    };
    AffineMatrix.prototype.setPosition = function (x, y) {
        this.data[4] = x;
        this.data[5] = y;
    };
    AffineMatrix.prototype.getPosition = function () {
        return (0, vector_1.vec)(this.data[4], this.data[5]);
    };
    /**
     * Applies rotation to the current matrix mutating it
     * @param angle in Radians
     */
    AffineMatrix.prototype.rotate = function (angle) {
        var a11 = this.data[0];
        var a21 = this.data[1];
        var a12 = this.data[2];
        var a22 = this.data[3];
        var sine = Math.sin(angle);
        var cosine = Math.cos(angle);
        this.data[0] = cosine * a11 + sine * a12;
        this.data[1] = cosine * a21 + sine * a22;
        this.data[2] = cosine * a12 - sine * a11;
        this.data[3] = cosine * a22 - sine * a21;
        return this;
    };
    /**
     * Applies translation to the current matrix mutating it
     * @param x
     * @param y
     */
    AffineMatrix.prototype.translate = function (x, y) {
        var a11 = this.data[0];
        var a21 = this.data[1];
        // const a31 = 0;
        var a12 = this.data[2];
        var a22 = this.data[3];
        // const a32 = 0;
        var a13 = this.data[4];
        var a23 = this.data[5];
        // const a33 = 1;
        // Doesn't change z
        this.data[4] = a11 * x + a12 * y + a13;
        this.data[5] = a21 * x + a22 * y + a23;
        return this;
    };
    /**
     * Applies scaling to the current matrix mutating it
     * @param x
     * @param y
     */
    AffineMatrix.prototype.scale = function (x, y) {
        var a11 = this.data[0];
        var a21 = this.data[1];
        var a12 = this.data[2];
        var a22 = this.data[3];
        this.data[0] = a11 * x;
        this.data[1] = a21 * x;
        this.data[2] = a12 * y;
        this.data[3] = a22 * y;
        this._scale[0] = x;
        this._scale[1] = y;
        return this;
    };
    AffineMatrix.prototype.determinant = function () {
        return this.data[0] * this.data[3] - this.data[1] * this.data[2];
    };
    /**
     * Return the affine inverse, optionally store it in a target matrix.
     *
     * It's recommended you call .reset() the target unless you know what you're doing
     * @param target
     */
    AffineMatrix.prototype.inverse = function (target) {
        // See http://negativeprobability.blogspot.com/2011/11/affine-transformations-and-their.html
        // See https://www.mathsisfun.com/algebra/matrix-inverse.html
        // Since we are actually only doing 2D transformations we can use this hack
        // We don't actually use the 3rd or 4th dimension
        var det = this.determinant();
        var inverseDet = 1 / det; // TODO zero check
        var a = this.data[0];
        var b = this.data[2];
        var c = this.data[1];
        var d = this.data[3];
        var m = target || AffineMatrix.identity();
        // inverts rotation and scale
        m.data[0] = d * inverseDet;
        m.data[1] = -c * inverseDet;
        m.data[2] = -b * inverseDet;
        m.data[3] = a * inverseDet;
        var tx = this.data[4];
        var ty = this.data[5];
        // invert translation
        // transform translation into the matrix basis created by rot/scale
        m.data[4] = -(tx * m.data[0] + ty * m.data[2]);
        m.data[5] = -(tx * m.data[1] + ty * m.data[3]);
        return m;
    };
    AffineMatrix.prototype.multiply = function (vectorOrMatrix, dest) {
        if (vectorOrMatrix instanceof vector_1.Vector) {
            var result = dest || new vector_1.Vector(0, 0);
            var vector = vectorOrMatrix;
            // these shenanigans are to allow dest and vector to be the same instance
            var resultX = vector.x * this.data[0] + vector.y * this.data[2] + this.data[4];
            var resultY = vector.x * this.data[1] + vector.y * this.data[3] + this.data[5];
            result.x = resultX;
            result.y = resultY;
            return result;
        }
        else {
            var result = dest || new AffineMatrix();
            var other = vectorOrMatrix;
            var a11 = this.data[0];
            var a21 = this.data[1];
            //  const a31 = 0;
            var a12 = this.data[2];
            var a22 = this.data[3];
            //  const a32 = 0;
            var a13 = this.data[4];
            var a23 = this.data[5];
            //  const a33 = 1;
            var b11 = other.data[0];
            var b21 = other.data[1];
            //  const b31 = 0;
            var b12 = other.data[2];
            var b22 = other.data[3];
            //  const b32 = 0;
            var b13 = other.data[4];
            var b23 = other.data[5];
            //  const b33 = 1;
            result.data[0] = a11 * b11 + a12 * b21; // + a13 * b31; // zero
            result.data[1] = a21 * b11 + a22 * b21; // + a23 * b31; // zero
            result.data[2] = a11 * b12 + a12 * b22; // + a13 * b32; // zero
            result.data[3] = a21 * b12 + a22 * b22; // + a23 * b32; // zero
            result.data[4] = a11 * b13 + a12 * b23 + a13; // * b33; // one
            result.data[5] = a21 * b13 + a22 * b23 + a23; // * b33; // one
            var s = this.getScale();
            result._scaleSignX = (0, util_1.sign)(s.x) * (0, util_1.sign)(result._scaleSignX);
            result._scaleSignY = (0, util_1.sign)(s.y) * (0, util_1.sign)(result._scaleSignY);
            return result;
        }
    };
    AffineMatrix.prototype.to4x4 = function () {
        var mat = new matrix_1.Matrix();
        mat.data[0] = this.data[0];
        mat.data[1] = this.data[1];
        mat.data[2] = 0;
        mat.data[3] = 0;
        mat.data[4] = this.data[2];
        mat.data[5] = this.data[3];
        mat.data[6] = 0;
        mat.data[7] = 0;
        mat.data[8] = 0;
        mat.data[9] = 0;
        mat.data[10] = 1;
        mat.data[11] = 0;
        mat.data[12] = this.data[4];
        mat.data[13] = this.data[5];
        mat.data[14] = 0;
        mat.data[15] = 1;
        return mat;
    };
    AffineMatrix.prototype.setRotation = function (angle) {
        var currentScale = this.getScale();
        var sine = Math.sin(angle);
        var cosine = Math.cos(angle);
        this.data[0] = cosine * currentScale.x;
        this.data[1] = sine * currentScale.y;
        this.data[2] = -sine * currentScale.x;
        this.data[3] = cosine * currentScale.y;
    };
    AffineMatrix.prototype.getRotation = function () {
        var angle = Math.atan2(this.data[1] / this.getScaleY(), this.data[0] / this.getScaleX());
        return (0, util_1.canonicalizeAngle)(angle);
    };
    AffineMatrix.prototype.getScaleX = function () {
        // absolute scale of the matrix (we lose sign so need to add it back)
        var xscale = (0, vector_1.vec)(this.data[0], this.data[2]).distance();
        return this._scaleSignX * xscale;
    };
    AffineMatrix.prototype.getScaleY = function () {
        // absolute scale of the matrix (we lose sign so need to add it back)
        var yscale = (0, vector_1.vec)(this.data[1], this.data[3]).distance();
        return this._scaleSignY * yscale;
    };
    /**
     * Get the scale of the matrix
     */
    AffineMatrix.prototype.getScale = function () {
        return (0, vector_1.vec)(this.getScaleX(), this.getScaleY());
    };
    AffineMatrix.prototype.setScaleX = function (val) {
        if (val === this._scale[0]) {
            return;
        }
        this._scaleSignX = (0, util_1.sign)(val);
        // negative scale acts like a 180 rotation, so flip
        var xscale = (0, vector_1.vec)(this.data[0] * this._scaleSignX, this.data[2] * this._scaleSignX).normalize();
        this.data[0] = xscale.x * val;
        this.data[2] = xscale.y * val;
        this._scale[0] = val;
    };
    AffineMatrix.prototype.setScaleY = function (val) {
        if (val === this._scale[1]) {
            return;
        }
        this._scaleSignY = (0, util_1.sign)(val);
        // negative scale acts like a 180 rotation, so flip
        var yscale = (0, vector_1.vec)(this.data[1] * this._scaleSignY, this.data[3] * this._scaleSignY).normalize();
        this.data[1] = yscale.x * val;
        this.data[3] = yscale.y * val;
        this._scale[1] = val;
    };
    AffineMatrix.prototype.setScale = function (scale) {
        this.setScaleX(scale.x);
        this.setScaleY(scale.y);
    };
    AffineMatrix.prototype.isIdentity = function () {
        return (this.data[0] === 1 &&
            this.data[1] === 0 &&
            this.data[2] === 0 &&
            this.data[3] === 1 &&
            this.data[4] === 0 &&
            this.data[5] === 0);
    };
    /**
     * Resets the current matrix to the identity matrix, mutating it
     * @returns {AffineMatrix} Current matrix as identity
     */
    AffineMatrix.prototype.reset = function () {
        var mat = this;
        mat.data[0] = 1;
        mat.data[1] = 0;
        mat.data[2] = 0;
        mat.data[3] = 1;
        mat.data[4] = 0;
        mat.data[5] = 0;
        return mat;
    };
    /**
     * Creates a new Matrix with the same data as the current 4x4
     */
    AffineMatrix.prototype.clone = function (dest) {
        var mat = dest || new AffineMatrix();
        mat.data[0] = this.data[0];
        mat.data[1] = this.data[1];
        mat.data[2] = this.data[2];
        mat.data[3] = this.data[3];
        mat.data[4] = this.data[4];
        mat.data[5] = this.data[5];
        return mat;
    };
    AffineMatrix.prototype.toString = function () {
        return "\n[".concat(this.data[0], " ").concat(this.data[2], " ").concat(this.data[4], "]\n[").concat(this.data[1], " ").concat(this.data[3], " ").concat(this.data[5], "]\n[0 0 1]\n");
    };
    return AffineMatrix;
}());
exports.AffineMatrix = AffineMatrix;
