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
exports.NativeSoundProcessedEvent = exports.NativeSoundEvent = exports.MediaEvent = void 0;
var Events_1 = require("../Events");
var MediaEvent = /** @class */ (function (_super) {
    __extends(MediaEvent, _super);
    function MediaEvent(target, _name) {
        if (_name === void 0) { _name = 'MediaEvent'; }
        var _this = _super.call(this) || this;
        _this.target = target;
        _this._name = _name;
        return _this;
    }
    Object.defineProperty(MediaEvent.prototype, "bubbles", {
        /**
         * Media event cannot bubble
         */
        get: function () {
            return false;
        },
        /**
         * Media event cannot bubble
         */
        set: function (_value) {
            // stubbed
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaEvent.prototype, "_path", {
        /**
         * Media event cannot bubble, so they have no path
         */
        get: function () {
            return null;
        },
        /**
         * Media event cannot bubble, so they have no path
         */
        set: function (_val) {
            // stubbed
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Prevents event from bubbling
     */
    MediaEvent.prototype.stopPropagation = function () {
        /**
         * Stub
         */
    };
    /**
     * Action, that calls when event happens
     */
    MediaEvent.prototype.action = function () {
        /**
         * Stub
         */
    };
    /**
     * Propagate event further through event path
     */
    MediaEvent.prototype.propagate = function () {
        /**
         * Stub
         */
    };
    MediaEvent.prototype.layPath = function (_actor) {
        /**
         * Stub
         */
    };
    return MediaEvent;
}(Events_1.GameEvent));
exports.MediaEvent = MediaEvent;
var NativeSoundEvent = /** @class */ (function (_super) {
    __extends(NativeSoundEvent, _super);
    function NativeSoundEvent(target, track) {
        var _this = _super.call(this, target, 'NativeSoundEvent') || this;
        _this.track = track;
        return _this;
    }
    return NativeSoundEvent;
}(MediaEvent));
exports.NativeSoundEvent = NativeSoundEvent;
var NativeSoundProcessedEvent = /** @class */ (function (_super) {
    __extends(NativeSoundProcessedEvent, _super);
    function NativeSoundProcessedEvent(target, _processedData) {
        var _this = _super.call(this, target, 'NativeSoundProcessedEvent') || this;
        _this._processedData = _processedData;
        _this.data = _this._processedData;
        return _this;
    }
    return NativeSoundProcessedEvent;
}(MediaEvent));
exports.NativeSoundProcessedEvent = NativeSoundProcessedEvent;
