"use strict";
exports.__esModule = true;
exports.Class = void 0;
var EventDispatcher_1 = require("./EventDispatcher");
/**
 * Excalibur base class that provides basic functionality such as [[EventDispatcher]]
 * and extending abilities for vanilla Javascript projects
 */
var Class = /** @class */ (function () {
    function Class() {
        this.eventDispatcher = new EventDispatcher_1.EventDispatcher();
    }
    /**
     * Alias for `addEventListener`. You can listen for a variety of
     * events off of the engine; see the events section below for a complete list.
     * @param eventName  Name of the event to listen for
     * @param handler    Event handler for the thrown event
     */
    Class.prototype.on = function (eventName, handler) {
        this.eventDispatcher.on(eventName, handler);
    };
    /**
     * Alias for `removeEventListener`. If only the eventName is specified
     * it will remove all handlers registered for that specific event. If the eventName
     * and the handler instance are specified only that handler will be removed.
     *
     * @param eventName  Name of the event to listen for
     * @param handler    Event handler for the thrown event
     */
    Class.prototype.off = function (eventName, handler) {
        this.eventDispatcher.off(eventName, handler);
    };
    /**
     * Emits a new event
     * @param eventName   Name of the event to emit
     * @param eventObject Data associated with this event
     */
    Class.prototype.emit = function (eventName, eventObject) {
        this.eventDispatcher.emit(eventName, eventObject);
    };
    /**
     * Once listens to an event one time, then unsubscribes from that event
     *
     * @param eventName The name of the event to subscribe to once
     * @param handler   The handler of the event that will be auto unsubscribed
     */
    Class.prototype.once = function (eventName, handler) {
        this.eventDispatcher.once(eventName, handler);
    };
    return Class;
}());
exports.Class = Class;
