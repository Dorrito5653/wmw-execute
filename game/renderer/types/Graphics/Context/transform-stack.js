"use strict";
exports.__esModule = true;
exports.TransformStack = void 0;
var affine_matrix_1 = require("../../Math/affine-matrix");
var TransformStack = /** @class */ (function () {
    function TransformStack() {
        this._transforms = [];
        this._currentTransform = affine_matrix_1.AffineMatrix.identity();
    }
    TransformStack.prototype.save = function () {
        this._transforms.push(this._currentTransform);
        this._currentTransform = this._currentTransform.clone();
    };
    TransformStack.prototype.restore = function () {
        this._currentTransform = this._transforms.pop();
    };
    TransformStack.prototype.translate = function (x, y) {
        return this._currentTransform.translate(x, y);
    };
    TransformStack.prototype.rotate = function (angle) {
        return this._currentTransform.rotate(angle);
    };
    TransformStack.prototype.scale = function (x, y) {
        return this._currentTransform.scale(x, y);
    };
    Object.defineProperty(TransformStack.prototype, "current", {
        get: function () {
            return this._currentTransform;
        },
        set: function (matrix) {
            this._currentTransform = matrix;
        },
        enumerable: false,
        configurable: true
    });
    return TransformStack;
}());
exports.TransformStack = TransformStack;
