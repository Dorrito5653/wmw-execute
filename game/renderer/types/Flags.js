"use strict";
exports.__esModule = true;
exports.Flags = void 0;
/**
 * Flags is a feature flag implementation for Excalibur. They can only be operated **before [[Engine]] construction**
 * after which they are frozen and are read-only.
 *
 * Flags are used to enable experimental or preview features in Excalibur.
 */
var Flags = /** @class */ (function () {
    function Flags() {
    }
    /**
     * Force excalibur to load the Canvas 2D graphics context fallback
     *
     * @warning not all features of excalibur are supported in the Canvas 2D fallback
     */
    Flags.useCanvasGraphicsContext = function () {
        Flags.enable('use-canvas-context');
    };
    /**
     * Freeze all flag modifications making them readonly
     */
    Flags.freeze = function () {
        Flags._FROZEN = true;
    };
    /**
     * Resets internal flag state, not meant to be called by users. Only used for testing.
     *
     * Calling this in your game is UNSUPPORTED
     * @internal
     */
    Flags._reset = function () {
        Flags._FROZEN = false;
        Flags._FLAGS = {};
    };
    /**
     * Enable a specific feature flag by name. **Note: can only be set before [[Engine]] constructor time**
     * @param flagName
     */
    Flags.enable = function (flagName) {
        if (this._FROZEN) {
            throw Error('Feature flags can only be enabled before Engine constructor time');
        }
        Flags._FLAGS[flagName] = true;
    };
    /**
     * Disable a specific feature flag by name. **Note: can only be set before [[Engine]] constructor time**
     * @param flagName
     */
    Flags.disable = function (flagName) {
        if (this._FROZEN) {
            throw Error('Feature flags can only be disabled before Engine constructor time');
        }
        Flags._FLAGS[flagName] = false;
    };
    /**
     * Check if a flag is enabled. If the flag is disabled or does not exist `false` is returned
     * @param flagName
     */
    Flags.isEnabled = function (flagName) {
        return !!Flags._FLAGS[flagName];
    };
    /**
     * Show a list of currently known flags
     */
    Flags.show = function () {
        return Object.keys(Flags._FLAGS);
    };
    Flags._FROZEN = false;
    Flags._FLAGS = {};
    return Flags;
}());
exports.Flags = Flags;
