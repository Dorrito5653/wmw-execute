"use strict";
exports.__esModule = true;
exports.Side = void 0;
var vector_1 = require("../Math/vector");
/**
 * An enum that describes the sides of an axis aligned box for collision
 */
var Side;
(function (Side) {
    Side["None"] = "None";
    Side["Top"] = "Top";
    Side["Bottom"] = "Bottom";
    Side["Left"] = "Left";
    Side["Right"] = "Right";
})(Side = exports.Side || (exports.Side = {}));
(function (Side) {
    /**
     * Returns the opposite side from the current
     */
    function getOpposite(side) {
        if (side === Side.Top) {
            return Side.Bottom;
        }
        if (side === Side.Bottom) {
            return Side.Top;
        }
        if (side === Side.Left) {
            return Side.Right;
        }
        if (side === Side.Right) {
            return Side.Left;
        }
        return Side.None;
    }
    Side.getOpposite = getOpposite;
    /**
     * Given a vector, return the Side most in that direction (via dot product)
     */
    function fromDirection(direction) {
        var directions = [vector_1.Vector.Left, vector_1.Vector.Right, vector_1.Vector.Up, vector_1.Vector.Down];
        var directionEnum = [Side.Left, Side.Right, Side.Top, Side.Bottom];
        var max = -Number.MAX_VALUE;
        var maxIndex = -1;
        for (var i = 0; i < directions.length; i++) {
            if (directions[i].dot(direction) > max) {
                max = directions[i].dot(direction);
                maxIndex = i;
            }
        }
        return directionEnum[maxIndex];
    }
    Side.fromDirection = fromDirection;
})(Side = exports.Side || (exports.Side = {}));
