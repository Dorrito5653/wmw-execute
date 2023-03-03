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
exports.IsometricEntityComponent = void 0;
var Component_1 = require("../EntityComponentSystem/Component");
var IsometricEntityComponent = /** @class */ (function (_super) {
    __extends(IsometricEntityComponent, _super);
    /**
     * Specify the isometric map to use to position this entity's z-index
     * @param map
     */
    function IsometricEntityComponent(map) {
        var _this = _super.call(this) || this;
        _this.type = 'ex.isometricentity';
        /**
         * Vertical "height" in the isometric world
         */
        _this.elevation = 0;
        _this.map = map;
        return _this;
    }
    return IsometricEntityComponent;
}(Component_1.Component));
exports.IsometricEntityComponent = IsometricEntityComponent;
