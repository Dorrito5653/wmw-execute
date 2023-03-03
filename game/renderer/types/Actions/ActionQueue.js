"use strict";
exports.__esModule = true;
exports.ActionQueue = void 0;
/**
 * Action Queues represent an ordered sequence of actions
 *
 * Action queues are part of the [[ActionContext|Action API]] and
 * store the list of actions to be executed for an [[Actor]].
 *
 * Actors implement [[Actor.actions]] which can be manipulated by
 * advanced users to adjust the actions currently being executed in the
 * queue.
 */
var ActionQueue = /** @class */ (function () {
    function ActionQueue(entity) {
        this._actions = [];
        this._completedActions = [];
        this._entity = entity;
    }
    /**
     * Add an action to the sequence
     * @param action
     */
    ActionQueue.prototype.add = function (action) {
        this._actions.push(action);
    };
    /**
     * Remove an action by reference from the sequence
     * @param action
     */
    ActionQueue.prototype.remove = function (action) {
        var index = this._actions.indexOf(action);
        this._actions.splice(index, 1);
    };
    /**
     * Removes all actions from this sequence
     */
    ActionQueue.prototype.clearActions = function () {
        this._actions.length = 0;
        this._completedActions.length = 0;
        if (this._currentAction) {
            this._currentAction.stop();
        }
    };
    /**
     *
     * @returns The total list of actions in this sequence complete or not
     */
    ActionQueue.prototype.getActions = function () {
        return this._actions.concat(this._completedActions);
    };
    /**
     *
     * @returns `true` if there are more actions to process in the sequence
     */
    ActionQueue.prototype.hasNext = function () {
        return this._actions.length > 0;
    };
    /**
     * @returns `true` if the current sequence of actions is done
     */
    ActionQueue.prototype.isComplete = function () {
        return this._actions.length === 0;
    };
    /**
     * Resets the sequence of actions, this is used to restart a sequence from the beginning
     */
    ActionQueue.prototype.reset = function () {
        this._actions = this.getActions();
        var len = this._actions.length;
        for (var i = 0; i < len; i++) {
            this._actions[i].reset();
        }
        this._completedActions = [];
    };
    /**
     * Update the queue which updates actions and handles completing actions
     * @param elapsedMs
     */
    ActionQueue.prototype.update = function (elapsedMs) {
        if (this._actions.length > 0) {
            this._currentAction = this._actions[0];
            this._currentAction.update(elapsedMs);
            if (this._currentAction.isComplete(this._entity)) {
                this._completedActions.push(this._actions.shift());
            }
        }
    };
    return ActionQueue;
}());
exports.ActionQueue = ActionQueue;
