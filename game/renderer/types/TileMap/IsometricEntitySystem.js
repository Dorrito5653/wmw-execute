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
exports.IsometricEntitySystem = void 0;
var System_1 = require("../EntityComponentSystem/System");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
var IsometricEntityComponent_1 = require("./IsometricEntityComponent");
var IsometricEntitySystem = /** @class */ (function (_super) {
    __extends(IsometricEntitySystem, _super);
    function IsometricEntitySystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.transform', 'ex.isometricentity'];
        _this.systemType = System_1.SystemType.Update;
        _this.priority = 99;
        return _this;
    }
    IsometricEntitySystem.prototype.update = function (entities, _delta) {
        var transform;
        var iso;
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var entity = entities_1[_i];
            transform = entity.get(TransformComponent_1.TransformComponent);
            iso = entity.get(IsometricEntityComponent_1.IsometricEntityComponent);
            var maxZindexPerElevation = Math.max(iso.map.columns * iso.map.tileWidth, iso.map.rows * iso.map.tileHeight);
            var newZ = maxZindexPerElevation * iso.elevation + transform.pos.y;
            transform.z = newZ;
        }
    };
    return IsometricEntitySystem;
}(System_1.System));
exports.IsometricEntitySystem = IsometricEntitySystem;
