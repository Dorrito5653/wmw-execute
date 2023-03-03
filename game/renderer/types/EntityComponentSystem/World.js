"use strict";
exports.__esModule = true;
exports.World = void 0;
var Entity_1 = require("./Entity");
var EntityManager_1 = require("./EntityManager");
var QueryManager_1 = require("./QueryManager");
var System_1 = require("./System");
var SystemManager_1 = require("./SystemManager");
/**
 * The World is a self-contained entity component system for a particular context.
 */
var World = /** @class */ (function () {
    /**
     * The context type is passed to the system updates
     * @param context
     */
    function World(context) {
        this.context = context;
        this.queryManager = new QueryManager_1.QueryManager(this);
        this.entityManager = new EntityManager_1.EntityManager(this);
        this.systemManager = new SystemManager_1.SystemManager(this);
    }
    /**
     * Update systems by type and time elapsed in milliseconds
     */
    World.prototype.update = function (type, delta) {
        if (type === System_1.SystemType.Update) {
            this.entityManager.updateEntities(this.context, delta);
        }
        this.systemManager.updateSystems(type, this.context, delta);
        this.entityManager.findEntitiesForRemoval();
        this.entityManager.processComponentRemovals();
        this.entityManager.processEntityRemovals();
    };
    World.prototype.add = function (entityOrSystem) {
        if (entityOrSystem instanceof Entity_1.Entity) {
            this.entityManager.addEntity(entityOrSystem);
        }
        if (entityOrSystem instanceof System_1.System) {
            this.systemManager.addSystem(entityOrSystem);
        }
    };
    World.prototype.remove = function (entityOrSystem, deferred) {
        if (deferred === void 0) { deferred = true; }
        if (entityOrSystem instanceof Entity_1.Entity) {
            this.entityManager.removeEntity(entityOrSystem, deferred);
        }
        if (entityOrSystem instanceof System_1.System) {
            this.systemManager.removeSystem(entityOrSystem);
        }
    };
    World.prototype.clearEntities = function () {
        this.entityManager.clear();
    };
    World.prototype.clearSystems = function () {
        this.systemManager.clear();
    };
    return World;
}());
exports.World = World;
