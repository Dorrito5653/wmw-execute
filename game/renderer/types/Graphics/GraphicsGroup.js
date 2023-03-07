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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.GraphicsGroup = void 0;
var Graphic_1 = require("./Graphic");
var Animation_1 = require("./Animation");
var Index_1 = require("../Collision/Index");
var GraphicsGroup = /** @class */ (function (_super) {
    __extends(GraphicsGroup, _super);
    function GraphicsGroup(options) {
        var _this = _super.call(this, options) || this;
        _this.members = [];
        _this.members = options.members;
        _this._updateDimensions();
        return _this;
    }
    GraphicsGroup.prototype.clone = function () {
        return new GraphicsGroup(__assign({ members: __spreadArray([], this.members, true) }, this.cloneGraphicOptions()));
    };
    GraphicsGroup.prototype._updateDimensions = function () {
        var bb = new Index_1.BoundingBox();
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var _b = _a[_i], graphic = _b.graphic, pos = _b.pos;
            bb = graphic.localBounds.translate(pos).combine(bb);
        }
        this.width = bb.width;
        this.height = bb.height;
        return bb;
    };
    Object.defineProperty(GraphicsGroup.prototype, "localBounds", {
        get: function () {
            var bb = new Index_1.BoundingBox();
            for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
                var _b = _a[_i], graphic = _b.graphic, pos = _b.pos;
                bb = graphic.localBounds.translate(pos).combine(bb);
            }
            return bb;
        },
        enumerable: false,
        configurable: true
    });
    GraphicsGroup.prototype._isAnimationOrGroup = function (graphic) {
        return graphic instanceof Animation_1.Animation || graphic instanceof GraphicsGroup;
    };
    GraphicsGroup.prototype.tick = function (elapsedMilliseconds, idempotencyToken) {
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var member = _a[_i];
            var maybeAnimation = member.graphic;
            if (this._isAnimationOrGroup(maybeAnimation)) {
                maybeAnimation.tick(elapsedMilliseconds, idempotencyToken);
            }
        }
    };
    GraphicsGroup.prototype.reset = function () {
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var member = _a[_i];
            var maybeAnimation = member.graphic;
            if (this._isAnimationOrGroup(maybeAnimation)) {
                maybeAnimation.reset();
            }
        }
    };
    GraphicsGroup.prototype._preDraw = function (ex, x, y) {
        this._updateDimensions();
        _super.prototype._preDraw.call(this, ex, x, y);
    };
    GraphicsGroup.prototype._drawImage = function (ex, x, y) {
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var member = _a[_i];
            ex.save();
            ex.translate(x, y);
            member.graphic.draw(ex, member.pos.x, member.pos.y);
            if (this.showDebug) {
                /* istanbul ignore next */
                ex.debug.drawRect(0, 0, this.width, this.height);
            }
            ex.restore();
        }
    };
    return GraphicsGroup;
}(Graphic_1.Graphic));
exports.GraphicsGroup = GraphicsGroup;
