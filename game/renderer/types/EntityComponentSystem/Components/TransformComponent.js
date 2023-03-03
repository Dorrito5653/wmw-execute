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
exports.TransformComponent = void 0;
var coord_plane_1 = require("../../Math/coord-plane");
var transform_1 = require("../../Math/transform");
var Component_1 = require("../Component");
var Observable_1 = require("../../Util/Observable");
var TransformComponent = /** @class */ (function (_super) {
    __extends(TransformComponent, _super);
    function TransformComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ex.transform';
        _this._transform = new transform_1.Transform();
        _this._addChildTransform = function (child) {
            var childTxComponent = child.get(TransformComponent);
            if (childTxComponent) {
                childTxComponent._transform.parent = _this._transform;
            }
        };
        /**
         * Observable that emits when the z index changes on this component
         */
        _this.zIndexChanged$ = new Observable_1.Observable();
        _this._z = 0;
        /**
         * The [[CoordPlane|coordinate plane|]] for this transform for the entity.
         */
        _this.coordPlane = coord_plane_1.CoordPlane.World;
        return _this;
    }
    TransformComponent.prototype.get = function () {
        return this._transform;
    };
    TransformComponent.prototype.onAdd = function (owner) {
        var _this = this;
        for (var _i = 0, _a = owner.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this._addChildTransform(child);
        }
        owner.childrenAdded$.subscribe(function (child) { return _this._addChildTransform(child); });
        owner.childrenRemoved$.subscribe(function (child) {
            var childTxComponent = child.get(TransformComponent);
            if (childTxComponent) {
                childTxComponent._transform.parent = null;
            }
        });
    };
    TransformComponent.prototype.onRemove = function (_previousOwner) {
        this._transform.parent = null;
    };
    Object.defineProperty(TransformComponent.prototype, "z", {
        /**
         * The z-index ordering of the entity, a higher values are drawn on top of lower values.
         * For example z=99 would be drawn on top of z=0.
         */
        get: function () {
            return this._z;
        },
        set: function (val) {
            var oldz = this._z;
            this._z = val;
            if (oldz !== val) {
                this.zIndexChanged$.notifyAll(val);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformComponent.prototype, "pos", {
        get: function () {
            return this._transform.pos;
        },
        set: function (v) {
            this._transform.pos = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformComponent.prototype, "globalPos", {
        get: function () {
            return this._transform.globalPos;
        },
        set: function (v) {
            this._transform.globalPos = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformComponent.prototype, "rotation", {
        get: function () {
            return this._transform.rotation;
        },
        set: function (rotation) {
            this._transform.rotation = rotation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformComponent.prototype, "globalRotation", {
        get: function () {
            return this._transform.globalRotation;
        },
        set: function (rotation) {
            this._transform.globalRotation = rotation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformComponent.prototype, "scale", {
        get: function () {
            return this._transform.scale;
        },
        set: function (v) {
            this._transform.scale = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformComponent.prototype, "globalScale", {
        get: function () {
            return this._transform.globalScale;
        },
        set: function (v) {
            this._transform.globalScale = v;
        },
        enumerable: false,
        configurable: true
    });
    TransformComponent.prototype.applyInverse = function (v) {
        return this._transform.applyInverse(v);
    };
    TransformComponent.prototype.apply = function (v) {
        return this._transform.apply(v);
    };
    return TransformComponent;
}(Component_1.Component));
exports.TransformComponent = TransformComponent;
