"use strict";
/**
 * Determines the scope of handling mouse/touch events.
 */
exports.__esModule = true;
exports.PointerScope = void 0;
var PointerScope;
(function (PointerScope) {
    /**
     * Handle events on the `canvas` element only. Events originating outside the
     * `canvas` will not be handled.
     */
    PointerScope["Canvas"] = "Canvas";
    /**
     * Handles events on the entire document. All events will be handled by Excalibur.
     */
    PointerScope["Document"] = "Document";
})(PointerScope = exports.PointerScope || (exports.PointerScope = {}));
