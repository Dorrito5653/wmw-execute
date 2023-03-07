"use strict";
exports.__esModule = true;
exports.RepeatForever = void 0;
var ActionContext_1 = require("../ActionContext");
/**
 * RepeatForever Action implementation, it is recommended you use the fluent action
 * context API.
 *
 *
 */
var RepeatForever = /** @class */ (function () {
    function RepeatForever(entity, repeatBuilder) {
        this._stopped = false;
        this._repeatBuilder = repeatBuilder;
        this._repeatContext = new ActionContext_1.ActionContext(entity);
        this._actionQueue = this._repeatContext.getQueue();
        this._repeatBuilder(this._repeatContext);
    }
    RepeatForever.prototype.update = function (delta) {
        if (this._stopped) {
            return;
        }
        if (this._actionQueue.isComplete()) {
            this._actionQueue.clearActions();
            this._repeatBuilder(this._repeatContext);
        }
        this._actionQueue.update(delta);
    };
    RepeatForever.prototype.isComplete = function () {
        return this._stopped;
    };
    RepeatForever.prototype.stop = function () {
        this._stopped = true;
        this._actionQueue.clearActions();
    };
    RepeatForever.prototype.reset = function () {
        return;
    };
    return RepeatForever;
}());
exports.RepeatForever = RepeatForever;
