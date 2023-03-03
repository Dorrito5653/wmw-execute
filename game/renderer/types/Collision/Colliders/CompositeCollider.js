"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CompositeCollider = void 0;
var __1 = require("../..");
var Pair_1 = require("../Detection/Pair");
var projection_1 = require("../../Math/projection");
var vector_1 = require("../../Math/vector");
var BoundingBox_1 = require("../BoundingBox");
var DynamicTree_1 = require("../Detection/DynamicTree");
var DynamicTreeCollisionProcessor_1 = require("../Detection/DynamicTreeCollisionProcessor");
var Collider_1 = require("./Collider");
var CompositeCollider = /** @class */ (function (_super) {
    __extends(CompositeCollider, _super);
    function CompositeCollider(colliders) {
        var _this = _super.call(this) || this;
        _this._collisionProcessor = new DynamicTreeCollisionProcessor_1.DynamicTreeCollisionProcessor();
        _this._dynamicAABBTree = new DynamicTree_1.DynamicTree();
        _this._colliders = [];
        for (var _i = 0, colliders_1 = colliders; _i < colliders_1.length; _i++) {
            var c = colliders_1[_i];
            _this.addCollider(c);
        }
        return _this;
    }
    CompositeCollider.prototype.clearColliders = function () {
        this._colliders = [];
    };
    CompositeCollider.prototype.addCollider = function (collider) {
        this.events.wire(collider.events);
        collider.__compositeColliderId = this.id;
        this._colliders.push(collider);
        this._collisionProcessor.track(collider);
        this._dynamicAABBTree.trackCollider(collider);
    };
    CompositeCollider.prototype.removeCollider = function (collider) {
        this.events.unwire(collider.events);
        collider.__compositeColliderId = null;
        __1.Util.removeItemFromArray(collider, this._colliders);
        this._collisionProcessor.untrack(collider);
        this._dynamicAABBTree.untrackCollider(collider);
    };
    CompositeCollider.prototype.getColliders = function () {
        return this._colliders;
    };
    Object.defineProperty(CompositeCollider.prototype, "worldPos", {
        get: function () {
            var _a, _b;
            // TODO transform component world pos
            return (_b = (_a = this._transform) === null || _a === void 0 ? void 0 : _a.pos) !== null && _b !== void 0 ? _b : vector_1.Vector.Zero;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompositeCollider.prototype, "center", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._transform) === null || _a === void 0 ? void 0 : _a.pos) !== null && _b !== void 0 ? _b : vector_1.Vector.Zero;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompositeCollider.prototype, "bounds", {
        get: function () {
            var _a, _b;
            // TODO cache this
            var colliders = this.getColliders();
            var results = colliders.reduce(function (acc, collider) { return acc.combine(collider.bounds); }, (_b = (_a = colliders[0]) === null || _a === void 0 ? void 0 : _a.bounds) !== null && _b !== void 0 ? _b : new BoundingBox_1.BoundingBox().translate(this.worldPos));
            return results;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompositeCollider.prototype, "localBounds", {
        get: function () {
            var _a, _b;
            // TODO cache this
            var colliders = this.getColliders();
            var results = colliders.reduce(function (acc, collider) { return acc.combine(collider.localBounds); }, (_b = (_a = colliders[0]) === null || _a === void 0 ? void 0 : _a.localBounds) !== null && _b !== void 0 ? _b : new BoundingBox_1.BoundingBox());
            return results;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompositeCollider.prototype, "axes", {
        get: function () {
            // TODO cache this
            var colliders = this.getColliders();
            var axes = [];
            for (var _i = 0, colliders_2 = colliders; _i < colliders_2.length; _i++) {
                var collider = colliders_2[_i];
                axes = axes.concat(collider.axes);
            }
            return axes;
        },
        enumerable: false,
        configurable: true
    });
    CompositeCollider.prototype.getFurthestPoint = function (direction) {
        var colliders = this.getColliders();
        var furthestPoints = [];
        for (var _i = 0, colliders_3 = colliders; _i < colliders_3.length; _i++) {
            var collider = colliders_3[_i];
            furthestPoints.push(collider.getFurthestPoint(direction));
        }
        // Pick best point from all colliders
        var bestPoint = furthestPoints[0];
        var maxDistance = -Number.MAX_VALUE;
        for (var _a = 0, furthestPoints_1 = furthestPoints; _a < furthestPoints_1.length; _a++) {
            var point = furthestPoints_1[_a];
            var distance = point.dot(direction);
            if (distance > maxDistance) {
                bestPoint = point;
                maxDistance = distance;
            }
        }
        return bestPoint;
    };
    CompositeCollider.prototype.getInertia = function (mass) {
        var colliders = this.getColliders();
        var totalInertia = 0;
        for (var _i = 0, colliders_4 = colliders; _i < colliders_4.length; _i++) {
            var collider = colliders_4[_i];
            totalInertia += collider.getInertia(mass);
        }
        return totalInertia;
    };
    CompositeCollider.prototype.collide = function (other) {
        var otherColliders = [other];
        if (other instanceof CompositeCollider) {
            otherColliders = other.getColliders();
        }
        var pairs = [];
        var _loop_1 = function (c) {
            this_1._dynamicAABBTree.query(c, function (potentialCollider) {
                pairs.push(new Pair_1.Pair(c, potentialCollider));
                return false;
            });
        };
        var this_1 = this;
        for (var _i = 0, otherColliders_1 = otherColliders; _i < otherColliders_1.length; _i++) {
            var c = otherColliders_1[_i];
            _loop_1(c);
        }
        var contacts = [];
        for (var _a = 0, pairs_1 = pairs; _a < pairs_1.length; _a++) {
            var p = pairs_1[_a];
            contacts = contacts.concat(p.collide());
        }
        return contacts;
    };
    CompositeCollider.prototype.getClosestLineBetween = function (other) {
        var colliders = this.getColliders();
        var lines = [];
        if (other instanceof CompositeCollider) {
            var otherColliders = other.getColliders();
            for (var _i = 0, colliders_5 = colliders; _i < colliders_5.length; _i++) {
                var colliderA = colliders_5[_i];
                for (var _a = 0, otherColliders_2 = otherColliders; _a < otherColliders_2.length; _a++) {
                    var colliderB = otherColliders_2[_a];
                    var maybeLine = colliderA.getClosestLineBetween(colliderB);
                    if (maybeLine) {
                        lines.push(maybeLine);
                    }
                }
            }
        }
        else {
            for (var _b = 0, colliders_6 = colliders; _b < colliders_6.length; _b++) {
                var collider = colliders_6[_b];
                var maybeLine = other.getClosestLineBetween(collider);
                if (maybeLine) {
                    lines.push(maybeLine);
                }
            }
        }
        if (lines.length) {
            var minLength = lines[0].getLength();
            var minLine = lines[0];
            for (var _c = 0, lines_1 = lines; _c < lines_1.length; _c++) {
                var line = lines_1[_c];
                var length_1 = line.getLength();
                if (length_1 < minLength) {
                    minLength = length_1;
                    minLine = line;
                }
            }
            return minLine;
        }
        return null;
    };
    CompositeCollider.prototype.contains = function (point) {
        var colliders = this.getColliders();
        for (var _i = 0, colliders_7 = colliders; _i < colliders_7.length; _i++) {
            var collider = colliders_7[_i];
            if (collider.contains(point)) {
                return true;
            }
        }
        return false;
    };
    CompositeCollider.prototype.rayCast = function (ray, max) {
        var colliders = this.getColliders();
        var points = [];
        for (var _i = 0, colliders_8 = colliders; _i < colliders_8.length; _i++) {
            var collider = colliders_8[_i];
            var vec = collider.rayCast(ray, max);
            if (vec) {
                points.push(vec);
            }
        }
        if (points.length) {
            var minPoint = points[0];
            var minDistance = minPoint.dot(ray.dir);
            for (var _a = 0, points_1 = points; _a < points_1.length; _a++) {
                var point = points_1[_a];
                var distance = ray.dir.dot(point);
                if (distance < minDistance) {
                    minPoint = point;
                    minDistance = distance;
                }
            }
            return minPoint;
        }
        return null;
    };
    CompositeCollider.prototype.project = function (axis) {
        var colliders = this.getColliders();
        var projs = [];
        for (var _i = 0, colliders_9 = colliders; _i < colliders_9.length; _i++) {
            var collider = colliders_9[_i];
            var proj = collider.project(axis);
            if (proj) {
                projs.push(proj);
            }
        }
        // Merge all proj's on the same axis
        if (projs.length) {
            var newProjection = new projection_1.Projection(projs[0].min, projs[0].max);
            for (var _a = 0, projs_1 = projs; _a < projs_1.length; _a++) {
                var proj = projs_1[_a];
                newProjection.min = Math.min(proj.min, newProjection.min);
                newProjection.max = Math.max(proj.max, newProjection.max);
            }
            return newProjection;
        }
        return null;
    };
    CompositeCollider.prototype.update = function (transform) {
        if (transform) {
            var colliders = this.getColliders();
            for (var _i = 0, colliders_10 = colliders; _i < colliders_10.length; _i++) {
                var collider = colliders_10[_i];
                collider.owner = this.owner;
                collider.update(transform);
            }
        }
    };
    CompositeCollider.prototype.debug = function (ex, color) {
        var colliders = this.getColliders();
        for (var _i = 0, colliders_11 = colliders; _i < colliders_11.length; _i++) {
            var collider = colliders_11[_i];
            collider.debug(ex, color);
        }
    };
    CompositeCollider.prototype.clone = function () {
        return new CompositeCollider(this._colliders.map(function (c) { return c.clone(); }));
    };
    return CompositeCollider;
}(Collider_1.Collider));
exports.CompositeCollider = CompositeCollider;
