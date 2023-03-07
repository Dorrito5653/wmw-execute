"use strict";
exports.__esModule = true;
exports.EventDispatcher = void 0;
var Events_1 = require("./Events");
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this._handlers = {};
        this._wiredEventDispatchers = [];
        this._deferedHandlerRemovals = [];
    }
    /**
     * Clears any existing handlers or wired event dispatchers on this event dispatcher
     */
    EventDispatcher.prototype.clear = function () {
        this._handlers = {};
        this._wiredEventDispatchers = [];
    };
    EventDispatcher.prototype._processDeferredHandlerRemovals = function () {
        for (var _i = 0, _a = this._deferedHandlerRemovals; _i < _a.length; _i++) {
            var eventHandler = _a[_i];
            this._removeHandler(eventHandler.name, eventHandler.handler);
        }
        this._deferedHandlerRemovals.length = 0;
    };
    /**
     * Emits an event for target
     * @param eventName  The name of the event to publish
     * @param event      Optionally pass an event data object to the handler
     */
    EventDispatcher.prototype.emit = function (eventName, event) {
        this._processDeferredHandlerRemovals();
        if (!eventName) {
            // key not mapped
            return;
        }
        eventName = eventName.toLowerCase();
        if (!event) {
            event = new Events_1.GameEvent();
        }
        var i, len;
        if (this._handlers[eventName]) {
            i = 0;
            len = this._handlers[eventName].length;
            for (i; i < len; i++) {
                this._handlers[eventName][i](event);
            }
        }
        i = 0;
        len = this._wiredEventDispatchers.length;
        for (i; i < len; i++) {
            this._wiredEventDispatchers[i].emit(eventName, event);
        }
    };
    /**
     * Subscribe an event handler to a particular event name, multiple handlers per event name are allowed.
     * @param eventName  The name of the event to subscribe to
     * @param handler    The handler callback to fire on this event
     */
    EventDispatcher.prototype.on = function (eventName, handler) {
        this._processDeferredHandlerRemovals();
        eventName = eventName.toLowerCase();
        if (!this._handlers[eventName]) {
            this._handlers[eventName] = [];
        }
        this._handlers[eventName].push(handler);
    };
    /**
     * Unsubscribe an event handler(s) from an event. If a specific handler
     * is specified for an event, only that handler will be unsubscribed.
     * Otherwise all handlers will be unsubscribed for that event.
     *
     * @param eventName  The name of the event to unsubscribe
     * @param handler    Optionally the specific handler to unsubscribe
     */
    EventDispatcher.prototype.off = function (eventName, handler) {
        this._deferedHandlerRemovals.push({ name: eventName, handler: handler });
    };
    EventDispatcher.prototype._removeHandler = function (eventName, handler) {
        eventName = eventName.toLowerCase();
        var eventHandlers = this._handlers[eventName];
        if (eventHandlers) {
            // if no explicit handler is give with the event name clear all handlers
            if (!handler) {
                this._handlers[eventName].length = 0;
            }
            else {
                var index = eventHandlers.indexOf(handler);
                if (index > -1) {
                    this._handlers[eventName].splice(index, 1);
                }
            }
        }
    };
    /**
     * Once listens to an event one time, then unsubscribes from that event
     *
     * @param eventName The name of the event to subscribe to once
     * @param handler   The handler of the event that will be auto unsubscribed
     */
    EventDispatcher.prototype.once = function (eventName, handler) {
        var _this = this;
        this._processDeferredHandlerRemovals();
        var metaHandler = function (event) {
            var ev = event || new Events_1.GameEvent();
            _this.off(eventName, metaHandler);
            handler(ev);
        };
        this.on(eventName, metaHandler);
    };
    /**
     * Wires this event dispatcher to also receive events from another
     */
    EventDispatcher.prototype.wire = function (eventDispatcher) {
        eventDispatcher._wiredEventDispatchers.push(this);
    };
    /**
     * Unwires this event dispatcher from another
     */
    EventDispatcher.prototype.unwire = function (eventDispatcher) {
        var index = eventDispatcher._wiredEventDispatchers.indexOf(this);
        if (index > -1) {
            eventDispatcher._wiredEventDispatchers.splice(index, 1);
        }
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
