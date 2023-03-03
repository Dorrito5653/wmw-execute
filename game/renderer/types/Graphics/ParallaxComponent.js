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
exports.ParallaxComponent = void 0;
var Component_1 = require("../EntityComponentSystem/Component");
var vector_1 = require("../Math/vector");
var ParallaxComponent = /** @class */ (function (_super) {
    __extends(ParallaxComponent, _super);
    function ParallaxComponent(parallaxFactor) {
        var _this = _super.call(this) || this;
        _this.type = 'ex.parallax';
        _this.parallaxFactor = (0, vector_1.vec)(1.0, 1.0);
        _this.parallaxFactor = parallaxFactor !== null && parallaxFactor !== void 0 ? parallaxFactor : _this.parallaxFactor;
        return _this;
    }
    return ParallaxComponent;
}(Component_1.Component));
exports.ParallaxComponent = ParallaxComponent;
