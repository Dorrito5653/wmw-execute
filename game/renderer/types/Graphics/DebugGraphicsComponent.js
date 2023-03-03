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
exports.DebugGraphicsComponent = void 0;
var Component_1 = require("../EntityComponentSystem/Component");
/**
 * Provide arbitrary drawing for the purposes of debugging your game
 *
 * Will only show when the Engine is set to debug mode [[Engine.showDebug]] or [[Engine.toggleDebug]]
 *
 */
var DebugGraphicsComponent = /** @class */ (function (_super) {
    __extends(DebugGraphicsComponent, _super);
    function DebugGraphicsComponent(draw, useTransform) {
        if (useTransform === void 0) { useTransform = true; }
        var _this = _super.call(this) || this;
        _this.draw = draw;
        _this.useTransform = useTransform;
        _this.type = 'ex.debuggraphics';
        return _this;
    }
    return DebugGraphicsComponent;
}(Component_1.Component));
exports.DebugGraphicsComponent = DebugGraphicsComponent;
