"use strict";
exports.__esModule = true;
exports.SystemManager = void 0;
var __1 = require("..");
/**
 * The SystemManager is responsible for keeping track of all systems in a scene.
 * Systems are scene specific
 */
var SystemManager = /** @class */ (function () {
    function SystemManager(_world) {
        this._world = _world;
        /**
         * List of systems, to add a new system call [[SystemManager.addSystem]]
         */
        this.systems = [];
        this.initialized = false;
    }
    /**
     * Get a system registered in the manager by type
     * @param systemType
     */
    SystemManager.prototype.get = function (systemType) {
        return this.systems.find(function (s) { return s instanceof systemType; });
    };
    /**
     * Adds a system to the manager, it will now be updated every frame
     * @param system
     */
    SystemManager.prototype.addSystem = function (system) {
        // validate system has types
        if (!system.types || system.types.length === 0) {
            throw new Error("Attempted to add a System without any types");
        }
        var query = this._world.queryManager.createQuery(system.types);
        this.systems.push(system);
        this.systems.sort(function (a, b) { return a.priority - b.priority; });
        query.register(system);
        if (this.initialized && system.initialize) {
            system.initialize(this._world.context);
        }
    };
    /**
     * Removes a system from the manager, it will no longer be updated
     * @param system
     */
    SystemManager.prototype.removeSystem = function (system) {
        __1.Util.removeItemFromArray(system, this.systems);
        var query = this._world.queryManager.getQuery(system.types);
        if (query) {
            query.unregister(system);
            this._world.queryManager.maybeRemoveQuery(query);
        }
    };
    /**
     * Initialize all systems in the manager
     *
     * Systems added after initialize() will be initialized on add
     */
    SystemManager.prototype.initialize = function () {
        if (!this.initialized) {
            this.initialized = true;
            for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.initialize) {
                    s.initialize(this._world.context);
                }
            }
        }
    };
    /**
     * Updates all systems
     * @param type whether this is an update or draw system
     * @param context context reference
     * @param delta time in milliseconds
     */
    SystemManager.prototype.updateSystems = function (type, context, delta) {
        var systems = this.systems.filter(function (s) { return s.systemType === type; });
        for (var _i = 0, systems_1 = systems; _i < systems_1.length; _i++) {
            var s = systems_1[_i];
            if (s.preupdate) {
                s.preupdate(context, delta);
            }
        }
        for (var _a = 0, systems_2 = systems; _a < systems_2.length; _a++) {
            var s = systems_2[_a];
            // Get entities that match the system types, pre-sort
            var entities = this._world.queryManager.getQuery(s.types).getEntities(s.sort);
            // Initialize entities if needed
            if (context instanceof __1.Scene) {
                for (var _b = 0, entities_1 = entities; _b < entities_1.length; _b++) {
                    var entity = entities_1[_b];
                    entity._initialize(context === null || context === void 0 ? void 0 : context.engine);
                }
            }
            s.update(entities, delta);
        }
        for (var _c = 0, systems_3 = systems; _c < systems_3.length; _c++) {
            var s = systems_3[_c];
            if (s.postupdate) {
                s.postupdate(context, delta);
            }
        }
    };
    SystemManager.prototype.clear = function () {
        for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
            var system = _a[_i];
            this.removeSystem(system);
        }
    };
    return SystemManager;
}());
exports.SystemManager = SystemManager;
