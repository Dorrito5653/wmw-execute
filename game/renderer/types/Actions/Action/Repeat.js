"use strict";
exports.__esModule = true;
exports.Repeat = void 0;
var ActionContext_1 = require("../ActionContext");
var Repeat = /** @class */ (function () {
    function Repeat(entity, repeatBuilder, repeat) {
        this._stopped = false;
        this._repeatBuilder = repeatBuilder;
        this._repeatContext = new ActionContext_1.ActionContext(entity);
        this._actionQueue = this._repeatContext.getQueue();
        this._repeat = repeat;
        this._originalRepeat = repeat;
        this._repeatBuilder(this._repeatContext);
        this._repeat--; // current execution is the first repeat
    }
    Repeat.prototype.update = function (delta) {
        if (this._actionQueue.isComplete()) {
            this._actionQueue.clearActions();
            this._repeatBuilder(this._repeatContext);
            this._repeat--;
        }
        this._actionQueue.update(delta);
    };
    Repeat.prototype.isComplete = function () {
        return this._stopped || (this._repeat <= 0 && this._actionQueue.isComplete());
    };
    Repeat.prototype.stop = function () {
        this._stopped = true;
    };
    Repeat.prototype.reset = function () {
        this._repeat = this._originalRepeat;
    };
    return Repeat;
}());
exports.Repeat = Repeat;
