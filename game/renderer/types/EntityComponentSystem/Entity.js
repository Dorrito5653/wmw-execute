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
exports.Entity = exports.isRemovedComponent = exports.RemovedComponent = exports.isAddedComponent = exports.AddedComponent = void 0;
var Component_1 = require("./Component");
var Observable_1 = require("../Util/Observable");
var Class_1 = require("../Class");
var Events_1 = require("../Events");
var __1 = require("..");
/**
 * AddedComponent message
 */
var AddedComponent = /** @class */ (function () {
    function AddedComponent(data) {
        this.data = data;
        this.type = 'Component Added';
    }
    return AddedComponent;
}());
exports.AddedComponent = AddedComponent;
/**
 * Type guard to know if message is f an Added Component
 */
function isAddedComponent(x) {
    return !!x && x.type === 'Component Added';
}
exports.isAddedComponent = isAddedComponent;
/**
 * RemovedComponent message
 */
var RemovedComponent = /** @class */ (function () {
    function RemovedComponent(data) {
        this.data = data;
        this.type = 'Component Removed';
    }
    return RemovedComponent;
}());
exports.RemovedComponent = RemovedComponent;
/**
 * Type guard to know if message is for a Removed Component
 */
function isRemovedComponent(x) {
    return !!x && x.type === 'Component Removed';
}
exports.isRemovedComponent = isRemovedComponent;
/**
 * An Entity is the base type of anything that can have behavior in Excalibur, they are part of the built in entity component system
 *
 * Entities can be strongly typed with the components they contain
 *
 * ```typescript
 * const entity = new Entity<ComponentA | ComponentB>();
 * entity.components.a; // Type ComponentA
 * entity.components.b; // Type ComponentB
 * ```
 */
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    function Entity(components, name) {
        var _this = _super.call(this) || this;
        /**
         * The unique identifier for the entity
         */
        _this.id = Entity._ID++;
        _this._name = 'anonymous';
        /**
         * Whether this entity is active, if set to false it will be reclaimed
         */
        _this.active = true;
        /**
         * Bucket to hold on to deferred removals
         */
        _this._componentsToRemove = [];
        _this._componentTypeToInstance = new Map();
        _this._componentStringToInstance = new Map();
        _this._tagsMemo = [];
        _this._typesMemo = [];
        /**
         * Observable that keeps track of component add or remove changes on the entity
         */
        _this.componentAdded$ = new Observable_1.Observable();
        _this.componentRemoved$ = new Observable_1.Observable();
        _this._parent = null;
        _this.childrenAdded$ = new Observable_1.Observable();
        _this.childrenRemoved$ = new Observable_1.Observable();
        _this._children = [];
        _this._isInitialized = false;
        _this._setName(name);
        if (components) {
            for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
                var component = components_1[_i];
                _this.addComponent(component);
            }
        }
        return _this;
    }
    Entity.prototype._setName = function (name) {
        if (name) {
            this._name = name;
        }
    };
    Object.defineProperty(Entity.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "events", {
        get: function () {
            return this.eventDispatcher;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Kill the entity, means it will no longer be updated. Kills are deferred to the end of the update.
     */
    Entity.prototype.kill = function () {
        this.active = false;
    };
    Entity.prototype.isKilled = function () {
        return !this.active;
    };
    Object.defineProperty(Entity.prototype, "tags", {
        /**
         * Specifically get the tags on the entity from [[TagComponent]]
         */
        get: function () {
            return this._tagsMemo;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Check if a tag exists on the entity
     * @param tag name to check for
     */
    Entity.prototype.hasTag = function (tag) {
        return this.tags.includes(tag);
    };
    /**
     * Adds a tag to an entity
     * @param tag
     * @returns Entity
     */
    Entity.prototype.addTag = function (tag) {
        return this.addComponent(new Component_1.TagComponent(tag));
    };
    /**
     * Removes a tag on the entity
     *
     * Removals are deferred until the end of update
     * @param tag
     * @param force Remove component immediately, no deferred
     */
    Entity.prototype.removeTag = function (tag, force) {
        if (force === void 0) { force = false; }
        return this.removeComponent(tag, force);
    };
    Object.defineProperty(Entity.prototype, "types", {
        /**
         * The types of the components on the Entity
         */
        get: function () {
            return this._typesMemo;
        },
        enumerable: false,
        configurable: true
    });
    Entity.prototype._rebuildMemos = function () {
        this._tagsMemo = Array.from(this._componentStringToInstance.values())
            .filter(function (c) { return c instanceof Component_1.TagComponent; })
            .map(function (c) { return c.type; });
        this._typesMemo = Array.from(this._componentStringToInstance.keys());
    };
    Entity.prototype.getComponents = function () {
        return Array.from(this._componentStringToInstance.values());
    };
    Entity.prototype._notifyAddComponent = function (component) {
        this._rebuildMemos();
        var added = new AddedComponent({
            component: component,
            entity: this
        });
        this.componentAdded$.notifyAll(added);
    };
    Entity.prototype._notifyRemoveComponent = function (component) {
        var removed = new RemovedComponent({
            component: component,
            entity: this
        });
        this.componentRemoved$.notifyAll(removed);
        this._rebuildMemos();
    };
    Object.defineProperty(Entity.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "children", {
        /**
         * Get the direct children of this entity
         */
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Unparents this entity, if there is a parent. Otherwise it does nothing.
     */
    Entity.prototype.unparent = function () {
        if (this._parent) {
            this._parent.removeChild(this);
            this._parent = null;
        }
    };
    /**
     * Adds an entity to be a child of this entity
     * @param entity
     */
    Entity.prototype.addChild = function (entity) {
        if (entity.parent === null) {
            if (this.getAncestors().includes(entity)) {
                throw new Error('Cycle detected, cannot add entity');
            }
            this._children.push(entity);
            entity._parent = this;
            this.childrenAdded$.notifyAll(entity);
        }
        else {
            throw new Error('Entity already has a parent, cannot add without unparenting');
        }
        return this;
    };
    /**
     * Remove an entity from children if it exists
     * @param entity
     */
    Entity.prototype.removeChild = function (entity) {
        if (entity.parent === this) {
            __1.Util.removeItemFromArray(entity, this._children);
            entity._parent = null;
            this.childrenRemoved$.notifyAll(entity);
        }
        return this;
    };
    /**
     * Removes all children from this entity
     */
    Entity.prototype.removeAllChildren = function () {
        var _this = this;
        this.children.forEach(function (c) {
            _this.removeChild(c);
        });
        return this;
    };
    /**
     * Returns a list of parent entities starting with the topmost parent. Includes the current entity.
     */
    Entity.prototype.getAncestors = function () {
        var result = [this];
        var current = this.parent;
        while (current) {
            result.push(current);
            current = current.parent;
        }
        return result.reverse();
    };
    /**
     * Returns a list of all the entities that descend from this entity. Includes the current entity.
     */
    Entity.prototype.getDescendants = function () {
        var result = [this];
        var queue = [this];
        while (queue.length > 0) {
            var curr = queue.pop();
            queue = queue.concat(curr.children);
            result = result.concat(curr.children);
        }
        return result;
    };
    /**
     * Creates a deep copy of the entity and a copy of all its components
     */
    Entity.prototype.clone = function () {
        var newEntity = new Entity();
        for (var _i = 0, _a = this.types; _i < _a.length; _i++) {
            var c = _a[_i];
            newEntity.addComponent(this.get(c).clone());
        }
        for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
            var child = _c[_b];
            newEntity.addChild(child.clone());
        }
        return newEntity;
    };
    /**
     * Adds a copy of all the components from another template entity as a "prefab"
     * @param templateEntity Entity to use as a template
     * @param force Force component replacement if it already exists on the target entity
     */
    Entity.prototype.addTemplate = function (templateEntity, force) {
        if (force === void 0) { force = false; }
        for (var _i = 0, _a = templateEntity.getComponents(); _i < _a.length; _i++) {
            var c = _a[_i];
            this.addComponent(c.clone(), force);
        }
        for (var _b = 0, _c = templateEntity.children; _b < _c.length; _b++) {
            var child = _c[_b];
            this.addChild(child.clone().addTemplate(child));
        }
        return this;
    };
    /**
     * Adds a component to the entity
     * @param component Component or Entity to add copy of components from
     * @param force Optionally overwrite any existing components of the same type
     */
    Entity.prototype.addComponent = function (component, force) {
        if (force === void 0) { force = false; }
        // if component already exists, skip if not forced
        if (this.has(component.type)) {
            if (force) {
                // Remove existing component type if exists when forced
                this.removeComponent(component);
            }
            else {
                // early exit component exits
                return this;
            }
        }
        // TODO circular dependencies will be a problem
        if (component.dependencies && component.dependencies.length) {
            for (var _i = 0, _a = component.dependencies; _i < _a.length; _i++) {
                var ctor = _a[_i];
                this.addComponent(new ctor());
            }
        }
        component.owner = this;
        var constuctorType = component.constructor;
        this._componentTypeToInstance.set(constuctorType, component);
        this._componentStringToInstance.set(component.type, component);
        if (component.onAdd) {
            component.onAdd(this);
        }
        this._notifyAddComponent(component);
        return this;
    };
    /**
     * Removes a component from the entity, by default removals are deferred to the end of entity update to avoid consistency issues
     *
     * Components can be force removed with the `force` flag, the removal is not deferred and happens immediately
     * @param componentOrType
     * @param force
     */
    Entity.prototype.removeComponent = function (componentOrType, force) {
        if (force === void 0) { force = false; }
        if (force) {
            if (typeof componentOrType === 'string') {
                this._removeComponentByType(componentOrType);
            }
            else if (componentOrType instanceof Component_1.Component) {
                this._removeComponentByType(componentOrType.type);
            }
        }
        else {
            this._componentsToRemove.push(componentOrType);
        }
        return this;
    };
    Entity.prototype._removeComponentByType = function (type) {
        if (this.has(type)) {
            var component = this.get(type);
            component.owner = null;
            if (component.onRemove) {
                component.onRemove(this);
            }
            var ctor = component.constructor;
            this._componentTypeToInstance["delete"](ctor);
            this._componentStringToInstance["delete"](component.type);
            this._notifyRemoveComponent(component);
        }
    };
    /**
     * @hidden
     * @internal
     */
    Entity.prototype.processComponentRemoval = function () {
        for (var _i = 0, _a = this._componentsToRemove; _i < _a.length; _i++) {
            var componentOrType = _a[_i];
            var type = typeof componentOrType === 'string' ? componentOrType : componentOrType.type;
            this._removeComponentByType(type);
        }
        this._componentsToRemove.length = 0;
    };
    Entity.prototype.has = function (type) {
        if (typeof type === 'string') {
            return this._componentStringToInstance.has(type);
        }
        else {
            return this._componentTypeToInstance.has(type);
        }
    };
    Entity.prototype.get = function (type) {
        if (typeof type === 'string') {
            return this._componentStringToInstance.get(type);
        }
        else {
            return this._componentTypeToInstance.get(type);
        }
    };
    Object.defineProperty(Entity.prototype, "isInitialized", {
        /**
         * Gets whether the actor is Initialized
         */
        get: function () {
            return this._isInitialized;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initializes this entity, meant to be called by the Scene before first update not by users of Excalibur.
     *
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * @internal
     */
    Entity.prototype._initialize = function (engine) {
        if (!this.isInitialized) {
            this.onInitialize(engine);
            _super.prototype.emit.call(this, 'initialize', new Events_1.InitializeEvent(engine, this));
            this._isInitialized = true;
        }
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPreUpdate]] lifecycle event
     * @internal
     */
    Entity.prototype._preupdate = function (engine, delta) {
        this.emit('preupdate', new Events_1.PreUpdateEvent(engine, delta, this));
        this.onPreUpdate(engine, delta);
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPostUpdate]] lifecycle event
     * @internal
     */
    Entity.prototype._postupdate = function (engine, delta) {
        this.emit('postupdate', new Events_1.PostUpdateEvent(engine, delta, this));
        this.onPostUpdate(engine, delta);
    };
    /**
     * `onInitialize` is called before the first update of the entity. This method is meant to be
     * overridden.
     *
     * Synonymous with the event handler `.on('initialize', (evt) => {...})`
     */
    Entity.prototype.onInitialize = function (_engine) {
        // Override me
    };
    /**
     * Safe to override onPreUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreUpdate` is called directly before an entity is updated.
     */
    Entity.prototype.onPreUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     * Safe to override onPostUpdate lifecycle event handler. Synonymous with `.on('postupdate', (evt) =>{...})`
     *
     * `onPostUpdate` is called directly after an entity is updated.
     */
    Entity.prototype.onPostUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     *
     * Entity update lifecycle, called internally
     *
     * @internal
     * @param engine
     * @param delta
     */
    Entity.prototype.update = function (engine, delta) {
        this._initialize(engine);
        this._preupdate(engine, delta);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.update(engine, delta);
        }
        this._postupdate(engine, delta);
    };
    Entity._ID = 0;
    return Entity;
}(Class_1.Class));
exports.Entity = Entity;
