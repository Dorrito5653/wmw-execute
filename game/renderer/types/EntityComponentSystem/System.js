"use strict";
exports.__esModule = true;
exports.isRemoveSystemEntity = exports.RemovedEntity = exports.isAddedSystemEntity = exports.AddedEntity = exports.System = exports.SystemType = void 0;
/**
 * Enum that determines whether to run the system in the update or draw phase
 */
var SystemType;
(function (SystemType) {
    SystemType["Update"] = "update";
    SystemType["Draw"] = "draw";
})(SystemType = exports.SystemType || (exports.SystemType = {}));
/**
 * An Excalibur [[System]] that updates entities of certain types.
 * Systems are scene specific
 *
 * Excalibur Systems currently require at least 1 Component type to operated
 *
 * Multiple types are declared as a type union
 * For example:
 *
 * ```typescript
 * class MySystem extends System<ComponentA | ComponentB> {
 *   public readonly types = ['a', 'b'] as const;
 *   public readonly systemType = SystemType.Update;
 *   public update(entities: Entity<ComponentA | ComponentB>) {
 *      ...
 *   }
 * }
 * ```
 */
var System = /** @class */ (function () {
    function System() {
        /**
         * System can execute in priority order, by default all systems are priority 0. Lower values indicated higher priority.
         * For a system to execute before all other a lower priority value (-1 for example) must be set.
         * For a system to execute after all other a higher priority value (10 for example) must be set.
         */
        this.priority = 0;
    }
    /**
     * Systems observe when entities match their types or no longer match their types, override
     * @param _entityAddedOrRemoved
     */
    System.prototype.notify = function (_entityAddedOrRemoved) {
        // Override me
    };
    return System;
}());
exports.System = System;
/**
 * An [[Entity]] with [[Component]] types that matches a [[System]] types exists in the current scene.
 */
var AddedEntity = /** @class */ (function () {
    function AddedEntity(data) {
        this.data = data;
        this.type = 'Entity Added';
    }
    return AddedEntity;
}());
exports.AddedEntity = AddedEntity;
/**
 * Type guard to check for AddedEntity messages
 * @param x
 */
function isAddedSystemEntity(x) {
    return !!x && x.type === 'Entity Added';
}
exports.isAddedSystemEntity = isAddedSystemEntity;
/**
 * An [[Entity]] with [[Component]] types that no longer matches a [[System]] types exists in the current scene.
 */
var RemovedEntity = /** @class */ (function () {
    function RemovedEntity(data) {
        this.data = data;
        this.type = 'Entity Removed';
    }
    return RemovedEntity;
}());
exports.RemovedEntity = RemovedEntity;
/**
 * type guard to check for the RemovedEntity message
 */
function isRemoveSystemEntity(x) {
    return !!x && x.type === 'Entity Removed';
}
exports.isRemoveSystemEntity = isRemoveSystemEntity;
