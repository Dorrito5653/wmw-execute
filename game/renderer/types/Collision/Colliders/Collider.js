"use strict";
exports.__esModule = true;
exports.Collider = void 0;
var Id_1 = require("../../Id");
var EventDispatcher_1 = require("../../EventDispatcher");
/**
 * A collision collider specifies the geometry that can detect when other collision colliders intersect
 * for the purposes of colliding 2 objects in excalibur.
 */
var Collider = /** @class */ (function () {
    function Collider() {
        this.id = (0, Id_1.createId)('collider', Collider._ID++);
        /**
         * Excalibur uses this to signal to the [[CollisionSystem]] this is part of a composite collider
         * @internal
         * @hidden
         */
        this.__compositeColliderId = null;
        this.events = new EventDispatcher_1.EventDispatcher();
    }
    /**
     * Returns a boolean indicating whether this body collided with
     * or was in stationary contact with
     * the body of the other [[Collider]]
     */
    Collider.prototype.touching = function (other) {
        var contact = this.collide(other);
        if (contact) {
            return true;
        }
        return false;
    };
    Collider._ID = 0;
    return Collider;
}());
exports.Collider = Collider;
