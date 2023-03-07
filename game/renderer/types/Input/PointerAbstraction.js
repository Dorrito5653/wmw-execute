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
exports.PointerAbstraction = void 0;
var Class_1 = require("../Class");
var vector_1 = require("../Math/vector");
var PointerAbstraction = /** @class */ (function (_super) {
    __extends(PointerAbstraction, _super);
    function PointerAbstraction() {
        var _this = _super.call(this) || this;
        /**
         * The last position on the document this pointer was at. Can be `null` if pointer was never active.
         */
        _this.lastPagePos = vector_1.Vector.Zero;
        /**
         * The last position on the screen this pointer was at. Can be `null` if pointer was never active.
         */
        _this.lastScreenPos = vector_1.Vector.Zero;
        /**
         * The last position in the game world coordinates this pointer was at. Can be `null` if pointer was never active.
         */
        _this.lastWorldPos = vector_1.Vector.Zero;
        _this._onPointerMove = function (ev) {
            _this.lastPagePos = new vector_1.Vector(ev.pagePos.x, ev.pagePos.y);
            _this.lastScreenPos = new vector_1.Vector(ev.screenPos.x, ev.screenPos.y);
            _this.lastWorldPos = new vector_1.Vector(ev.worldPos.x, ev.worldPos.y);
        };
        _this._onPointerDown = function (ev) {
            _this.lastPagePos = new vector_1.Vector(ev.pagePos.x, ev.pagePos.y);
            _this.lastScreenPos = new vector_1.Vector(ev.screenPos.x, ev.screenPos.y);
            _this.lastWorldPos = new vector_1.Vector(ev.worldPos.x, ev.worldPos.y);
        };
        _this.on('move', _this._onPointerMove);
        _this.on('down', _this._onPointerDown);
        return _this;
    }
    PointerAbstraction.prototype.on = function (event, handler) {
        _super.prototype.on.call(this, event, handler);
    };
    PointerAbstraction.prototype.once = function (event, handler) {
        _super.prototype.once.call(this, event, handler);
    };
    PointerAbstraction.prototype.off = function (event, handler) {
        _super.prototype.off.call(this, event, handler);
    };
    return PointerAbstraction;
}(Class_1.Class));
exports.PointerAbstraction = PointerAbstraction;
