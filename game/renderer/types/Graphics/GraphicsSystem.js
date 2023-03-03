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
exports.GraphicsSystem = void 0;
var GraphicsComponent_1 = require("./GraphicsComponent");
var vector_1 = require("../Math/vector");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
var EntityComponentSystem_1 = require("../EntityComponentSystem");
var _1 = require(".");
var Particles_1 = require("../Particles");
var ParallaxComponent_1 = require("./ParallaxComponent");
var coord_plane_1 = require("../Math/coord-plane");
var BodyComponent_1 = require("../Collision/BodyComponent");
var GraphicsSystem = /** @class */ (function (_super) {
    __extends(GraphicsSystem, _super);
    function GraphicsSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.transform', 'ex.graphics'];
        _this.systemType = EntityComponentSystem_1.SystemType.Draw;
        _this.priority = 0;
        _this._token = 0;
        _this._sortedTransforms = [];
        _this._zHasChanged = false;
        _this._zIndexUpdate = function () {
            _this._zHasChanged = true;
        };
        return _this;
    }
    Object.defineProperty(GraphicsSystem.prototype, "sortedTransforms", {
        get: function () {
            return this._sortedTransforms;
        },
        enumerable: false,
        configurable: true
    });
    GraphicsSystem.prototype.initialize = function (scene) {
        this._camera = scene.camera;
        this._engine = scene.engine;
    };
    GraphicsSystem.prototype.preupdate = function () {
        // Graphics context could be switched to fallback in a new frame
        this._graphicsContext = this._engine.graphicsContext;
        if (this._zHasChanged) {
            this._sortedTransforms.sort(function (a, b) {
                return a.z - b.z;
            });
            this._zHasChanged = false;
        }
    };
    GraphicsSystem.prototype.notify = function (entityAddedOrRemoved) {
        if ((0, EntityComponentSystem_1.isAddedSystemEntity)(entityAddedOrRemoved)) {
            var tx = entityAddedOrRemoved.data.get(TransformComponent_1.TransformComponent);
            this._sortedTransforms.push(tx);
            tx.zIndexChanged$.subscribe(this._zIndexUpdate);
            this._zHasChanged = true;
        }
        else {
            var tx = entityAddedOrRemoved.data.get(TransformComponent_1.TransformComponent);
            tx.zIndexChanged$.unsubscribe(this._zIndexUpdate);
            var index = this._sortedTransforms.indexOf(tx);
            if (index > -1) {
                this._sortedTransforms.splice(index, 1);
            }
        }
    };
    GraphicsSystem.prototype.update = function (_entities, delta) {
        this._token++;
        var graphics;
        // This is a performance enhancement, most things are in world space
        // so if we can only do this once saves a ton of transform updates
        this._graphicsContext.save();
        if (this._camera) {
            this._camera.draw(this._graphicsContext);
        }
        for (var _i = 0, _a = this._sortedTransforms; _i < _a.length; _i++) {
            var transform = _a[_i];
            var entity = transform.owner;
            // If the entity is offscreen skip
            if (entity.hasTag('ex.offscreen')) {
                continue;
            }
            graphics = entity.get(GraphicsComponent_1.GraphicsComponent);
            // Exit if graphics set to not visible
            if (!graphics.visible) {
                continue;
            }
            // This optionally sets our camera based on the entity coord plan (world vs. screen)
            if (transform.coordPlane === coord_plane_1.CoordPlane.Screen) {
                this._graphicsContext.restore();
            }
            this._graphicsContext.save();
            // Tick any graphics state (but only once) for animations and graphics groups
            graphics.update(delta, this._token);
            // Apply parallax
            var parallax = entity.get(ParallaxComponent_1.ParallaxComponent);
            if (parallax) {
                // We use the Tiled formula
                // https://doc.mapeditor.org/en/latest/manual/layers/#parallax-scrolling-factor
                // cameraPos * (1 - parallaxFactor)
                var oneMinusFactor = vector_1.Vector.One.sub(parallax.parallaxFactor);
                var parallaxOffset = this._camera.pos.scale(oneMinusFactor);
                this._graphicsContext.translate(parallaxOffset.x, parallaxOffset.y);
            }
            // Position the entity + estimate lag
            this._applyTransform(entity);
            // Optionally run the onPreDraw graphics lifecycle draw
            if (graphics.onPreDraw) {
                graphics.onPreDraw(this._graphicsContext, delta);
            }
            // TODO remove this hack on the particle redo
            var particleOpacity = (entity instanceof Particles_1.Particle) ? entity.opacity : 1;
            this._graphicsContext.opacity = graphics.opacity * particleOpacity;
            // Draw the graphics component
            this._drawGraphicsComponent(graphics);
            // Optionally run the onPostDraw graphics lifecycle draw
            if (graphics.onPostDraw) {
                graphics.onPostDraw(this._graphicsContext, delta);
            }
            this._graphicsContext.restore();
            // Reset the transform back to the original world space
            if (transform.coordPlane === coord_plane_1.CoordPlane.Screen) {
                this._graphicsContext.save();
                if (this._camera) {
                    this._camera.draw(this._graphicsContext);
                }
            }
        }
        this._graphicsContext.restore();
    };
    GraphicsSystem.prototype._drawGraphicsComponent = function (graphicsComponent) {
        var _a, _b;
        if (graphicsComponent.visible) {
            // this should be moved to the graphics system
            for (var _i = 0, _c = graphicsComponent.layers.get(); _i < _c.length; _i++) {
                var layer = _c[_i];
                for (var _d = 0, _e = layer.graphics; _d < _e.length; _d++) {
                    var _f = _e[_d], graphic = _f.graphic, options = _f.options;
                    var anchor = graphicsComponent.anchor;
                    var offset = graphicsComponent.offset;
                    if (options === null || options === void 0 ? void 0 : options.anchor) {
                        anchor = options.anchor;
                    }
                    if (options === null || options === void 0 ? void 0 : options.offset) {
                        offset = options.offset;
                    }
                    // See https://github.com/excaliburjs/Excalibur/pull/619 for discussion on this formula
                    var offsetX = -graphic.width * anchor.x + offset.x;
                    var offsetY = -graphic.height * anchor.y + offset.y;
                    graphic === null || graphic === void 0 ? void 0 : graphic.draw(this._graphicsContext, offsetX + layer.offset.x, offsetY + layer.offset.y);
                    if (((_a = this._engine) === null || _a === void 0 ? void 0 : _a.isDebug) && this._engine.debug.graphics.showBounds) {
                        var offset_1 = (0, vector_1.vec)(offsetX + layer.offset.x, offsetY + layer.offset.y);
                        if (graphic instanceof _1.GraphicsGroup) {
                            for (var _g = 0, _h = graphic.members; _g < _h.length; _g++) {
                                var g = _h[_g];
                                (_b = g.graphic) === null || _b === void 0 ? void 0 : _b.localBounds.translate(offset_1.add(g.pos)).draw(this._graphicsContext, this._engine.debug.graphics.boundsColor);
                            }
                        }
                        else {
                            /* istanbul ignore next */
                            graphic === null || graphic === void 0 ? void 0 : graphic.localBounds.translate(offset_1).draw(this._graphicsContext, this._engine.debug.graphics.boundsColor);
                        }
                    }
                }
            }
        }
    };
    /**
     * This applies the current entity transform to the graphics context
     * @param entity
     */
    GraphicsSystem.prototype._applyTransform = function (entity) {
        var ancestors = entity.getAncestors();
        for (var _i = 0, ancestors_1 = ancestors; _i < ancestors_1.length; _i++) {
            var ancestor = ancestors_1[_i];
            var transform = ancestor === null || ancestor === void 0 ? void 0 : ancestor.get(TransformComponent_1.TransformComponent);
            var optionalBody = ancestor === null || ancestor === void 0 ? void 0 : ancestor.get(BodyComponent_1.BodyComponent);
            var interpolatedPos = transform.pos;
            var interpolatedScale = transform.scale;
            var interpolatedRotation = transform.rotation;
            if (optionalBody) {
                if (this._engine.fixedUpdateFps &&
                    optionalBody.__oldTransformCaptured &&
                    optionalBody.enableFixedUpdateInterpolate) {
                    // Interpolate graphics if needed
                    var blend = this._engine.currentFrameLagMs / (1000 / this._engine.fixedUpdateFps);
                    interpolatedPos = transform.pos.scale(blend).add(optionalBody.oldPos.scale(1.0 - blend));
                    interpolatedScale = transform.scale.scale(blend).add(optionalBody.oldScale.scale(1.0 - blend));
                    // Rotational lerp https://stackoverflow.com/a/30129248
                    var cosine = (1.0 - blend) * Math.cos(optionalBody.oldRotation) + blend * Math.cos(transform.rotation);
                    var sine = (1.0 - blend) * Math.sin(optionalBody.oldRotation) + blend * Math.sin(transform.rotation);
                    interpolatedRotation = Math.atan2(sine, cosine);
                }
            }
            if (transform) {
                this._graphicsContext.z = transform.z;
                this._graphicsContext.translate(interpolatedPos.x, interpolatedPos.y);
                this._graphicsContext.scale(interpolatedScale.x, interpolatedScale.y);
                this._graphicsContext.rotate(interpolatedRotation);
            }
        }
    };
    return GraphicsSystem;
}(EntityComponentSystem_1.System));
exports.GraphicsSystem = GraphicsSystem;
