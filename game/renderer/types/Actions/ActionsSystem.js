"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ActionsSystem = void 0;
var System_1 = require("../EntityComponentSystem/System");
var ActionsComponent_1 = require("./ActionsComponent");
var ActionsSystem = /** @class */ (function (_super) {
    __extends(ActionsSystem, _super);
    function ActionsSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.actions'];
        _this.systemType = System_1.SystemType.Update;
        _this.priority = -1;
        _this._actions = [];
        return _this;
    }
    ActionsSystem.prototype.notify = function (entityAddedOrRemoved) {
        if ((0, System_1.isAddedSystemEntity)(entityAddedOrRemoved)) {
            var action = entityAddedOrRemoved.data.get(ActionsComponent_1.ActionsComponent);
            this._actions.push(action);
        }
        else {
            var action = entityAddedOrRemoved.data.get(ActionsComponent_1.ActionsComponent);
            var index = this._actions.indexOf(action);
            if (index > -1) {
                this._actions.splice(index, 1);
            }
        }
    };
    ActionsSystem.prototype.update = function (_entities, delta) {
        for (var _i = 0, _a = this._actions; _i < _a.length; _i++) {
            var actions = _a[_i];
            actions.update(delta);
        }
    };
    return ActionsSystem;
}(System_1.System));
exports.ActionsSystem = ActionsSystem;
