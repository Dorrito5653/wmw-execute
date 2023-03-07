"use strict";
/**
 * @module
 * Provides support for mice, keyboards, and controllers.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
/**
 * @typedoc
 */
__exportStar(require("./Gamepad"), exports);
__exportStar(require("./PointerScope"), exports);
__exportStar(require("./PointerType"), exports);
__exportStar(require("./PointerSystem"), exports);
__exportStar(require("./PointerComponent"), exports);
__exportStar(require("./PointerEventReceiver"), exports);
__exportStar(require("./Keyboard"), exports);
__exportStar(require("./EngineInput"), exports);
__exportStar(require("./CapturePointerConfig"), exports);
__exportStar(require("./NativePointerButton"), exports);
__exportStar(require("./PointerButton"), exports);
__exportStar(require("./WheelDeltaMode"), exports);
__exportStar(require("./PointerEvent"), exports);
__exportStar(require("./WheelEvent"), exports);
