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
exports.PointerComponent = void 0;
var Component_1 = require("../EntityComponentSystem/Component");
/**
 * Add this component to optionally configure how the pointer
 * system detects pointer events.
 *
 * By default the collider shape is used and graphics bounds is not.
 *
 * If both collider shape and graphics bounds are enabled it will fire events if either or
 * are intersecting the pointer.
 */
var PointerComponent = /** @class */ (function (_super) {
    __extends(PointerComponent, _super);
    function PointerComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ex.pointer';
        /**
         * Use any existing Collider component geometry for pointer events. This is useful if you want
         * user pointer events only to trigger on the same collision geometry used in the collider component
         * for collision resolution. Default is `true`.
         */
        _this.useColliderShape = true;
        /**
         * Use any existing Graphics component bounds for pointers. This is useful if you want the axis aligned
         * bounds around the graphic to trigger pointer events. Default is `false`.
         */
        _this.useGraphicsBounds = false;
        return _this;
    }
    return PointerComponent;
}(Component_1.Component));
exports.PointerComponent = PointerComponent;
