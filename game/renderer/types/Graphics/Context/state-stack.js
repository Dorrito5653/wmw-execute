"use strict";
exports.__esModule = true;
exports.StateStack = void 0;
var Color_1 = require("../../Color");
var StateStack = /** @class */ (function () {
    function StateStack() {
        this._states = [];
        this._currentState = this._getDefaultState();
    }
    StateStack.prototype._getDefaultState = function () {
        return {
            opacity: 1,
            z: 0,
            tint: Color_1.Color.White
        };
    };
    StateStack.prototype._cloneState = function () {
        return {
            opacity: this._currentState.opacity,
            z: this._currentState.z,
            tint: this._currentState.tint.clone()
        };
    };
    StateStack.prototype.save = function () {
        this._states.push(this._currentState);
        this._currentState = this._cloneState();
    };
    StateStack.prototype.restore = function () {
        this._currentState = this._states.pop();
    };
    Object.defineProperty(StateStack.prototype, "current", {
        get: function () {
            return this._currentState;
        },
        set: function (val) {
            this._currentState = val;
        },
        enumerable: false,
        configurable: true
    });
    return StateStack;
}());
exports.StateStack = StateStack;
