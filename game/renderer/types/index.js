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
exports.Util = exports.PointerSystem = exports.PointerComponent = exports.Input = exports.Events = exports.EmitterType = exports.ParticleEmitter = exports.Particle = exports.BaseAlign = exports.TextAlign = exports.FontUnit = exports.FontStyle = exports.Actor = exports.EX_VERSION = void 0;
/**
 * The current Excalibur version string
 * @description `process.env.__EX_VERSION` gets replaced by Webpack on build
 */
exports.EX_VERSION = process.env.__EX_VERSION;
var Polyfill_1 = require("./Polyfill");
(0, Polyfill_1.polyfill)();
// This file is used as the bundle entry point and exports everything
// that will be exposed as the `ex` global variable.
__exportStar(require("./Flags"), exports);
__exportStar(require("./Id"), exports);
__exportStar(require("./Engine"), exports);
__exportStar(require("./Screen"), exports);
var Actor_1 = require("./Actor");
__createBinding(exports, Actor_1, "Actor");
__exportStar(require("./Math/Index"), exports);
__exportStar(require("./Camera"), exports);
__exportStar(require("./Class"), exports);
__exportStar(require("./Configurable"), exports);
__exportStar(require("./Debug/index"), exports);
__exportStar(require("./EventDispatcher"), exports);
__exportStar(require("./Events/MediaEvents"), exports);
__exportStar(require("./Events"), exports);
__exportStar(require("./Label"), exports);
var FontCommon_1 = require("./Graphics/FontCommon");
__createBinding(exports, FontCommon_1, "FontStyle");
__createBinding(exports, FontCommon_1, "FontUnit");
__createBinding(exports, FontCommon_1, "TextAlign");
__createBinding(exports, FontCommon_1, "BaseAlign");
__exportStar(require("./Loader"), exports);
var Particles_1 = require("./Particles");
__createBinding(exports, Particles_1, "Particle");
__createBinding(exports, Particles_1, "ParticleEmitter");
__createBinding(exports, Particles_1, "EmitterType");
__exportStar(require("./Collision/Physics"), exports);
__exportStar(require("./Scene"), exports);
__exportStar(require("./TileMap/index"), exports);
__exportStar(require("./Timer"), exports);
__exportStar(require("./Trigger"), exports);
__exportStar(require("./ScreenElement"), exports);
__exportStar(require("./Actions/Index"), exports);
__exportStar(require("./Collision/Index"), exports);
__exportStar(require("./Interfaces/Index"), exports);
__exportStar(require("./Resources/Index"), exports);
__exportStar(require("./EntityComponentSystem/index"), exports);
__exportStar(require("./Color"), exports);
__exportStar(require("./Graphics/index"), exports);
// ex.Events namespace
var events = require("./Events");
exports.Events = events;
// ex.Input namespace
var input = require("./Input/Index");
exports.Input = input;
var Index_1 = require("./Input/Index");
__createBinding(exports, Index_1, "PointerComponent");
var PointerSystem_1 = require("./Input/PointerSystem");
__createBinding(exports, PointerSystem_1, "PointerSystem");
// ex.Util namespaces
var util = require("./Util/Index");
exports.Util = util;
__exportStar(require("./Util/Browser"), exports);
__exportStar(require("./Util/Decorators"), exports);
__exportStar(require("./Util/Detector"), exports);
__exportStar(require("./Util/EasingFunctions"), exports);
__exportStar(require("./Util/Observable"), exports);
__exportStar(require("./Util/Log"), exports);
__exportStar(require("./Util/Pool"), exports);
__exportStar(require("./Util/Fps"), exports);
__exportStar(require("./Util/Clock"), exports);
__exportStar(require("./Util/WebAudio"), exports);
__exportStar(require("./Util/Toaster"), exports);
__exportStar(require("./Util/StateMachine"), exports);
__exportStar(require("./Util/Future"), exports);
__exportStar(require("./Util/Semaphore"), exports);
// ex.Deprecated
// import * as deprecated from './Deprecated';
// export { deprecated as Deprecated };
// export * from './Deprecated';
