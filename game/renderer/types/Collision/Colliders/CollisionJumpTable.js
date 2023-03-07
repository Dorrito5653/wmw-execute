"use strict";
exports.__esModule = true;
exports.CollisionJumpTable = void 0;
var CircleCollider_1 = require("./CircleCollider");
var CollisionContact_1 = require("../Detection/CollisionContact");
var PolygonCollider_1 = require("./PolygonCollider");
var EdgeCollider_1 = require("./EdgeCollider");
var SeparatingAxis_1 = require("./SeparatingAxis");
var line_segment_1 = require("../../Math/line-segment");
var EntityComponentSystem_1 = require("../../EntityComponentSystem");
var Pair_1 = require("../Detection/Pair");
exports.CollisionJumpTable = {
    CollideCircleCircle: function (circleA, circleB) {
        var circleAPos = circleA.worldPos;
        var circleBPos = circleB.worldPos;
        var combinedRadius = circleA.radius + circleB.radius;
        var distance = circleAPos.distance(circleBPos);
        if (distance > combinedRadius) {
            return [];
        }
        // negative means overlap
        var separation = combinedRadius - distance;
        // Normal points from A -> B
        var normal = circleBPos.sub(circleAPos).normalize();
        var tangent = normal.perpendicular();
        var mvt = normal.scale(separation);
        var point = circleA.getFurthestPoint(normal);
        var local = circleA.getFurthestLocalPoint(normal);
        var info = {
            collider: circleA,
            separation: separation,
            axis: normal,
            point: point
        };
        return [new CollisionContact_1.CollisionContact(circleA, circleB, mvt, normal, tangent, [point], [local], info)];
    },
    CollideCirclePolygon: function (circle, polygon) {
        var _a, _b;
        var minAxis = SeparatingAxis_1.SeparatingAxis.findCirclePolygonSeparation(circle, polygon);
        if (!minAxis) {
            return [];
        }
        // make sure that the minAxis is pointing away from circle
        var samedir = minAxis.dot(polygon.center.sub(circle.center));
        minAxis = samedir < 0 ? minAxis.negate() : minAxis;
        var point = circle.getFurthestPoint(minAxis);
        var xf = (_b = (_a = circle.owner) === null || _a === void 0 ? void 0 : _a.get(EntityComponentSystem_1.TransformComponent)) !== null && _b !== void 0 ? _b : new EntityComponentSystem_1.TransformComponent();
        var local = xf.applyInverse(point);
        var normal = minAxis.normalize();
        var info = {
            collider: circle,
            separation: -minAxis.size,
            axis: normal,
            point: point,
            localPoint: local,
            side: polygon.findSide(normal.negate()),
            localSide: polygon.findLocalSide(normal.negate())
        };
        return [new CollisionContact_1.CollisionContact(circle, polygon, minAxis, normal, normal.perpendicular(), [point], [local], info)];
    },
    CollideCircleEdge: function (circle, edge) {
        // TODO not sure this actually abides by local/world collisions
        // Are edge.begin and edge.end local space or world space? I think they should be local
        // center of the circle in world pos
        var cc = circle.center;
        // vector in the direction of the edge
        var edgeWorld = edge.asLine();
        var e = edgeWorld.end.sub(edgeWorld.begin);
        // amount of overlap with the circle's center along the edge direction
        var u = e.dot(edgeWorld.end.sub(cc));
        var v = e.dot(cc.sub(edgeWorld.begin));
        var side = edge.asLine();
        var localSide = edge.asLocalLine();
        // Potential region A collision (circle is on the left side of the edge, before the beginning)
        if (v <= 0) {
            var da = edgeWorld.begin.sub(cc);
            var dda = da.dot(da); // quick and dirty way of calc'n distance in r^2 terms saves some sqrts
            // save some sqrts
            if (dda > circle.radius * circle.radius) {
                return []; // no collision
            }
            var normal_1 = da.normalize();
            var separation_1 = circle.radius - Math.sqrt(dda);
            var info_1 = {
                collider: circle,
                separation: separation_1,
                axis: normal_1,
                point: side.begin,
                side: side,
                localSide: localSide
            };
            return [
                new CollisionContact_1.CollisionContact(circle, edge, normal_1.scale(separation_1), normal_1, normal_1.perpendicular(), [side.begin], [localSide.begin], info_1)
            ];
        }
        // Potential region B collision (circle is on the right side of the edge, after the end)
        if (u <= 0) {
            var db = edgeWorld.end.sub(cc);
            var ddb = db.dot(db);
            if (ddb > circle.radius * circle.radius) {
                return [];
            }
            var normal_2 = db.normalize();
            var separation_2 = circle.radius - Math.sqrt(ddb);
            var info_2 = {
                collider: circle,
                separation: separation_2,
                axis: normal_2,
                point: side.end,
                side: side,
                localSide: localSide
            };
            return [
                new CollisionContact_1.CollisionContact(circle, edge, normal_2.scale(separation_2), normal_2, normal_2.perpendicular(), [side.end], [localSide.end], info_2)
            ];
        }
        // Otherwise potential region AB collision (circle is in the middle of the edge between the beginning and end)
        var den = e.dot(e);
        var pointOnEdge = edgeWorld.begin
            .scale(u)
            .add(edgeWorld.end.scale(v))
            .scale(1 / den);
        var d = cc.sub(pointOnEdge);
        var dd = d.dot(d);
        if (dd > circle.radius * circle.radius) {
            return []; // no collision
        }
        var normal = e.perpendicular();
        // flip correct direction
        if (normal.dot(cc.sub(edgeWorld.begin)) < 0) {
            normal.x = -normal.x;
            normal.y = -normal.y;
        }
        normal = normal.normalize();
        var separation = circle.radius - Math.sqrt(dd);
        var mvt = normal.scale(separation);
        var info = {
            collider: circle,
            separation: separation,
            axis: normal,
            point: pointOnEdge,
            side: side,
            localSide: localSide
        };
        return [
            new CollisionContact_1.CollisionContact(circle, edge, mvt, normal.negate(), normal.negate().perpendicular(), [pointOnEdge], [pointOnEdge.sub(edge.worldPos)], info)
        ];
    },
    CollideEdgeEdge: function () {
        // Edge-edge collision doesn't make sense
        return [];
    },
    CollidePolygonEdge: function (polygon, edge) {
        var _a;
        var pc = polygon.center;
        var ec = edge.center;
        var dir = ec.sub(pc).normalize();
        // build a temporary polygon from the edge to use SAT
        var linePoly = new PolygonCollider_1.PolygonCollider({
            points: [edge.begin, edge.end, edge.end.add(dir.scale(100)), edge.begin.add(dir.scale(100))],
            offset: edge.offset
        });
        linePoly.owner = edge.owner;
        var tx = (_a = edge.owner) === null || _a === void 0 ? void 0 : _a.get(EntityComponentSystem_1.TransformComponent);
        if (tx) {
            linePoly.update(edge.owner.get(EntityComponentSystem_1.TransformComponent).get());
        }
        // Gross hack but poly-poly works well
        var contact = this.CollidePolygonPolygon(polygon, linePoly);
        if (contact.length) {
            // Fudge the contact back to edge
            contact[0].colliderB = edge;
            contact[0].id = Pair_1.Pair.calculatePairHash(polygon.id, edge.id);
        }
        return contact;
    },
    CollidePolygonPolygon: function (polyA, polyB) {
        var _a, _b, _c, _d;
        // Multi contact from SAT
        // https://gamedev.stackexchange.com/questions/111390/multiple-contacts-for-sat-collision-detection
        // do a SAT test to find a min axis if it exists
        var separationA = SeparatingAxis_1.SeparatingAxis.findPolygonPolygonSeparation(polyA, polyB);
        // If there is no overlap from boxA's perspective we can end early
        if (separationA.separation > 0) {
            return [];
        }
        var separationB = SeparatingAxis_1.SeparatingAxis.findPolygonPolygonSeparation(polyB, polyA);
        // If there is no overlap from boxB's perspective exit now
        if (separationB.separation > 0) {
            return [];
        }
        // Separations are both negative, we want to pick the least negative (minimal movement)
        var separation = separationA.separation > separationB.separation ? separationA : separationB;
        // The incident side is the most opposite from the axes of collision on the other collider
        var other = separation.collider === polyA ? polyB : polyA;
        var incident = other.findSide(separation.axis.negate());
        // Clip incident side by the perpendicular lines at each end of the reference side
        // https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
        var reference = separation.side;
        var refDir = reference.dir().normalize();
        // Find our contact points by clipping the incident by the collision side
        var clipRight = incident.clip(refDir.negate(), -refDir.dot(reference.begin));
        var clipLeft = null;
        if (clipRight) {
            clipLeft = clipRight.clip(refDir, refDir.dot(reference.end));
        }
        // If there is no left there is no collision
        if (clipLeft) {
            // We only want clip points below the reference edge, discard the others
            var points = clipLeft.getPoints().filter(function (p) {
                return reference.below(p);
            });
            var normal = separation.axis;
            var tangent = normal.perpendicular();
            // Point Contact A -> B
            if (polyB.center.sub(polyA.center).dot(normal) < 0) {
                normal = normal.negate();
                tangent = normal.perpendicular();
            }
            // Points are clipped from incident which is the other collider
            // Store those as locals
            var localPoints = [];
            if (separation.collider === polyA) {
                var xf_1 = (_b = (_a = polyB.owner) === null || _a === void 0 ? void 0 : _a.get(EntityComponentSystem_1.TransformComponent)) !== null && _b !== void 0 ? _b : new EntityComponentSystem_1.TransformComponent();
                localPoints = points.map(function (p) { return xf_1.applyInverse(p); });
            }
            else {
                var xf_2 = (_d = (_c = polyA.owner) === null || _c === void 0 ? void 0 : _c.get(EntityComponentSystem_1.TransformComponent)) !== null && _d !== void 0 ? _d : new EntityComponentSystem_1.TransformComponent();
                localPoints = points.map(function (p) { return xf_2.applyInverse(p); });
            }
            return [new CollisionContact_1.CollisionContact(polyA, polyB, normal.scale(-separation.separation), normal, tangent, points, localPoints, separation)];
        }
        return [];
    },
    FindContactSeparation: function (contact, localPoint) {
        var _a, _b, _c, _d;
        var shapeA = contact.colliderA;
        var txA = (_b = (_a = contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(EntityComponentSystem_1.TransformComponent)) !== null && _b !== void 0 ? _b : new EntityComponentSystem_1.TransformComponent();
        var shapeB = contact.colliderB;
        var txB = (_d = (_c = contact.colliderB.owner) === null || _c === void 0 ? void 0 : _c.get(EntityComponentSystem_1.TransformComponent)) !== null && _d !== void 0 ? _d : new EntityComponentSystem_1.TransformComponent();
        // both are circles
        if (shapeA instanceof CircleCollider_1.CircleCollider && shapeB instanceof CircleCollider_1.CircleCollider) {
            var combinedRadius = shapeA.radius + shapeB.radius;
            var distance = txA.pos.distance(txB.pos);
            var separation = combinedRadius - distance;
            return -separation;
        }
        // both are polygons
        if (shapeA instanceof PolygonCollider_1.PolygonCollider && shapeB instanceof PolygonCollider_1.PolygonCollider) {
            if (contact.info.localSide) {
                var side = void 0;
                var worldPoint = void 0;
                if (contact.info.collider === shapeA) {
                    side = new line_segment_1.LineSegment(txA.apply(contact.info.localSide.begin), txA.apply(contact.info.localSide.end));
                    worldPoint = txB.apply(localPoint);
                }
                else {
                    side = new line_segment_1.LineSegment(txB.apply(contact.info.localSide.begin), txB.apply(contact.info.localSide.end));
                    worldPoint = txA.apply(localPoint);
                }
                return side.distanceToPoint(worldPoint, true);
            }
        }
        // polygon v circle
        if ((shapeA instanceof PolygonCollider_1.PolygonCollider && shapeB instanceof CircleCollider_1.CircleCollider) ||
            (shapeB instanceof PolygonCollider_1.PolygonCollider && shapeA instanceof CircleCollider_1.CircleCollider)) {
            var worldPoint = txA.apply(localPoint);
            if (contact.info.side) {
                return contact.info.side.distanceToPoint(worldPoint, true);
            }
        }
        // polygon v edge
        if ((shapeA instanceof EdgeCollider_1.EdgeCollider && shapeB instanceof PolygonCollider_1.PolygonCollider) ||
            (shapeB instanceof EdgeCollider_1.EdgeCollider && shapeA instanceof PolygonCollider_1.PolygonCollider)) {
            var worldPoint = void 0;
            if (contact.info.collider === shapeA) {
                worldPoint = txB.apply(localPoint);
            }
            else {
                worldPoint = txA.apply(localPoint);
            }
            if (contact.info.side) {
                return contact.info.side.distanceToPoint(worldPoint, true);
            }
        }
        // circle v edge
        if ((shapeA instanceof CircleCollider_1.CircleCollider && shapeB instanceof EdgeCollider_1.EdgeCollider) ||
            (shapeB instanceof CircleCollider_1.CircleCollider && shapeA instanceof EdgeCollider_1.EdgeCollider)) {
            // Local point is always on the edge which is always shapeB
            var worldPoint = txB.apply(localPoint);
            var circlePoint = void 0;
            if (shapeA instanceof CircleCollider_1.CircleCollider) {
                circlePoint = shapeA.getFurthestPoint(contact.normal);
            }
            var dist = worldPoint.distance(circlePoint);
            if (contact.info.side) {
                return dist > 0 ? -dist : 0;
            }
        }
        return 0;
    }
};
