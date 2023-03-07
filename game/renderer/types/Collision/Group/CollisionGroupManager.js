"use strict";
exports.__esModule = true;
exports.CollisionGroupManager = void 0;
var CollisionGroup_1 = require("./CollisionGroup");
/**
 * Static class for managing collision groups in excalibur, there is a maximum of 32 collision groups possible in excalibur
 */
var CollisionGroupManager = /** @class */ (function () {
    function CollisionGroupManager() {
    }
    /**
     * Create a new named collision group up to a max of 32.
     * @param name Name for the collision group
     * @param mask Optionally provide your own 32-bit mask, if none is provide the manager will generate one
     */
    CollisionGroupManager.create = function (name, mask) {
        if (this._CURRENT_GROUP > this._MAX_GROUPS) {
            throw new Error("Cannot have more than ".concat(this._MAX_GROUPS, " collision groups"));
        }
        if (this._GROUPS.get(name)) {
            throw new Error("Collision group ".concat(name, " already exists"));
        }
        var group = new CollisionGroup_1.CollisionGroup(name, this._CURRENT_BIT, mask !== undefined ? mask : ~this._CURRENT_BIT);
        this._CURRENT_BIT = (this._CURRENT_BIT << 1) | 0;
        this._CURRENT_GROUP++;
        this._GROUPS.set(name, group);
        return group;
    };
    Object.defineProperty(CollisionGroupManager, "groups", {
        /**
         * Get all collision groups currently tracked by excalibur
         */
        get: function () {
            return Array.from(this._GROUPS.values());
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get a collision group by it's name
     * @param name
     */
    CollisionGroupManager.groupByName = function (name) {
        return this._GROUPS.get(name);
    };
    /**
     * Resets the managers internal group management state
     */
    CollisionGroupManager.reset = function () {
        this._GROUPS = new Map();
        this._CURRENT_BIT = this._STARTING_BIT;
        this._CURRENT_GROUP = 1;
    };
    // using bitmasking the maximum number of groups is 32, because that is the highest 32bit integer that JS can present.
    CollisionGroupManager._STARTING_BIT = 1 | 0;
    CollisionGroupManager._MAX_GROUPS = 32;
    CollisionGroupManager._CURRENT_GROUP = 1;
    CollisionGroupManager._CURRENT_BIT = CollisionGroupManager._STARTING_BIT;
    CollisionGroupManager._GROUPS = new Map();
    return CollisionGroupManager;
}());
exports.CollisionGroupManager = CollisionGroupManager;
