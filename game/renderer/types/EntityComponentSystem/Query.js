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
exports.Query = void 0;
var Entity_1 = require("./Entity");
var Util_1 = require("./Util");
var Observable_1 = require("../Util/Observable");
var __1 = require("..");
var System_1 = require("./System");
/**
 * Represents query for entities that match a list of types that is cached and observable
 *
 * Queries can be strongly typed by supplying a type union in the optional type parameter
 * ```typescript
 * const queryAB = new ex.Query<ComponentTypeA | ComponentTypeB>(['A', 'B']);
 * ```
 */
var Query = /** @class */ (function (_super) {
    __extends(Query, _super);
    function Query(types) {
        var _this = _super.call(this) || this;
        _this._entities = [];
        if (types[0] instanceof Function) {
            _this.types = types.map(function (T) { return (new T).type; });
        }
        else {
            _this.types = types;
        }
        return _this;
    }
    Object.defineProperty(Query.prototype, "key", {
        get: function () {
            if (this._key) {
                return this._key;
            }
            return (this._key = (0, Util_1.buildTypeKey)(this.types));
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a list of entities that match the query
     *
     * @param sort Optional sorting function to sort entities returned from the query
     */
    Query.prototype.getEntities = function (sort) {
        if (sort) {
            this._entities.sort(sort);
        }
        return this._entities;
    };
    /**
     * Add an entity to the query, will only be added if the entity matches the query types
     * @param entity
     */
    Query.prototype.addEntity = function (entity) {
        if (!__1.Util.contains(this._entities, entity) && this.matches(entity)) {
            this._entities.push(entity);
            this.notifyAll(new System_1.AddedEntity(entity));
        }
    };
    /**
     * If the entity is part of the query it will be removed regardless of types
     * @param entity
     */
    Query.prototype.removeEntity = function (entity) {
        if (__1.Util.removeItemFromArray(entity, this._entities)) {
            this.notifyAll(new System_1.RemovedEntity(entity));
        }
    };
    /**
     * Removes all entities and observers from the query
     */
    Query.prototype.clear = function () {
        this._entities.length = 0;
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            this.unregister(observer);
        }
    };
    Query.prototype.matches = function (typesOrEntity) {
        var types = [];
        if (typesOrEntity instanceof Entity_1.Entity) {
            types = typesOrEntity.types;
        }
        else {
            types = typesOrEntity;
        }
        var matches = true;
        for (var _i = 0, _a = this.types; _i < _a.length; _i++) {
            var type = _a[_i];
            matches = matches && types.indexOf(type) > -1;
            if (!matches) {
                return false;
            }
        }
        return matches;
    };
    Query.prototype.contain = function (type) {
        return this.types.indexOf(type) > -1;
    };
    return Query;
}(Observable_1.Observable));
exports.Query = Query;
