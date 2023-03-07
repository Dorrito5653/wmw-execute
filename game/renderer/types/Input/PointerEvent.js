"use strict";
exports.__esModule = true;
exports.PointerEvent = void 0;
var PointerEvent = /** @class */ (function () {
    function PointerEvent(type, pointerId, button, pointerType, coordinates, nativeEvent) {
        this.type = type;
        this.pointerId = pointerId;
        this.button = button;
        this.pointerType = pointerType;
        this.coordinates = coordinates;
        this.nativeEvent = nativeEvent;
        this.active = true;
    }
    PointerEvent.prototype.cancel = function () {
        this.active = false;
    };
    Object.defineProperty(PointerEvent.prototype, "pagePos", {
        get: function () {
            return this.coordinates.pagePos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointerEvent.prototype, "screenPos", {
        get: function () {
            return this.coordinates.screenPos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointerEvent.prototype, "worldPos", {
        get: function () {
            return this.coordinates.worldPos;
        },
        enumerable: false,
        configurable: true
    });
    ;
    return PointerEvent;
}());
exports.PointerEvent = PointerEvent;
