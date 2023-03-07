"use strict";
/**
 * A 1 dimensional projection on an axis, used to test overlaps
 */
exports.__esModule = true;
exports.Projection = void 0;
var Projection = /** @class */ (function () {
    function Projection(min, max) {
        this.min = min;
        this.max = max;
    }
    Projection.prototype.overlaps = function (projection) {
        return this.max > projection.min && projection.max > this.min;
    };
    Projection.prototype.getOverlap = function (projection) {
        if (this.overlaps(projection)) {
            if (this.max > projection.max) {
                return projection.max - this.min;
            }
            else {
                return this.max - projection.min;
            }
        }
        return 0;
    };
    return Projection;
}());
exports.Projection = Projection;
