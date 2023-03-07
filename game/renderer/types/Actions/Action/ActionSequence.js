"use strict";
exports.__esModule = true;
exports.ActionSequence = void 0;
var ActionContext_1 = require("../ActionContext");
/**
 * Action that can represent a sequence of actions, this can be useful in conjunction with
 * [[ParallelActions]] to run multiple sequences in parallel.
 */
var ActionSequence = /** @class */ (function () {
    function ActionSequence(entity, actionBuilder) {
        this._stopped = false;
        this._sequenceBuilder = actionBuilder;
        this._sequenceContext = new ActionContext_1.ActionContext(entity);
        this._actionQueue = this._sequenceContext.getQueue();
        this._sequenceBuilder(this._sequenceContext);
    }
    ActionSequence.prototype.update = function (delta) {
        this._actionQueue.update(delta);
    };
    ActionSequence.prototype.isComplete = function () {
        return this._stopped || this._actionQueue.isComplete();
    };
    ActionSequence.prototype.stop = function () {
        this._stopped = true;
    };
    ActionSequence.prototype.reset = function () {
        this._stopped = false;
        this._actionQueue.reset();
    };
    ActionSequence.prototype.clone = function (entity) {
        return new ActionSequence(entity, this._sequenceBuilder);
    };
    return ActionSequence;
}());
exports.ActionSequence = ActionSequence;
