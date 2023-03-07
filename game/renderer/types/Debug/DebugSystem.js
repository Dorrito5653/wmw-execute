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
exports.DebugSystem = void 0;
var MotionComponent_1 = require("../EntityComponentSystem/Components/MotionComponent");
var ColliderComponent_1 = require("../Collision/ColliderComponent");
var EntityComponentSystem_1 = require("../EntityComponentSystem");
var System_1 = require("../EntityComponentSystem/System");
var vector_1 = require("../Math/vector");
var util_1 = require("../Math/util");
var __1 = require("..");
var DebugGraphicsComponent_1 = require("../Graphics/DebugGraphicsComponent");
var coord_plane_1 = require("../Math/coord-plane");
var DebugSystem = /** @class */ (function (_super) {
    __extends(DebugSystem, _super);
    function DebugSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.transform'];
        _this.systemType = System_1.SystemType.Draw;
        _this.priority = 999; // lowest priority
        return _this;
    }
    DebugSystem.prototype.initialize = function (scene) {
        this._graphicsContext = scene.engine.graphicsContext;
        this._camera = scene.camera;
        this._engine = scene.engine;
        this._collisionSystem = scene.world.systemManager.get(__1.CollisionSystem);
    };
    DebugSystem.prototype.update = function (entities, _delta) {
        var _a;
        if (!this._engine.isDebug) {
            return;
        }
        var filterSettings = this._engine.debug.filter;
        var id;
        var name;
        var entitySettings = this._engine.debug.entity;
        var tx;
        var txSettings = this._engine.debug.transform;
        var motion;
        var motionSettings = this._engine.debug.motion;
        var colliderComp;
        var colliderSettings = this._engine.debug.collider;
        var physicsSettings = this._engine.debug.physics;
        var graphics;
        var graphicsSettings = this._engine.debug.graphics;
        var debugDraw;
        var body;
        var bodySettings = this._engine.debug.body;
        var cameraSettings = this._engine.debug.camera;
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var entity = entities_1[_i];
            if (entity.hasTag('offscreen')) {
                // skip offscreen entities
                continue;
            }
            if (entity instanceof __1.Particle) {
                // Particles crush the renderer :(
                continue;
            }
            if (filterSettings.useFilter) {
                var allIds = filterSettings.ids.length === 0;
                var idMatch = allIds || filterSettings.ids.includes(entity.id);
                if (!idMatch) {
                    continue;
                }
                var allNames = filterSettings.nameQuery === '';
                var nameMatch = allNames || entity.name.includes(filterSettings.nameQuery);
                if (!nameMatch) {
                    continue;
                }
            }
            var cursor = vector_1.Vector.Zero;
            var lineHeight = (0, vector_1.vec)(0, 16);
            id = entity.id;
            name = entity.name;
            tx = entity.get(EntityComponentSystem_1.TransformComponent);
            // This optionally sets our camera based on the entity coord plan (world vs. screen)
            this._pushCameraTransform(tx);
            this._graphicsContext.save();
            this._applyTransform(entity);
            if (tx) {
                if (txSettings.showAll || txSettings.showPosition) {
                    this._graphicsContext.debug.drawPoint(vector_1.Vector.Zero, { size: 4, color: txSettings.positionColor });
                }
                if (txSettings.showAll || txSettings.showPositionLabel) {
                    this._graphicsContext.debug.drawText("pos".concat(tx.pos.toString(2)), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (txSettings.showAll || txSettings.showZIndex) {
                    this._graphicsContext.debug.drawText("z(".concat(tx.z.toFixed(1), ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (entitySettings.showAll || entitySettings.showId) {
                    this._graphicsContext.debug.drawText("id(".concat(id, ") ").concat(entity.parent ? 'child of id(' + ((_a = entity.parent) === null || _a === void 0 ? void 0 : _a.id) + ')' : ''), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (entitySettings.showAll || entitySettings.showName) {
                    this._graphicsContext.debug.drawText("name(".concat(name, ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (txSettings.showAll || txSettings.showRotation) {
                    this._graphicsContext.drawLine(vector_1.Vector.Zero, vector_1.Vector.fromAngle(tx.rotation).scale(50).add(vector_1.Vector.Zero), txSettings.rotationColor, 2);
                    this._graphicsContext.debug.drawText("rot deg(".concat((0, util_1.toDegrees)(tx.rotation).toFixed(2), ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (txSettings.showAll || txSettings.showScale) {
                    this._graphicsContext.drawLine(vector_1.Vector.Zero, tx.scale.add(vector_1.Vector.Zero), txSettings.scaleColor, 2);
                }
            }
            graphics = entity.get(__1.GraphicsComponent);
            if (graphics) {
                if (graphicsSettings.showAll || graphicsSettings.showBounds) {
                    var bounds = graphics.localBounds;
                    bounds.draw(this._graphicsContext, graphicsSettings.boundsColor);
                }
            }
            debugDraw = entity.get(DebugGraphicsComponent_1.DebugGraphicsComponent);
            if (debugDraw) {
                if (!debugDraw.useTransform) {
                    this._graphicsContext.restore();
                }
                debugDraw.draw(this._graphicsContext);
                if (!debugDraw.useTransform) {
                    this._graphicsContext.save();
                    this._applyTransform(entity);
                }
            }
            body = entity.get(__1.BodyComponent);
            if (body) {
                if (bodySettings.showAll || bodySettings.showCollisionGroup) {
                    this._graphicsContext.debug.drawText("collision group(".concat(body.group.name, ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (bodySettings.showAll || bodySettings.showCollisionType) {
                    this._graphicsContext.debug.drawText("collision type(".concat(body.collisionType, ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (bodySettings.showAll || bodySettings.showMass) {
                    this._graphicsContext.debug.drawText("mass(".concat(body.mass, ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (bodySettings.showAll || bodySettings.showMotion) {
                    this._graphicsContext.debug.drawText("motion(".concat(body.sleepMotion, ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
                if (bodySettings.showAll || bodySettings.showSleeping) {
                    this._graphicsContext.debug.drawText("sleeping(".concat(body.canSleep ? body.sleeping : 'cant sleep', ")"), cursor);
                    cursor = cursor.add(lineHeight);
                }
            }
            this._graphicsContext.restore();
            motion = entity.get(MotionComponent_1.MotionComponent);
            if (motion) {
                if (motionSettings.showAll || motionSettings.showVelocity) {
                    this._graphicsContext.debug.drawText("vel".concat(motion.vel.toString(2)), cursor.add(tx.globalPos));
                    this._graphicsContext.drawLine(tx.globalPos, tx.globalPos.add(motion.vel), motionSettings.velocityColor, 2);
                    cursor = cursor.add(lineHeight);
                }
                if (motionSettings.showAll || motionSettings.showAcceleration) {
                    this._graphicsContext.drawLine(tx.globalPos, tx.globalPos.add(motion.acc), motionSettings.accelerationColor, 2);
                }
            }
            // Colliders live in world space already so after the restore()
            colliderComp = entity.get(ColliderComponent_1.ColliderComponent);
            if (colliderComp) {
                var collider = colliderComp.get();
                if ((colliderSettings.showAll || colliderSettings.showGeometry) && collider) {
                    collider.debug(this._graphicsContext, colliderSettings.geometryColor);
                }
                if (colliderSettings.showAll || colliderSettings.showBounds) {
                    if (collider instanceof __1.CompositeCollider) {
                        var colliders = collider.getColliders();
                        for (var _b = 0, colliders_1 = colliders; _b < colliders_1.length; _b++) {
                            var collider_1 = colliders_1[_b];
                            var bounds = collider_1.bounds;
                            var pos = (0, vector_1.vec)(bounds.left, bounds.top);
                            this._graphicsContext.debug.drawRect(pos.x, pos.y, bounds.width, bounds.height, { color: colliderSettings.boundsColor });
                            if (colliderSettings.showAll || colliderSettings.showOwner) {
                                this._graphicsContext.debug.drawText("owner id(".concat(collider_1.owner.id, ")"), pos);
                            }
                        }
                        colliderComp.bounds.draw(this._graphicsContext, colliderSettings.boundsColor);
                    }
                    else if (collider) {
                        var bounds = colliderComp.bounds;
                        var pos = (0, vector_1.vec)(bounds.left, bounds.top);
                        this._graphicsContext.debug.drawRect(pos.x, pos.y, bounds.width, bounds.height, { color: colliderSettings.boundsColor });
                        if (colliderSettings.showAll || colliderSettings.showOwner) {
                            this._graphicsContext.debug.drawText("owner id(".concat(colliderComp.owner.id, ")"), pos);
                        }
                    }
                }
            }
            this._popCameraTransform(tx);
        }
        this._graphicsContext.save();
        this._camera.draw(this._graphicsContext);
        if (physicsSettings.showAll || physicsSettings.showBroadphaseSpacePartitionDebug) {
            this._collisionSystem.debug(this._graphicsContext);
        }
        if (physicsSettings.showAll || physicsSettings.showCollisionContacts || physicsSettings.showCollisionNormals) {
            for (var _c = 0, _d = this._engine.debug.stats.currFrame.physics.contacts; _c < _d.length; _c++) {
                var _e = _d[_c], _ = _e[0], contact = _e[1];
                if (physicsSettings.showAll || physicsSettings.showCollisionContacts) {
                    for (var _f = 0, _g = contact.points; _f < _g.length; _f++) {
                        var point = _g[_f];
                        this._graphicsContext.debug.drawPoint(point, { size: 5, color: physicsSettings.collisionContactColor });
                    }
                }
                if (physicsSettings.showAll || physicsSettings.showCollisionNormals) {
                    for (var _h = 0, _j = contact.points; _h < _j.length; _h++) {
                        var point = _j[_h];
                        this._graphicsContext.debug.drawLine(point, contact.normal.scale(30).add(point), {
                            color: physicsSettings.collisionNormalColor
                        });
                    }
                }
            }
        }
        this._graphicsContext.restore();
        if (cameraSettings) {
            this._graphicsContext.save();
            this._camera.draw(this._graphicsContext);
            if (cameraSettings.showAll || cameraSettings.showFocus) {
                this._graphicsContext.drawCircle(this._camera.pos, 4, cameraSettings.focusColor);
            }
            if (cameraSettings.showAll || cameraSettings.showZoom) {
                this._graphicsContext.debug.drawText("zoom(".concat(this._camera.zoom, ")"), this._camera.pos);
            }
            this._graphicsContext.restore();
        }
        this._graphicsContext.flush();
    };
    /**
     * This applies the current entity transform to the graphics context
     * @param entity
     */
    DebugSystem.prototype._applyTransform = function (entity) {
        var ancestors = entity.getAncestors();
        for (var _i = 0, ancestors_1 = ancestors; _i < ancestors_1.length; _i++) {
            var ancestor = ancestors_1[_i];
            var transform = ancestor === null || ancestor === void 0 ? void 0 : ancestor.get(EntityComponentSystem_1.TransformComponent);
            if (transform) {
                this._graphicsContext.translate(transform.pos.x, transform.pos.y);
                this._graphicsContext.scale(transform.scale.x, transform.scale.y);
                this._graphicsContext.rotate(transform.rotation);
            }
        }
    };
    /**
     * Applies the current camera transform if in world coordinates
     * @param transform
     */
    DebugSystem.prototype._pushCameraTransform = function (transform) {
        // Establish camera offset per entity
        if (transform.coordPlane === coord_plane_1.CoordPlane.World) {
            this._graphicsContext.save();
            if (this._camera) {
                this._camera.draw(this._graphicsContext);
            }
        }
    };
    /**
     * Resets the current camera transform if in world coordinates
     * @param transform
     */
    DebugSystem.prototype._popCameraTransform = function (transform) {
        if (transform.coordPlane === coord_plane_1.CoordPlane.World) {
            // Apply camera world offset
            this._graphicsContext.restore();
        }
    };
    return DebugSystem;
}(System_1.System));
exports.DebugSystem = DebugSystem;
