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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.PointerSystem = void 0;
var ColliderComponent_1 = require("../Collision/ColliderComponent");
var EntityComponentSystem_1 = require("../EntityComponentSystem");
var GraphicsComponent_1 = require("../Graphics/GraphicsComponent");
var PointerComponent_1 = require("./PointerComponent");
var coord_plane_1 = require("../Math/coord-plane");
/**
 * The PointerSystem is responsible for dispatching pointer events to entities
 * that need them.
 *
 * The PointerSystem can be optionally configured by the [[PointerComponent]], by default Entities use
 * the [[Collider]]'s shape for pointer events.
 */
var PointerSystem = /** @class */ (function (_super) {
    __extends(PointerSystem, _super);
    function PointerSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.transform', 'ex.pointer'];
        _this.systemType = EntityComponentSystem_1.SystemType.Update;
        _this.priority = -1;
        /**
         * Optionally override component configuration for all entities
         */
        _this.overrideUseColliderShape = false;
        /**
         * Optionally override component configuration for all entities
         */
        _this.overrideUseGraphicsBounds = false;
        _this.lastFrameEntityToPointers = new Map();
        _this.currentFrameEntityToPointers = new Map();
        _this._sortedTransforms = [];
        _this._sortedEntities = [];
        _this._zHasChanged = false;
        _this._zIndexUpdate = function () {
            _this._zHasChanged = true;
        };
        return _this;
    }
    PointerSystem.prototype.initialize = function (scene) {
        this._engine = scene.engine;
    };
    PointerSystem.prototype.preupdate = function () {
        // event receiver might change per frame
        this._receiver = this._engine.input.pointers;
        if (this._zHasChanged) {
            this._sortedTransforms.sort(function (a, b) {
                return b.z - a.z;
            });
            this._sortedEntities = this._sortedTransforms.map(function (t) { return t.owner; });
            this._zHasChanged = false;
        }
    };
    PointerSystem.prototype.notify = function (entityAddedOrRemoved) {
        if ((0, EntityComponentSystem_1.isAddedSystemEntity)(entityAddedOrRemoved)) {
            var tx = entityAddedOrRemoved.data.get(EntityComponentSystem_1.TransformComponent);
            this._sortedTransforms.push(tx);
            this._sortedEntities.push(tx.owner);
            tx.zIndexChanged$.subscribe(this._zIndexUpdate);
            this._zHasChanged = true;
        }
        else {
            var tx = entityAddedOrRemoved.data.get(EntityComponentSystem_1.TransformComponent);
            tx.zIndexChanged$.unsubscribe(this._zIndexUpdate);
            var index = this._sortedTransforms.indexOf(tx);
            if (index > -1) {
                this._sortedTransforms.splice(index, 1);
                this._sortedEntities.splice(index, 1);
            }
        }
    };
    PointerSystem.prototype.entityCurrentlyUnderPointer = function (entity, pointerId) {
        return this.currentFrameEntityToPointers.has(entity.id) &&
            this.currentFrameEntityToPointers.get(entity.id).includes(pointerId);
    };
    PointerSystem.prototype.entityWasUnderPointer = function (entity, pointerId) {
        return this.lastFrameEntityToPointers.has(entity.id) &&
            this.lastFrameEntityToPointers.get(entity.id).includes(pointerId);
    };
    PointerSystem.prototype.entered = function (entity, pointerId) {
        return this.entityCurrentlyUnderPointer(entity, pointerId) &&
            !this.lastFrameEntityToPointers.has(entity.id);
    };
    PointerSystem.prototype.left = function (entity, pointerId) {
        return !this.currentFrameEntityToPointers.has(entity.id) &&
            this.entityWasUnderPointer(entity, pointerId);
    };
    PointerSystem.prototype.addPointerToEntity = function (entity, pointerId) {
        if (!this.currentFrameEntityToPointers.has(entity.id)) {
            this.currentFrameEntityToPointers.set(entity.id, [pointerId]);
            return;
        }
        var pointers = this.currentFrameEntityToPointers.get(entity.id);
        this.currentFrameEntityToPointers.set(entity.id, pointers.concat(pointerId));
    };
    PointerSystem.prototype.update = function (_entities) {
        // Locate all the pointer/entity mappings
        this._processPointerToEntity(this._sortedEntities);
        // Dispatch pointer events on entities
        this._dispatchEvents(this._sortedEntities);
        // Clear last frame's events
        this._receiver.update();
        this.lastFrameEntityToPointers.clear();
        this.lastFrameEntityToPointers = new Map(this.currentFrameEntityToPointers);
        this.currentFrameEntityToPointers.clear();
        this._receiver.clear();
    };
    PointerSystem.prototype._processPointerToEntity = function (entities) {
        var _a;
        var transform;
        var collider;
        var graphics;
        var pointer;
        // TODO probably a spatial partition optimization here to quickly query bounds for pointer
        // doesn't seem to cause issues tho for perf
        // Pre-process find entities under pointers
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var entity = entities_1[_i];
            transform = entity.get(EntityComponentSystem_1.TransformComponent);
            pointer = (_a = entity.get(PointerComponent_1.PointerComponent)) !== null && _a !== void 0 ? _a : new PointerComponent_1.PointerComponent;
            // Check collider contains pointer
            collider = entity.get(ColliderComponent_1.ColliderComponent);
            if (collider && (pointer.useColliderShape || this.overrideUseColliderShape)) {
                collider.update();
                var geom = collider.get();
                if (geom) {
                    for (var _b = 0, _c = this._receiver.currentFramePointerCoords.entries(); _b < _c.length; _b++) {
                        var _d = _c[_b], pointerId = _d[0], pos = _d[1];
                        if (geom.contains(transform.coordPlane === coord_plane_1.CoordPlane.World ? pos.worldPos : pos.screenPos)) {
                            this.addPointerToEntity(entity, pointerId);
                        }
                    }
                }
            }
            // Check graphics contains pointer
            graphics = entity.get(GraphicsComponent_1.GraphicsComponent);
            if (graphics && (pointer.useGraphicsBounds || this.overrideUseGraphicsBounds)) {
                var graphicBounds = graphics.localBounds.transform(transform.get().matrix);
                for (var _e = 0, _f = this._receiver.currentFramePointerCoords.entries(); _e < _f.length; _e++) {
                    var _g = _f[_e], pointerId = _g[0], pos = _g[1];
                    if (graphicBounds.contains(transform.coordPlane === coord_plane_1.CoordPlane.World ? pos.worldPos : pos.screenPos)) {
                        this.addPointerToEntity(entity, pointerId);
                    }
                }
            }
        }
    };
    PointerSystem.prototype._processDownAndEmit = function (entity) {
        var lastDownPerPointer = new Map();
        // Loop through down and dispatch to entities
        for (var _i = 0, _a = this._receiver.currentFrameDown; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            if (event_1.active && entity.active && this.entityCurrentlyUnderPointer(entity, event_1.pointerId)) {
                entity.events.emit('pointerdown', event_1);
                if (this._receiver.isDragStart(event_1.pointerId)) {
                    entity.events.emit('pointerdragstart', event_1);
                }
            }
            lastDownPerPointer.set(event_1.pointerId, event_1);
        }
        return lastDownPerPointer;
    };
    PointerSystem.prototype._processUpAndEmit = function (entity) {
        var lastUpPerPointer = new Map();
        // Loop through up and dispatch to entities
        for (var _i = 0, _a = this._receiver.currentFrameUp; _i < _a.length; _i++) {
            var event_2 = _a[_i];
            if (event_2.active && entity.active && this.entityCurrentlyUnderPointer(entity, event_2.pointerId)) {
                entity.events.emit('pointerup', event_2);
                if (this._receiver.isDragEnd(event_2.pointerId)) {
                    entity.events.emit('pointerdragend', event_2);
                }
            }
            lastUpPerPointer.set(event_2.pointerId, event_2);
        }
        return lastUpPerPointer;
    };
    PointerSystem.prototype._processMoveAndEmit = function (entity) {
        var lastMovePerPointer = new Map();
        // Loop through move and dispatch to entities
        for (var _i = 0, _a = this._receiver.currentFrameMove; _i < _a.length; _i++) {
            var event_3 = _a[_i];
            if (event_3.active && entity.active && this.entityCurrentlyUnderPointer(entity, event_3.pointerId)) {
                // move
                entity.events.emit('pointermove', event_3);
                if (this._receiver.isDragging(event_3.pointerId)) {
                    entity.events.emit('pointerdragmove', event_3);
                }
            }
            lastMovePerPointer.set(event_3.pointerId, event_3);
        }
        return lastMovePerPointer;
    };
    PointerSystem.prototype._processEnterLeaveAndEmit = function (entity, lastUpDownMoveEvents) {
        // up, down, and move are considered for enter and leave
        for (var _i = 0, lastUpDownMoveEvents_1 = lastUpDownMoveEvents; _i < lastUpDownMoveEvents_1.length; _i++) {
            var event_4 = lastUpDownMoveEvents_1[_i];
            // enter
            if (event_4.active && entity.active && this.entered(entity, event_4.pointerId)) {
                entity.events.emit('pointerenter', event_4);
                if (this._receiver.isDragging(event_4.pointerId)) {
                    entity.events.emit('pointerdragenter', event_4);
                }
                break;
            }
            if (event_4.active && entity.active &&
                // leave can happen on move
                (this.left(entity, event_4.pointerId) ||
                    // or leave can happen on pointer up
                    (this.entityCurrentlyUnderPointer(entity, event_4.pointerId) && event_4.type === 'up'))) {
                entity.events.emit('pointerleave', event_4);
                if (this._receiver.isDragging(event_4.pointerId)) {
                    entity.events.emit('pointerdragleave', event_4);
                }
                break;
            }
        }
    };
    PointerSystem.prototype._processCancelAndEmit = function (entity) {
        // cancel
        for (var _i = 0, _a = this._receiver.currentFrameCancel; _i < _a.length; _i++) {
            var event_5 = _a[_i];
            if (event_5.active && entity.active && this.entityCurrentlyUnderPointer(entity, event_5.pointerId)) {
                entity.events.emit('pointercancel', event_5);
            }
        }
    };
    PointerSystem.prototype._processWheelAndEmit = function (entity) {
        // wheel
        for (var _i = 0, _a = this._receiver.currentFrameWheel; _i < _a.length; _i++) {
            var event_6 = _a[_i];
            // Currently the wheel only fires under the primary pointer '0'
            if (event_6.active && entity.active && this.entityCurrentlyUnderPointer(entity, 0)) {
                entity.events.emit('pointerwheel', event_6);
            }
        }
    };
    PointerSystem.prototype._dispatchEvents = function (entities) {
        var lastFrameEntities = new Set(this.lastFrameEntityToPointers.keys());
        var currentFrameEntities = new Set(this.currentFrameEntityToPointers.keys());
        // Filter preserves z order
        var entitiesWithEvents = entities.filter(function (e) { return lastFrameEntities.has(e.id) || currentFrameEntities.has(e.id); });
        var lastMovePerPointer;
        var lastUpPerPointer;
        var lastDownPerPointer;
        // Dispatch events in entity z order
        for (var _i = 0, entitiesWithEvents_1 = entitiesWithEvents; _i < entitiesWithEvents_1.length; _i++) {
            var entity = entitiesWithEvents_1[_i];
            lastDownPerPointer = this._processDownAndEmit(entity);
            lastUpPerPointer = this._processUpAndEmit(entity);
            lastMovePerPointer = this._processMoveAndEmit(entity);
            var lastUpDownMoveEvents = __spreadArray(__spreadArray(__spreadArray([], lastMovePerPointer.values(), true), lastDownPerPointer.values(), true), lastUpPerPointer.values(), true);
            this._processEnterLeaveAndEmit(entity, lastUpDownMoveEvents);
            this._processCancelAndEmit(entity);
            this._processWheelAndEmit(entity);
        }
    };
    return PointerSystem;
}(EntityComponentSystem_1.System));
exports.PointerSystem = PointerSystem;
