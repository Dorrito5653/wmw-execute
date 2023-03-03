"use strict";
exports.__esModule = true;
exports.ClosestLineJumpTable = exports.ClosestLine = void 0;
var line_segment_1 = require("../../Math/line-segment");
var vector_1 = require("../../Math/vector");
var ray_1 = require("../../Math/ray");
/**
 * Finds the closes line between 2 line segments, were the magnitude of u, v are the lengths of each segment
 * L1 = P(s) = p0 + s * u, where s is time and p0 is the start of the line
 * L2 = Q(t) = q0 + t * v, where t is time and q0 is the start of the line
 * @param p0 Point where L1 begins
 * @param u Direction and length of L1
 * @param q0 Point were L2 begins
 * @param v Direction and length of L2
 */
function ClosestLine(p0, u, q0, v) {
    // Distance between 2 lines http://geomalgorithms.com/a07-_distance.html
    // w(s, t) = P(s) - Q(t)
    // The w(s, t) that has the minimum distance we will say is w(sClosest, tClosest) = wClosest
    //
    // wClosest is the vector that is uniquely perpendicular to the 2 line directions u & v.
    // wClosest = w0 + sClosest * u - tClosest * v, where w0 is p0 - q0
    //
    // The closest point between 2 lines then satisfies this pair of equations
    // 1: u * wClosest = 0
    // 2: v * wClosest = 0
    //
    // Substituting wClosest into the equations we get
    //
    // 1: (u * u) * sClosest - (u * v) tClosest = -u * w0
    // 2: (v * u) * sClosest - (v * v) tClosest = -v * w0
    // simplify w0
    var w0 = p0.sub(q0);
    // simplify (u * u);
    var a = u.dot(u);
    // simplify (u * v);
    var b = u.dot(v);
    // simplify (v * v)
    var c = v.dot(v);
    // simplify (u * w0)
    var d = u.dot(w0);
    // simplify (v * w0)
    var e = v.dot(w0);
    // denominator ac - b^2
    var denom = a * c - b * b;
    var sDenom = denom;
    var tDenom = denom;
    // if denom is 0 they are parallel, use any point from either as the start in this case p0
    if (denom === 0 || denom <= 0.01) {
        var tClosestParallel = d / b;
        return new line_segment_1.LineSegment(p0, q0.add(v.scale(tClosestParallel)));
    }
    // Solve for sClosest for infinite line
    var sClosest = b * e - c * d; // / denom;
    // Solve for tClosest for infinite line
    var tClosest = a * e - b * d; // / denom;
    // Solve for segments candidate edges, if sClosest and tClosest are outside their segments
    if (sClosest < 0) {
        sClosest = 0;
        tClosest = e;
        tDenom = c;
    }
    else if (sClosest > sDenom) {
        sClosest = sDenom;
        tClosest = e + b;
        tDenom = c;
    }
    if (tClosest < 0) {
        tClosest = 0;
        if (-d < 0) {
            sClosest = 0;
        }
        else if (-d > a) {
            sClosest = sDenom;
        }
        else {
            sClosest = -d;
            sDenom = a;
        }
    }
    else if (tClosest > tDenom) {
        tClosest = tDenom;
        if (-d + b < 0) {
            sClosest = 0;
        }
        else if (-d + b > a) {
            sClosest = sDenom;
        }
        else {
            sClosest = -d + b;
            sDenom = a;
        }
    }
    sClosest = Math.abs(sClosest) < 0.001 ? 0 : sClosest / sDenom;
    tClosest = Math.abs(tClosest) < 0.001 ? 0 : tClosest / tDenom;
    return new line_segment_1.LineSegment(p0.add(u.scale(sClosest)), q0.add(v.scale(tClosest)));
}
exports.ClosestLine = ClosestLine;
exports.ClosestLineJumpTable = {
    PolygonPolygonClosestLine: function (polygonA, polygonB) {
        // Find the 2 closest faces on each polygon
        var otherWorldPos = polygonB.worldPos;
        var otherDirection = otherWorldPos.sub(polygonA.worldPos);
        var thisDirection = otherDirection.negate();
        var rayTowardsOther = new ray_1.Ray(polygonA.worldPos, otherDirection);
        var rayTowardsThis = new ray_1.Ray(otherWorldPos, thisDirection);
        var thisPoint = polygonA.rayCast(rayTowardsOther).add(rayTowardsOther.dir.scale(0.1));
        var otherPoint = polygonB.rayCast(rayTowardsThis).add(rayTowardsThis.dir.scale(0.1));
        var thisFace = polygonA.getClosestFace(thisPoint);
        var otherFace = polygonB.getClosestFace(otherPoint);
        // L1 = P(s) = p0 + s * u, where s is time and p0 is the start of the line
        var p0 = thisFace.face.begin;
        var u = thisFace.face.getEdge();
        // L2 = Q(t) = q0 + t * v, where t is time and q0 is the start of the line
        var q0 = otherFace.face.begin;
        var v = otherFace.face.getEdge();
        return ClosestLine(p0, u, q0, v);
    },
    PolygonEdgeClosestLine: function (polygon, edge) {
        // Find the 2 closest faces on each polygon
        var otherWorldPos = edge.worldPos;
        var otherDirection = otherWorldPos.sub(polygon.worldPos);
        var rayTowardsOther = new ray_1.Ray(polygon.worldPos, otherDirection);
        var thisPoint = polygon.rayCast(rayTowardsOther).add(rayTowardsOther.dir.scale(0.1));
        var thisFace = polygon.getClosestFace(thisPoint);
        // L1 = P(s) = p0 + s * u, where s is time and p0 is the start of the line
        var p0 = thisFace.face.begin;
        var u = thisFace.face.getEdge();
        // L2 = Q(t) = q0 + t * v, where t is time and q0 is the start of the line
        var edgeLine = edge.asLine();
        var edgeStart = edgeLine.begin;
        var edgeVector = edgeLine.getEdge();
        var q0 = edgeStart;
        var v = edgeVector;
        return ClosestLine(p0, u, q0, v);
    },
    PolygonCircleClosestLine: function (polygon, circle) {
        // https://math.stackexchange.com/questions/1919177/how-to-find-point-on-line-closest-to-sphere
        // Find the 2 closest faces on each polygon
        var otherWorldPos = circle.worldPos;
        var otherDirection = otherWorldPos.sub(polygon.worldPos);
        var rayTowardsOther = new ray_1.Ray(polygon.worldPos, otherDirection.normalize());
        var thisPoint = polygon.rayCast(rayTowardsOther).add(rayTowardsOther.dir.scale(0.1));
        var thisFace = polygon.getClosestFace(thisPoint);
        // L1 = P(s) = p0 + s * u, where s is time and p0 is the start of the line
        var p0 = thisFace.face.begin;
        var u = thisFace.face.getEdge();
        // Time of minimum distance
        var t = (u.x * (otherWorldPos.x - p0.x) + u.y * (otherWorldPos.y - p0.y)) / (u.x * u.x + u.y * u.y);
        // If time of minimum is past the edge clamp
        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0;
        }
        // Minimum distance
        var d = Math.sqrt(Math.pow(p0.x + u.x * t - otherWorldPos.x, 2) + Math.pow(p0.y + u.y * t - otherWorldPos.y, 2)) - circle.radius;
        var circlex = ((p0.x + u.x * t - otherWorldPos.x) * circle.radius) / (circle.radius + d);
        var circley = ((p0.y + u.y * t - otherWorldPos.y) * circle.radius) / (circle.radius + d);
        return new line_segment_1.LineSegment(u.scale(t).add(p0), new vector_1.Vector(otherWorldPos.x + circlex, otherWorldPos.y + circley));
    },
    CircleCircleClosestLine: function (circleA, circleB) {
        // Find the 2 closest faces on each polygon
        var otherWorldPos = circleB.worldPos;
        var otherDirection = otherWorldPos.sub(circleA.worldPos);
        var thisWorldPos = circleA.worldPos;
        var thisDirection = thisWorldPos.sub(circleB.worldPos);
        var rayTowardsOther = new ray_1.Ray(circleA.worldPos, otherDirection);
        var rayTowardsThis = new ray_1.Ray(circleB.worldPos, thisDirection);
        var thisPoint = circleA.rayCast(rayTowardsOther);
        var otherPoint = circleB.rayCast(rayTowardsThis);
        return new line_segment_1.LineSegment(thisPoint, otherPoint);
    },
    CircleEdgeClosestLine: function (circle, edge) {
        // https://math.stackexchange.com/questions/1919177/how-to-find-point-on-line-closest-to-sphere
        var circleWorlPos = circle.worldPos;
        // L1 = P(s) = p0 + s * u, where s is time and p0 is the start of the line
        var edgeLine = edge.asLine();
        var edgeStart = edgeLine.begin;
        var edgeVector = edgeLine.getEdge();
        var p0 = edgeStart;
        var u = edgeVector;
        // Time of minimum distance
        var t = (u.x * (circleWorlPos.x - p0.x) + u.y * (circleWorlPos.y - p0.y)) / (u.x * u.x + u.y * u.y);
        // If time of minimum is past the edge clamp to edge
        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0;
        }
        // Minimum distance
        var d = Math.sqrt(Math.pow(p0.x + u.x * t - circleWorlPos.x, 2) + Math.pow(p0.y + u.y * t - circleWorlPos.y, 2)) - circle.radius;
        var circlex = ((p0.x + u.x * t - circleWorlPos.x) * circle.radius) / (circle.radius + d);
        var circley = ((p0.y + u.y * t - circleWorlPos.y) * circle.radius) / (circle.radius + d);
        return new line_segment_1.LineSegment(u.scale(t).add(p0), new vector_1.Vector(circleWorlPos.x + circlex, circleWorlPos.y + circley));
    },
    EdgeEdgeClosestLine: function (edgeA, edgeB) {
        // L1 = P(s) = p0 + s * u, where s is time and p0 is the start of the line
        var edgeLineA = edgeA.asLine();
        var edgeStartA = edgeLineA.begin;
        var edgeVectorA = edgeLineA.getEdge();
        var p0 = edgeStartA;
        var u = edgeVectorA;
        // L2 = Q(t) = q0 + t * v, where t is time and q0 is the start of the line
        var edgeLineB = edgeB.asLine();
        var edgeStartB = edgeLineB.begin;
        var edgeVectorB = edgeLineB.getEdge();
        var q0 = edgeStartB;
        var v = edgeVectorB;
        return ClosestLine(p0, u, q0, v);
    }
};
