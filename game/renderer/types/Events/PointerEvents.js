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
exports.Wheel = exports.PointerCancel = exports.PointerMove = exports.PointerDown = exports.PointerUp = exports.PointerEvent = void 0;
var ExEvent_1 = require("./ExEvent");
var PointerEvent = /** @class */ (function (_super) {
    __extends(PointerEvent, _super);
    function PointerEvent(pointerId, coordinates, nativeEvent) {
        var _this = _super.call(this) || this;
        _this.pointerId = pointerId;
        _this.coordinates = coordinates;
        _this.nativeEvent = nativeEvent;
        return _this;
    }
    return PointerEvent;
}(ExEvent_1.ExEvent));
exports.PointerEvent = PointerEvent;
var PointerUp = /** @class */ (function (_super) {
    __extends(PointerUp, _super);
    function PointerUp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'up';
        return _this;
    }
    return PointerUp;
}(PointerEvent));
exports.PointerUp = PointerUp;
var PointerDown = /** @class */ (function (_super) {
    __extends(PointerDown, _super);
    function PointerDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'down';
        return _this;
    }
    return PointerDown;
}(PointerEvent));
exports.PointerDown = PointerDown;
var PointerMove = /** @class */ (function (_super) {
    __extends(PointerMove, _super);
    function PointerMove() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'move';
        return _this;
    }
    return PointerMove;
}(PointerEvent));
exports.PointerMove = PointerMove;
var PointerCancel = /** @class */ (function (_super) {
    __extends(PointerCancel, _super);
    function PointerCancel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'cancel';
        return _this;
    }
    return PointerCancel;
}(PointerEvent));
exports.PointerCancel = PointerCancel;
var Wheel = /** @class */ (function (_super) {
    __extends(Wheel, _super);
    function Wheel(x, y, pageX, pageY, screenX, screenY, index, deltaX, deltaY, deltaZ, deltaMode, ev) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.pageX = pageX;
        _this.pageY = pageY;
        _this.screenX = screenX;
        _this.screenY = screenY;
        _this.index = index;
        _this.deltaX = deltaX;
        _this.deltaY = deltaY;
        _this.deltaZ = deltaZ;
        _this.deltaMode = deltaMode;
        _this.ev = ev;
        _this.type = 'wheel';
        return _this;
    }
    return Wheel;
}(ExEvent_1.ExEvent));
exports.Wheel = Wheel;
