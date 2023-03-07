"use strict";
exports.__esModule = true;
exports.DrawCall = void 0;
var affine_matrix_1 = require("../../Math/affine-matrix");
var Color_1 = require("../../Color");
var DrawCall = /** @class */ (function () {
    function DrawCall() {
        this.z = 0;
        this.priority = 0;
        this.transform = affine_matrix_1.AffineMatrix.identity();
        this.state = {
            z: 0,
            opacity: 1,
            tint: Color_1.Color.White
        };
    }
    return DrawCall;
}());
exports.DrawCall = DrawCall;
