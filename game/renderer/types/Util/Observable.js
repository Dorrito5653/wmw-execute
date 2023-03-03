"use strict";
exports.__esModule = true;
exports.Observable = void 0;
/**
 * Simple Observable implementation
 * @template T is the typescript Type that defines the data being observed
 */
var Observable = /** @class */ (function () {
    function Observable() {
        this.observers = [];
        this.subscriptions = [];
    }
    /**
     * Register an observer to listen to this observable
     * @param observer
     */
    Observable.prototype.register = function (observer) {
        this.observers.push(observer);
    };
    /**
     * Register a callback to listen to this observable
     * @param func
     */
    Observable.prototype.subscribe = function (func) {
        this.subscriptions.push(func);
    };
    /**
     * Remove an observer from the observable
     * @param observer
     */
    Observable.prototype.unregister = function (observer) {
        var i = this.observers.indexOf(observer);
        if (i !== -1) {
            this.observers.splice(i, 1);
        }
    };
    /**
     * Remove a callback that is listening to this observable
     * @param func
     */
    Observable.prototype.unsubscribe = function (func) {
        var i = this.subscriptions.indexOf(func);
        if (i !== -1) {
            this.subscriptions.splice(i, 1);
        }
    };
    /**
     * Broadcasts a message to all observers and callbacks
     * @param message
     */
    Observable.prototype.notifyAll = function (message) {
        var observersLength = this.observers.length;
        for (var i = 0; i < observersLength; i++) {
            this.observers[i].notify(message);
        }
        var subscriptionsLength = this.subscriptions.length;
        for (var i = 0; i < subscriptionsLength; i++) {
            this.subscriptions[i](message);
        }
    };
    /**
     * Removes all observers and callbacks
     */
    Observable.prototype.clear = function () {
        this.observers.length = 0;
        this.subscriptions.length = 0;
    };
    return Observable;
}());
exports.Observable = Observable;
