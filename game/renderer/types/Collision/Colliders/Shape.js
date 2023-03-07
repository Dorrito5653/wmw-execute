"use strict";
exports.__esModule = true;
exports.Shape = void 0;
var PolygonCollider_1 = require("./PolygonCollider");
var CircleCollider_1 = require("./CircleCollider");
var EdgeCollider_1 = require("./EdgeCollider");
var BoundingBox_1 = require("../BoundingBox");
var vector_1 = require("../../Math/vector");
var CompositeCollider_1 = require("./CompositeCollider");
var __1 = require("../..");
/**
 * Excalibur helper for defining colliders quickly
 */
var Shape = /** @class */ (function () {
    function Shape() {
    }
    /**
     * Creates a box collider, under the hood defines a [[PolygonCollider]] collider
     * @param width Width of the box
     * @param height Height of the box
     * @param anchor Anchor of the box (default (.5, .5)) which positions the box relative to the center of the collider's position
     * @param offset Optional offset relative to the collider in local coordinates
     */
    Shape.Box = function (width, height, anchor, offset) {
        if (anchor === void 0) { anchor = vector_1.Vector.Half; }
        if (offset === void 0) { offset = vector_1.Vector.Zero; }
        return new PolygonCollider_1.PolygonCollider({
            points: new BoundingBox_1.BoundingBox(-width * anchor.x, -height * anchor.y, width - width * anchor.x, height - height * anchor.y).getPoints(),
            offset: offset
        });
    };
    /**
     * Creates a new [[PolygonCollider|arbitrary polygon]] collider
     *
     * PolygonColliders are useful for creating convex polygon shapes
     * @param points Points specified in counter clockwise
     * @param offset Optional offset relative to the collider in local coordinates
     */
    Shape.Polygon = function (points, offset) {
        if (offset === void 0) { offset = vector_1.Vector.Zero; }
        return new PolygonCollider_1.PolygonCollider({
            points: points,
            offset: offset
        });
    };
    /**
     * Creates a new [[CircleCollider|circle]] collider
     *
     * Circle colliders are useful for balls, or to make collisions more forgiving on sharp edges
     * @param radius Radius of the circle collider
     * @param offset Optional offset relative to the collider in local coordinates
     */
    Shape.Circle = function (radius, offset) {
        if (offset === void 0) { offset = vector_1.Vector.Zero; }
        return new CircleCollider_1.CircleCollider({
            radius: radius,
            offset: offset
        });
    };
    /**
     * Creates a new [[EdgeCollider|edge]] collider
     *
     * Edge colliders are useful for  floors, walls, and other barriers
     * @param begin Beginning of the edge in local coordinates to the collider
     * @param end Ending of the edge in local coordinates to the collider
     */
    Shape.Edge = function (begin, end) {
        return new EdgeCollider_1.EdgeCollider({
            begin: begin,
            end: end
        });
    };
    /**
     * Creates a new capsule shaped [[CompositeCollider]] using 2 circles and a box
     *
     * Capsule colliders are useful for platformers with incline or jagged floors to have a smooth
     * player experience.
     *
     * @param width
     * @param height
     * @param offset Optional offset
     */
    Shape.Capsule = function (width, height, offset) {
        if (offset === void 0) { offset = vector_1.Vector.Zero; }
        var logger = __1.Logger.getInstance();
        if (width === height) {
            logger.warn('A capsule collider with equal width and height is a circle, consider using a ex.Shape.Circle or ex.CircleCollider');
        }
        var vertical = height >= width;
        if (vertical) {
            // height > width, if equal maybe use a circle
            var capsule = new CompositeCollider_1.CompositeCollider([
                Shape.Circle(width / 2, (0, vector_1.vec)(0, -height / 2 + width / 2).add(offset)),
                Shape.Box(width, height - width, vector_1.Vector.Half, offset),
                Shape.Circle(width / 2, (0, vector_1.vec)(0, height / 2 - width / 2).add(offset))
            ]);
            return capsule;
        }
        else {
            // width > height, if equal maybe use a circle
            var capsule = new CompositeCollider_1.CompositeCollider([
                Shape.Circle(height / 2, (0, vector_1.vec)(-width / 2 + height / 2, 0).add(offset)),
                Shape.Box(width - height, height, vector_1.Vector.Half, offset),
                Shape.Circle(height / 2, (0, vector_1.vec)(width / 2 - height / 2, 0).add(offset))
            ]);
            return capsule;
        }
    };
    return Shape;
}());
exports.Shape = Shape;
