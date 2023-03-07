"use strict";
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
__exportStar(require("./Component"), exports);
__exportStar(require("./Entity"), exports);
__exportStar(require("./EntityManager"), exports);
__exportStar(require("./Query"), exports);
__exportStar(require("./QueryManager"), exports);
__exportStar(require("./System"), exports);
__exportStar(require("./SystemManager"), exports);
__exportStar(require("./World"), exports);
__exportStar(require("./Components/TransformComponent"), exports);
__exportStar(require("./Components/MotionComponent"), exports);
