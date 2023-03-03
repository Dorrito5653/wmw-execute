"use strict";
exports.__esModule = true;
exports.SeparatingAxis = void 0;
var SeparatingAxis = /** @class */ (function () {
    function SeparatingAxis() {
    }
    SeparatingAxis.findPolygonPolygonSeparation = function (polyA, polyB) {
        var bestSeparation = -Number.MAX_VALUE;
        var bestSide = null;
        var bestAxis = null;
        var bestSideIndex = -1;
        var bestOtherPoint = null;
        var sides = polyA.getSides();
        var localSides = polyA.getLocalSides();
        for (var i = 0; i < sides.length; i++) {
            var side = sides[i];
            var axis = side.normal();
            var vertB = polyB.getFurthestPoint(axis.negate());
            // Separation on side i's axis
            // We are looking for the largest separation between poly A's sides
            var vertSeparation = side.distanceToPoint(vertB, true);
            if (vertSeparation > bestSeparation) {
                bestSeparation = vertSeparation;
                bestSide = side;
                bestAxis = axis;
                bestSideIndex = i;
                bestOtherPoint = vertB;
            }
        }
        return {
            collider: polyA,
            separation: bestAxis ? bestSeparation : 99,
            axis: bestAxis,
            side: bestSide,
            localSide: localSides[bestSideIndex],
            sideId: bestSideIndex,
            point: bestOtherPoint,
            localPoint: bestAxis ? polyB.getFurthestLocalPoint(bestAxis.negate()) : null
        };
    };
    SeparatingAxis.findCirclePolygonSeparation = function (circle, polygon) {
        var axes = polygon.axes;
        var pc = polygon.center;
        // Special SAT with circles
        var polyDir = pc.sub(circle.worldPos);
        var closestPointOnPoly = polygon.getFurthestPoint(polyDir.negate());
        axes.push(closestPointOnPoly.sub(circle.worldPos).normalize());
        var minOverlap = Number.MAX_VALUE;
        var minAxis = null;
        var minIndex = -1;
        for (var i = 0; i < axes.length; i++) {
            var proj1 = polygon.project(axes[i]);
            var proj2 = circle.project(axes[i]);
            var overlap = proj1.getOverlap(proj2);
            if (overlap <= 0) {
                return null;
            }
            else {
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    minAxis = axes[i];
                    minIndex = i;
                }
            }
        }
        if (minIndex < 0) {
            return null;
        }
        return minAxis.normalize().scale(minOverlap);
    };
    return SeparatingAxis;
}());
exports.SeparatingAxis = SeparatingAxis;
