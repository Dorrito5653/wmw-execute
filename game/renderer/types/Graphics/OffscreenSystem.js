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
exports.OffscreenSystem = void 0;
var GraphicsComponent_1 = require("./GraphicsComponent");
var Events_1 = require("../Events");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
var System_1 = require("../EntityComponentSystem/System");
var ParallaxComponent_1 = require("./ParallaxComponent");
var vector_1 = require("../Math/vector");
var coord_plane_1 = require("../Math/coord-plane");
var OffscreenSystem = /** @class */ (function (_super) {
    __extends(OffscreenSystem, _super);
    function OffscreenSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.transform', 'ex.graphics'];
        _this.systemType = System_1.SystemType.Draw;
        _this.priority = -1;
        return _this;
    }
    OffscreenSystem.prototype.initialize = function (scene) {
        this._camera = scene.camera;
    };
    OffscreenSystem.prototype.update = function (entities) {
        var transform;
        var graphics;
        var maybeParallax;
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var entity = entities_1[_i];
            graphics = entity.get(GraphicsComponent_1.GraphicsComponent);
            transform = entity.get(TransformComponent_1.TransformComponent);
            maybeParallax = entity.get(ParallaxComponent_1.ParallaxComponent);
            var parallaxOffset = void 0;
            if (maybeParallax) {
                // We use the Tiled formula
                // https://doc.mapeditor.org/en/latest/manual/layers/#parallax-scrolling-factor
                // cameraPos * (1 - parallaxFactor)
                var oneMinusFactor = vector_1.Vector.One.sub(maybeParallax.parallaxFactor);
                parallaxOffset = this._camera.pos.scale(oneMinusFactor);
            }
            // Figure out if entities are offscreen
            var entityOffscreen = this._isOffscreen(transform, graphics, parallaxOffset);
            if (entityOffscreen && !entity.hasTag('ex.offscreen')) {
                entity.eventDispatcher.emit('exitviewport', new Events_1.ExitViewPortEvent(entity));
                entity.addTag('ex.offscreen');
            }
            if (!entityOffscreen && entity.hasTag('ex.offscreen')) {
                entity.eventDispatcher.emit('enterviewport', new Events_1.EnterViewPortEvent(entity));
                entity.removeTag('ex.offscreen');
            }
        }
    };
    OffscreenSystem.prototype._isOffscreen = function (transform, graphics, parallaxOffset) {
        if (transform.coordPlane === coord_plane_1.CoordPlane.World) {
            var bounds = graphics.localBounds;
            if (parallaxOffset) {
                bounds = bounds.translate(parallaxOffset);
            }
            var transformedBounds = bounds.transform(transform.get().matrix);
            var graphicsOffscreen = !this._camera.viewport.overlaps(transformedBounds);
            return graphicsOffscreen;
        }
        else {
            // TODO screen coordinates
            return false;
        }
    };
    return OffscreenSystem;
}(System_1.System));
exports.OffscreenSystem = OffscreenSystem;
