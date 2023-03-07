"use strict";
exports.__esModule = true;
exports.RotationType = void 0;
/**
 * An enum that describes the strategies that rotation actions can use
 */
var RotationType;
(function (RotationType) {
    /**
     * Rotation via `ShortestPath` will use the smallest angle
     * between the starting and ending points. This strategy is the default behavior.
     */
    RotationType[RotationType["ShortestPath"] = 0] = "ShortestPath";
    /**
     * Rotation via `LongestPath` will use the largest angle
     * between the starting and ending points.
     */
    RotationType[RotationType["LongestPath"] = 1] = "LongestPath";
    /**
     * Rotation via `Clockwise` will travel in a clockwise direction,
     * regardless of the starting and ending points.
     */
    RotationType[RotationType["Clockwise"] = 2] = "Clockwise";
    /**
     * Rotation via `CounterClockwise` will travel in a counterclockwise direction,
     * regardless of the starting and ending points.
     */
    RotationType[RotationType["CounterClockwise"] = 3] = "CounterClockwise";
})(RotationType = exports.RotationType || (exports.RotationType = {}));
