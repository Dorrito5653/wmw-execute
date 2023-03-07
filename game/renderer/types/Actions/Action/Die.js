"use strict";
exports.__esModule = true;
exports.Die = void 0;
var ActionsComponent_1 = require("../ActionsComponent");
var Die = /** @class */ (function () {
    function Die(entity) {
        this._stopped = false;
        this._entity = entity;
    }
    Die.prototype.update = function (_delta) {
        this._entity.get(ActionsComponent_1.ActionsComponent).clearActions();
        this._entity.kill();
        this._stopped = true;
    };
    Die.prototype.isComplete = function () {
        return this._stopped;
    };
    Die.prototype.stop = function () {
        return;
    };
    Die.prototype.reset = function () {
        return;
    };
    return Die;
}());
exports.Die = Die;
