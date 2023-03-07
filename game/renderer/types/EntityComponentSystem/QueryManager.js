"use strict";
exports.__esModule = true;
exports.QueryManager = void 0;
var Util_1 = require("./Util");
var Query_1 = require("./Query");
/**
 * The query manager is responsible for updating all queries when entities/components change
 */
var QueryManager = /** @class */ (function () {
    function QueryManager(_world) {
        this._world = _world;
        this._queries = {};
    }
    /**
     * Adds a query to the manager and populates with any entities that match
     * @param query
     */
    QueryManager.prototype._addQuery = function (query) {
        this._queries[(0, Util_1.buildTypeKey)(query.types)] = query;
        for (var _i = 0, _a = this._world.entityManager.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            query.addEntity(entity);
        }
    };
    /**
     * Removes the query if there are no observers left
     * @param query
     */
    QueryManager.prototype.maybeRemoveQuery = function (query) {
        if (query.observers.length === 0) {
            query.clear();
            delete this._queries[(0, Util_1.buildTypeKey)(query.types)];
        }
    };
    /**
     * Adds the entity to any matching query in the query manage
     * @param entity
     */
    QueryManager.prototype.addEntity = function (entity) {
        for (var queryType in this._queries) {
            if (this._queries[queryType]) {
                this._queries[queryType].addEntity(entity);
            }
        }
    };
    /**
     * Removes an entity from queries if the removed component disqualifies it
     * @param entity
     * @param component
     */
    QueryManager.prototype.removeComponent = function (entity, component) {
        for (var queryType in this._queries) {
            // If the component being removed from an entity is a part of a query,
            // it is now disqualified from that query, remove it
            if (this._queries[queryType].contain(component.type)) {
                this._queries[queryType].removeEntity(entity);
            }
        }
    };
    /**
     * Removes an entity from all queries it is currently a part of
     * @param entity
     */
    QueryManager.prototype.removeEntity = function (entity) {
        for (var queryType in this._queries) {
            this._queries[queryType].removeEntity(entity);
        }
    };
    /**
     * Creates a populated query and returns, if the query already exists that will be returned instead of a new instance
     * @param types
     */
    QueryManager.prototype.createQuery = function (types) {
        var maybeExistingQuery = this.getQuery(types);
        if (maybeExistingQuery) {
            return maybeExistingQuery;
        }
        var query = new Query_1.Query(types);
        this._addQuery(query);
        return query;
    };
    /**
     * Retrieves an existing query by types if it exists otherwise returns null
     * @param types
     */
    QueryManager.prototype.getQuery = function (types) {
        var key = (0, Util_1.buildTypeKey)(types);
        if (this._queries[key]) {
            return this._queries[key];
        }
        return null;
    };
    return QueryManager;
}());
exports.QueryManager = QueryManager;
