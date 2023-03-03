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
exports.Matrix = exports.MatrixLocations = void 0;
var util_1 = require("./util");
var vector_1 = require("./vector");
var util_2 = require("./util");
var MatrixLocations;
(function (MatrixLocations) {
    MatrixLocations[MatrixLocations["X"] = 12] = "X";
    MatrixLocations[MatrixLocations["Y"] = 13] = "Y";
})(MatrixLocations = exports.MatrixLocations || (exports.MatrixLocations = {}));
/**
 * Excalibur Matrix helper for 4x4 matrices
 *
 * Useful for webgl 4x4 matrices
 */
var Matrix = /** @class */ (function () {
    function Matrix() {
        /**
         *  4x4 matrix in column major order
         *
         * |         |         |          |          |
         * | ------- | ------- | -------- | -------- |
         * | data[0] | data[4] | data[8]  | data[12] |
         * | data[1] | data[5] | data[9]  | data[13] |
         * | data[2] | data[6] | data[10] | data[14] |
         * | data[3] | data[7] | data[11] | data[15] |
         *
         */
        this.data = new Float32Array(16);
        this._scaleX = 1;
        this._scaleSignX = 1;
        this._scaleY = 1;
        this._scaleSignY = 1;
    }
    /**
     * Creates an orthographic (flat non-perspective) projection
     * https://en.wikipedia.org/wiki/Orthographic_projection
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
    Matrix.ortho = function (left, right, bottom, top, near, far) {
        var mat = new Matrix();
        mat.data[0] = 2 / (right - left);
        mat.data[1] = 0;
        mat.data[2] = 0;
        mat.data[3] = 0;
        mat.data[4] = 0;
        mat.data[5] = 2 / (top - bottom);
        mat.data[6] = 0;
        mat.data[7] = 0;
        mat.data[8] = 0;
        mat.data[9] = 0;
        mat.data[10] = -2 / (far - near);
        mat.data[11] = 0;
        mat.data[12] = -(right + left) / (right - left);
        mat.data[13] = -(top + bottom) / (top - bottom);
        mat.data[14] = -(far + near) / (far - near);
        mat.data[15] = 1;
        return mat;
    };
    /**
     * Creates a new Matrix with the same data as the current 4x4
     */
    Matrix.prototype.clone = function (dest) {
        var mat = dest || new Matrix();
        mat.data[0] = this.data[0];
        mat.data[1] = this.data[1];
        mat.data[2] = this.data[2];
        mat.data[3] = this.data[3];
        mat.data[4] = this.data[4];
        mat.data[5] = this.data[5];
        mat.data[6] = this.data[6];
        mat.data[7] = this.data[7];
        mat.data[8] = this.data[8];
        mat.data[9] = this.data[9];
        mat.data[10] = this.data[10];
        mat.data[11] = this.data[11];
        mat.data[12] = this.data[12];
        mat.data[13] = this.data[13];
        mat.data[14] = this.data[14];
        mat.data[15] = this.data[15];
        return mat;
    };
    /**
     * Converts the current matrix into a DOMMatrix
     *
     * This is useful when working with the browser Canvas context
     * @returns {DOMMatrix} DOMMatrix
     */
    Matrix.prototype.toDOMMatrix = function () {
        return new DOMMatrix(__spreadArray([], this.data, true));
    };
    Matrix.fromFloat32Array = function (data) {
        var matrix = new Matrix();
        matrix.data = data;
        return matrix;
    };
    /**
     * Creates a new identity matrix (a matrix that when applied does nothing)
     */
    Matrix.identity = function () {
        var mat = new Matrix();
        mat.data[0] = 1;
        mat.data[1] = 0;
        mat.data[2] = 0;
        mat.data[3] = 0;
        mat.data[4] = 0;
        mat.data[5] = 1;
        mat.data[6] = 0;
        mat.data[7] = 0;
        mat.data[8] = 0;
        mat.data[9] = 0;
        mat.data[10] = 1;
        mat.data[11] = 0;
        mat.data[12] = 0;
        mat.data[13] = 0;
        mat.data[14] = 0;
        mat.data[15] = 1;
        return mat;
    };
    /**
     * Resets the current matrix to the identity matrix, mutating it
     * @returns {Matrix} Current matrix as identity
     */
    Matrix.prototype.reset = function () {
        var mat = this;
        mat.data[0] = 1;
        mat.data[1] = 0;
        mat.data[2] = 0;
        mat.data[3] = 0;
        mat.data[4] = 0;
        mat.data[5] = 1;
        mat.data[6] = 0;
        mat.data[7] = 0;
        mat.data[8] = 0;
        mat.data[9] = 0;
        mat.data[10] = 1;
        mat.data[11] = 0;
        mat.data[12] = 0;
        mat.data[13] = 0;
        mat.data[14] = 0;
        mat.data[15] = 1;
        return mat;
    };
    /**
     * Creates a brand new translation matrix at the specified 3d point
     * @param x
     * @param y
     */
    Matrix.translation = function (x, y) {
        var mat = Matrix.identity();
        mat.data[12] = x;
        mat.data[13] = y;
        return mat;
    };
    /**
     * Creates a brand new scaling matrix with the specified scaling factor
     * @param sx
     * @param sy
     */
    Matrix.scale = function (sx, sy) {
        var mat = Matrix.identity();
        mat.data[0] = sx;
        mat.data[5] = sy;
        mat.data[10] = 1;
        mat.data[15] = 1;
        return mat;
    };
    /**
     * Creates a brand new rotation matrix with the specified angle
     * @param angleRadians
     */
    Matrix.rotation = function (angleRadians) {
        var mat = Matrix.identity();
        mat.data[0] = Math.cos(angleRadians);
        mat.data[4] = -Math.sin(angleRadians);
        mat.data[1] = Math.sin(angleRadians);
        mat.data[5] = Math.cos(angleRadians);
        return mat;
    };
    Matrix.prototype.multiply = function (vectorOrMatrix, dest) {
        if (vectorOrMatrix instanceof vector_1.Vector) {
            var result = dest || new vector_1.Vector(0, 0);
            var vector = vectorOrMatrix;
            // these shenanigans are to allow dest and vector to be the same instance
            var resultX = vector.x * this.data[0] + vector.y * this.data[4] + this.data[12];
            var resultY = vector.x * this.data[1] + vector.y * this.data[5] + this.data[13];
            result.x = resultX;
            result.y = resultY;
            return result;
        }
        else {
            var result = dest || new Matrix();
            var other = vectorOrMatrix;
            var a11 = this.data[0];
            var a21 = this.data[1];
            var a31 = this.data[2];
            var a41 = this.data[3];
            var a12 = this.data[4];
            var a22 = this.data[5];
            var a32 = this.data[6];
            var a42 = this.data[7];
            var a13 = this.data[8];
            var a23 = this.data[9];
            var a33 = this.data[10];
            var a43 = this.data[11];
            var a14 = this.data[12];
            var a24 = this.data[13];
            var a34 = this.data[14];
            var a44 = this.data[15];
            var b11 = other.data[0];
            var b21 = other.data[1];
            var b31 = other.data[2];
            var b41 = other.data[3];
            var b12 = other.data[4];
            var b22 = other.data[5];
            var b32 = other.data[6];
            var b42 = other.data[7];
            var b13 = other.data[8];
            var b23 = other.data[9];
            var b33 = other.data[10];
            var b43 = other.data[11];
            var b14 = other.data[12];
            var b24 = other.data[13];
            var b34 = other.data[14];
            var b44 = other.data[15];
            result.data[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            result.data[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            result.data[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            result.data[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            result.data[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            result.data[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            result.data[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            result.data[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            result.data[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            result.data[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            result.data[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            result.data[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            result.data[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            result.data[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            result.data[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            result.data[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            var s = this.getScale();
            result._scaleSignX = (0, util_1.sign)(s.x) * (0, util_1.sign)(result._scaleSignX);
            result._scaleSignY = (0, util_1.sign)(s.y) * (0, util_1.sign)(result._scaleSignY);
            return result;
        }
    };
    /**
     * Applies translation to the current matrix mutating it
     * @param x
     * @param y
     */
    Matrix.prototype.translate = function (x, y) {
        var a11 = this.data[0];
        var a21 = this.data[1];
        var a31 = this.data[2];
        var a41 = this.data[3];
        var a12 = this.data[4];
        var a22 = this.data[5];
        var a32 = this.data[6];
        var a42 = this.data[7];
        var a13 = this.data[8];
        var a23 = this.data[9];
        var a33 = this.data[10];
        var a43 = this.data[11];
        var a14 = this.data[12];
        var a24 = this.data[13];
        var a34 = this.data[14];
        var a44 = this.data[15];
        // Doesn't change z
        var z = 0;
        var w = 1;
        this.data[12] = a11 * x + a12 * y + a13 * z + a14 * w;
        this.data[13] = a21 * x + a22 * y + a23 * z + a24 * w;
        this.data[14] = a31 * x + a32 * y + a33 * z + a34 * w;
        this.data[15] = a41 * x + a42 * y + a43 * z + a44 * w;
        return this;
    };
    Matrix.prototype.setPosition = function (x, y) {
        this.data[12] = x;
        this.data[13] = y;
    };
    Matrix.prototype.getPosition = function () {
        return (0, vector_1.vec)(this.data[12], this.data[13]);
    };
    /**
     * Applies rotation to the current matrix mutating it
     * @param angle in Radians
     */
    Matrix.prototype.rotate = function (angle) {
        var a11 = this.data[0];
        var a21 = this.data[1];
        var a31 = this.data[2];
        var a41 = this.data[3];
        var a12 = this.data[4];
        var a22 = this.data[5];
        var a32 = this.data[6];
        var a42 = this.data[7];
        var sine = Math.sin(angle);
        var cosine = Math.cos(angle);
        this.data[0] = cosine * a11 + sine * a12;
        this.data[1] = cosine * a21 + sine * a22;
        this.data[2] = cosine * a31 + sine * a32;
        this.data[3] = cosine * a41 + sine * a42;
        this.data[4] = cosine * a12 - sine * a11;
        this.data[5] = cosine * a22 - sine * a21;
        this.data[6] = cosine * a32 - sine * a31;
        this.data[7] = cosine * a42 - sine * a41;
        return this;
    };
    /**
     * Applies scaling to the current matrix mutating it
     * @param x
     * @param y
     */
    Matrix.prototype.scale = function (x, y) {
        var a11 = this.data[0];
        var a21 = this.data[1];
        var a31 = this.data[2];
        var a41 = this.data[3];
        var a12 = this.data[4];
        var a22 = this.data[5];
        var a32 = this.data[6];
        var a42 = this.data[7];
        this.data[0] = a11 * x;
        this.data[1] = a21 * x;
        this.data[2] = a31 * x;
        this.data[3] = a41 * x;
        this.data[4] = a12 * y;
        this.data[5] = a22 * y;
        this.data[6] = a32 * y;
        this.data[7] = a42 * y;
        return this;
    };
    Matrix.prototype.setRotation = function (angle) {
        var currentScale = this.getScale();
        var sine = Math.sin(angle);
        var cosine = Math.cos(angle);
        this.data[0] = cosine * currentScale.x;
        this.data[1] = sine * currentScale.y;
        this.data[4] = -sine * currentScale.x;
        this.data[5] = cosine * currentScale.y;
    };
    Matrix.prototype.getRotation = function () {
        var angle = Math.atan2(this.data[1] / this.getScaleY(), this.data[0] / this.getScaleX());
        return (0, util_2.canonicalizeAngle)(angle);
    };
    Matrix.prototype.getScaleX = function () {
        // absolute scale of the matrix (we lose sign so need to add it back)
        var xscale = (0, vector_1.vec)(this.data[0], this.data[4]).size;
        return this._scaleSignX * xscale;
    };
    Matrix.prototype.getScaleY = function () {
        // absolute scale of the matrix (we lose sign so need to add it back)
        var yscale = (0, vector_1.vec)(this.data[1], this.data[5]).size;
        return this._scaleSignY * yscale;
    };
    /**
     * Get the scale of the matrix
     */
    Matrix.prototype.getScale = function () {
        return (0, vector_1.vec)(this.getScaleX(), this.getScaleY());
    };
    Matrix.prototype.setScaleX = function (val) {
        if (this._scaleX === val) {
            return;
        }
        this._scaleSignX = (0, util_1.sign)(val);
        // negative scale acts like a 180 rotation, so flip
        var xscale = (0, vector_1.vec)(this.data[0] * this._scaleSignX, this.data[4] * this._scaleSignX).normalize();
        this.data[0] = xscale.x * val;
        this.data[4] = xscale.y * val;
        this._scaleX = val;
    };
    Matrix.prototype.setScaleY = function (val) {
        if (this._scaleY === val) {
            return;
        }
        this._scaleSignY = (0, util_1.sign)(val);
        // negative scale acts like a 180 rotation, so flip
        var yscale = (0, vector_1.vec)(this.data[1] * this._scaleSignY, this.data[5] * this._scaleSignY).normalize();
        this.data[1] = yscale.x * val;
        this.data[5] = yscale.y * val;
        this._scaleY = val;
    };
    Matrix.prototype.setScale = function (scale) {
        this.setScaleX(scale.x);
        this.setScaleY(scale.y);
    };
    /**
     * Determinant of the upper left 2x2 matrix
     */
    Matrix.prototype.getBasisDeterminant = function () {
        return this.data[0] * this.data[5] - this.data[1] * this.data[4];
    };
    /**
     * Return the affine inverse, optionally store it in a target matrix.
     *
     * It's recommended you call .reset() the target unless you know what you're doing
     * @param target
     */
    Matrix.prototype.getAffineInverse = function (target) {
        // See http://negativeprobability.blogspot.com/2011/11/affine-transformations-and-their.html
        // See https://www.mathsisfun.com/algebra/matrix-inverse.html
        // Since we are actually only doing 2D transformations we can use this hack
        // We don't actually use the 3rd or 4th dimension
        var det = this.getBasisDeterminant();
        var inverseDet = 1 / det; // todo zero check
        var a = this.data[0];
        var b = this.data[4];
        var c = this.data[1];
        var d = this.data[5];
        var m = target || Matrix.identity();
        // inverts rotation and scale
        m.data[0] = d * inverseDet;
        m.data[1] = -c * inverseDet;
        m.data[4] = -b * inverseDet;
        m.data[5] = a * inverseDet;
        var tx = this.data[12];
        var ty = this.data[13];
        // invert translation
        // transform translation into the matrix basis created by rot/scale
        m.data[12] = -(tx * m.data[0] + ty * m.data[4]);
        m.data[13] = -(tx * m.data[1] + ty * m.data[5]);
        return m;
    };
    Matrix.prototype.isIdentity = function () {
        return (this.data[0] === 1 &&
            this.data[1] === 0 &&
            this.data[2] === 0 &&
            this.data[3] === 0 &&
            this.data[4] === 0 &&
            this.data[5] === 1 &&
            this.data[6] === 0 &&
            this.data[7] === 0 &&
            this.data[8] === 0 &&
            this.data[9] === 0 &&
            this.data[10] === 1 &&
            this.data[11] === 0 &&
            this.data[12] === 0 &&
            this.data[13] === 0 &&
            this.data[14] === 0 &&
            this.data[15] === 1);
    };
    Matrix.prototype.toString = function () {
        return "\n[".concat(this.data[0], " ").concat(this.data[4], " ").concat(this.data[8], " ").concat(this.data[12], "]\n[").concat(this.data[1], " ").concat(this.data[5], " ").concat(this.data[9], " ").concat(this.data[13], "]\n[").concat(this.data[2], " ").concat(this.data[6], " ").concat(this.data[10], " ").concat(this.data[14], "]\n[").concat(this.data[3], " ").concat(this.data[7], " ").concat(this.data[11], " ").concat(this.data[15], "]\n");
    };
    return Matrix;
}());
exports.Matrix = Matrix;
