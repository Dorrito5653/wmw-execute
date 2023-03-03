"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.StateMachine = void 0;
var StateMachine = /** @class */ (function () {
    function StateMachine() {
        this.states = new Map();
    }
    Object.defineProperty(StateMachine.prototype, "currentState", {
        get: function () {
            return this._currentState;
        },
        set: function (state) {
            this._currentState = state;
        },
        enumerable: false,
        configurable: true
    });
    StateMachine.create = function (machineDescription, data) {
        var machine = new StateMachine();
        machine.data = data;
        for (var stateName in machineDescription.states) {
            machine.states.set(stateName, __assign({ name: stateName }, machineDescription.states[stateName]));
        }
        // validate transitions are states
        for (var _i = 0, _a = machine.states.values(); _i < _a.length; _i++) {
            var state = _a[_i];
            for (var _b = 0, _c = state.transitions; _b < _c.length; _b++) {
                var transitionState = _c[_b];
                if (transitionState === '*') {
                    continue;
                }
                if (!machine.states.has(transitionState)) {
                    throw Error("Invalid state machine, state [".concat(state.name, "] has a transition to another state that doesn't exist [").concat(transitionState, "]"));
                }
            }
        }
        machine.currentState = machine.startState = machine.states.get(machineDescription.start);
        return machine;
    };
    StateMachine.prototype["in"] = function (state) {
        return this.currentState.name === state;
    };
    StateMachine.prototype.go = function (stateName, eventData) {
        var _a, _b;
        if (this.currentState.transitions.includes(stateName) || this.currentState.transitions.includes('*')) {
            var potentialNewState = this.states.get(stateName);
            if (this.currentState.onExit) {
                var canExit = (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.onExit({ to: potentialNewState.name, data: this.data });
                if (canExit === false) {
                    return false;
                }
            }
            if (potentialNewState === null || potentialNewState === void 0 ? void 0 : potentialNewState.onEnter) {
                var canEnter = potentialNewState === null || potentialNewState === void 0 ? void 0 : potentialNewState.onEnter({ from: this.currentState.name, eventData: eventData, data: this.data });
                if (canEnter === false) {
                    return false;
                }
            }
            // console.log(`${this.currentState.name} => ${potentialNewState.name} (${eventData})`);
            this.currentState = potentialNewState;
            if ((_b = this.currentState) === null || _b === void 0 ? void 0 : _b.onState) {
                this.currentState.onState();
            }
            return true;
        }
        return false;
    };
    StateMachine.prototype.update = function (elapsedMs) {
        if (this.currentState.onUpdate) {
            this.currentState.onUpdate(this.data, elapsedMs);
        }
    };
    StateMachine.prototype.save = function (saveKey) {
        localStorage.setItem(saveKey, JSON.stringify({
            currentState: this.currentState.name,
            data: this.data
        }));
    };
    StateMachine.prototype.restore = function (saveKey) {
        var state = JSON.parse(localStorage.getItem(saveKey));
        this.currentState = this.states.get(state.currentState);
        this.data = state.data;
    };
    return StateMachine;
}());
exports.StateMachine = StateMachine;
