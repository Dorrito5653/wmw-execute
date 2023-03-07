"use strict";
exports.__esModule = true;
exports.BrowserEvents = exports.BrowserComponent = void 0;
var BrowserComponent = /** @class */ (function () {
    function BrowserComponent(nativeComponent) {
        this.nativeComponent = nativeComponent;
        this._paused = false;
        this._nativeHandlers = {};
    }
    BrowserComponent.prototype.on = function (eventName, handler) {
        if (this._nativeHandlers[eventName]) {
            this.off(eventName, this._nativeHandlers[eventName]);
        }
        this._nativeHandlers[eventName] = this._decorate(handler);
        this.nativeComponent.addEventListener(eventName, this._nativeHandlers[eventName]);
    };
    BrowserComponent.prototype.off = function (eventName, handler) {
        if (!handler) {
            handler = this._nativeHandlers[eventName];
        }
        this.nativeComponent.removeEventListener(eventName, handler);
        this._nativeHandlers[eventName] = null;
    };
    BrowserComponent.prototype._decorate = function (handler) {
        var _this = this;
        return function (evt) {
            if (!_this._paused) {
                handler(evt);
            }
        };
    };
    BrowserComponent.prototype.pause = function () {
        this._paused = true;
    };
    BrowserComponent.prototype.resume = function () {
        this._paused = false;
    };
    BrowserComponent.prototype.clear = function () {
        for (var event_1 in this._nativeHandlers) {
            this.off(event_1);
        }
    };
    return BrowserComponent;
}());
exports.BrowserComponent = BrowserComponent;
var BrowserEvents = /** @class */ (function () {
    function BrowserEvents(_windowGlobal, _documentGlobal) {
        this._windowGlobal = _windowGlobal;
        this._documentGlobal = _documentGlobal;
        this._windowComponent = new BrowserComponent(this._windowGlobal);
        this._documentComponent = new BrowserComponent(this._documentGlobal);
    }
    Object.defineProperty(BrowserEvents.prototype, "window", {
        get: function () {
            return this._windowComponent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserEvents.prototype, "document", {
        get: function () {
            return this._documentComponent;
        },
        enumerable: false,
        configurable: true
    });
    BrowserEvents.prototype.pause = function () {
        this.window.pause();
        this.document.pause();
    };
    BrowserEvents.prototype.resume = function () {
        this.window.resume();
        this.document.resume();
    };
    BrowserEvents.prototype.clear = function () {
        this.window.clear();
        this.document.clear();
    };
    return BrowserEvents;
}());
exports.BrowserEvents = BrowserEvents;
