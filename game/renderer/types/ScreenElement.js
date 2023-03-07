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
exports.ScreenElement = exports.isScreenElement = void 0;
var vector_1 = require("./Math/vector");
var Actor_1 = require("./Actor");
var TransformComponent_1 = require("./EntityComponentSystem/Components/TransformComponent");
var CollisionType_1 = require("./Collision/CollisionType");
var coord_plane_1 = require("./Math/coord-plane");
/**
 * Type guard to detect a screen element
 */
function isScreenElement(actor) {
    return actor instanceof ScreenElement;
}
exports.isScreenElement = isScreenElement;
/**
 * Helper [[Actor]] primitive for drawing UI's, optimized for UI drawing. Does
 * not participate in collisions. Drawn on top of all other actors.
 */
var ScreenElement = /** @class */ (function (_super) {
    __extends(ScreenElement, _super);
    function ScreenElement(config) {
        var _this = _super.call(this, __assign({}, config)) || this;
        _this.get(TransformComponent_1.TransformComponent).coordPlane = coord_plane_1.CoordPlane.Screen;
        _this.anchor = (0, vector_1.vec)(0, 0);
        _this.body.collisionType = CollisionType_1.CollisionType.PreventCollision;
        _this.collider.useBoxCollider(_this.width, _this.height, _this.anchor);
        return _this;
    }
    ScreenElement.prototype._initialize = function (engine) {
        this._engine = engine;
        _super.prototype._initialize.call(this, engine);
    };
    ScreenElement.prototype.contains = function (x, y, useWorld) {
        if (useWorld === void 0) { useWorld = true; }
        if (useWorld) {
            return _super.prototype.contains.call(this, x, y);
        }
        var coords = this._engine.worldToScreenCoordinates(new vector_1.Vector(x, y));
        return _super.prototype.contains.call(this, coords.x, coords.y);
    };
    return ScreenElement;
}(Actor_1.Actor));
exports.ScreenElement = ScreenElement;
