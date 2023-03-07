"use strict";
exports.__esModule = true;
exports.EntityManager = void 0;
var Entity_1 = require("./Entity");
var __1 = require("..");
// Add/Remove entities and components
var EntityManager = /** @class */ (function () {
    function EntityManager(_world) {
        this._world = _world;
        this.entities = [];
        this._entityIndex = {};
        this._entitiesToRemove = [];
    }
    /**
     * Runs the entity lifecycle
     * @param _context
     */
    EntityManager.prototype.updateEntities = function (_context, elapsed) {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            // TODO is this right?
            entity.update(_context.engine, elapsed);
            if (!entity.active) {
                this.removeEntity(entity);
            }
        }
    };
    EntityManager.prototype.findEntitiesForRemoval = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            if (!entity.active) {
                this.removeEntity(entity);
            }
        }
    };
    /**
     * EntityManager observes changes on entities
     * @param message
     */
    EntityManager.prototype.notify = function (message) {
        if ((0, Entity_1.isAddedComponent)(message)) {
            // we don't need the component, it's already on the entity
            this._world.queryManager.addEntity(message.data.entity);
        }
        if ((0, Entity_1.isRemovedComponent)(message)) {
            this._world.queryManager.removeComponent(message.data.entity, message.data.component);
        }
    };
    /**
     * Adds an entity to be tracked by the EntityManager
     * @param entity
     */
    EntityManager.prototype.addEntity = function (entity) {
        var _this = this;
        entity.active = true;
        if (entity && !this._entityIndex[entity.id]) {
            this._entityIndex[entity.id] = entity;
            this.entities.push(entity);
            this._world.queryManager.addEntity(entity);
            entity.componentAdded$.register(this);
            entity.componentRemoved$.register(this);
            // if entity has children
            entity.children.forEach(function (c) { return _this.addEntity(c); });
            entity.childrenAdded$.register({
                notify: function (e) {
                    _this.addEntity(e);
                }
            });
            entity.childrenRemoved$.register({
                notify: function (e) {
                    _this.removeEntity(e, false);
                }
            });
        }
    };
    EntityManager.prototype.removeEntity = function (idOrEntity, deferred) {
        var _this = this;
        var _a;
        if (deferred === void 0) { deferred = true; }
        var id = 0;
        if (idOrEntity instanceof Entity_1.Entity) {
            id = idOrEntity.id;
        }
        else {
            id = idOrEntity;
        }
        var entity = this._entityIndex[id];
        if (entity && entity.active) {
            entity.kill();
        }
        if (entity && deferred) {
            this._entitiesToRemove.push(entity);
            return;
        }
        delete this._entityIndex[id];
        if (entity) {
            __1.Util.removeItemFromArray(entity, this.entities);
            this._world.queryManager.removeEntity(entity);
            entity.componentAdded$.unregister(this);
            entity.componentRemoved$.unregister(this);
            // if entity has children
            entity.children.forEach(function (c) { return _this.removeEntity(c, deferred); });
            entity.childrenAdded$.clear();
            entity.childrenRemoved$.clear();
            // stats
            if ((_a = this._world.context) === null || _a === void 0 ? void 0 : _a.engine) {
                this._world.context.engine.stats.currFrame.actors.killed++;
            }
        }
    };
    EntityManager.prototype.processEntityRemovals = function () {
        for (var _i = 0, _a = this._entitiesToRemove; _i < _a.length; _i++) {
            var entity = _a[_i];
            if (entity.active) {
                continue;
            }
            this.removeEntity(entity, false);
        }
    };
    EntityManager.prototype.processComponentRemovals = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            entity.processComponentRemoval();
        }
    };
    EntityManager.prototype.getById = function (id) {
        return this._entityIndex[id];
    };
    EntityManager.prototype.getByName = function (name) {
        return this.entities.filter(function (e) { return e.name === name; });
    };
    EntityManager.prototype.clear = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            this.removeEntity(entity);
        }
    };
    return EntityManager;
}());
exports.EntityManager = EntityManager;
