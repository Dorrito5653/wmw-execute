"use strict";
exports.__esModule = true;
exports.ParallelActions = void 0;
/**
 * Action that can run multiple [[Action]]s or [[ActionSequence]]s at the same time
 */
var ParallelActions = /** @class */ (function () {
    function ParallelActions(parallelActions) {
        this._actions = parallelActions;
    }
    ParallelActions.prototype.update = function (delta) {
        for (var i = 0; i < this._actions.length; i++) {
            this._actions[i].update(delta);
        }
    };
    ParallelActions.prototype.isComplete = function (entity) {
        return this._actions.every(function (a) { return a.isComplete(entity); });
    };
    ParallelActions.prototype.reset = function () {
        this._actions.forEach(function (a) { return a.reset(); });
    };
    ParallelActions.prototype.stop = function () {
        this._actions.forEach(function (a) { return a.stop(); });
    };
    return ParallelActions;
}());
exports.ParallelActions = ParallelActions;
