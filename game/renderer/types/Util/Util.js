"use strict";
exports.__esModule = true;
exports.delay = exports.fail = exports.contains = exports.removeItemFromArray = exports.addItemToArray = exports.getPosition = void 0;
var vector_1 = require("../Math/vector");
var Future_1 = require("./Future");
/**
 * Find the screen position of an HTML element
 */
function getPosition(el) {
    var oLeft = 0, oTop = 0;
    var calcOffsetLeft = function (parent) {
        oLeft += parent.offsetLeft;
        if (parent.offsetParent) {
            calcOffsetLeft(parent.offsetParent);
        }
    };
    var calcOffsetTop = function (parent) {
        oTop += parent.offsetTop;
        if (parent.offsetParent) {
            calcOffsetTop(parent.offsetParent);
        }
    };
    calcOffsetLeft(el);
    calcOffsetTop(el);
    return new vector_1.Vector(oLeft, oTop);
}
exports.getPosition = getPosition;
/**
 * Add an item to an array list if it doesn't already exist. Returns true if added, false if not and already exists in the array.
 * @deprecated Will be removed in v0.26.0
 */
function addItemToArray(item, array) {
    if (array.indexOf(item) === -1) {
        array.push(item);
        return true;
    }
    return false;
}
exports.addItemToArray = addItemToArray;
/**
 * Remove an item from an list
 * @deprecated Will be removed in v0.26.0
 */
function removeItemFromArray(item, array) {
    var index = -1;
    if ((index = array.indexOf(item)) > -1) {
        array.splice(index, 1);
        return true;
    }
    return false;
}
exports.removeItemFromArray = removeItemFromArray;
/**
 * See if an array contains something
 */
function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}
exports.contains = contains;
/**
 * Used for exhaustive checks at compile time
 */
function fail(message) {
    throw new Error(message);
}
exports.fail = fail;
/**
 * Create a promise that resolves after a certain number of milliseconds
 *
 * It is strongly recommended you pass the excalibur clock so delays are bound to the
 * excalibur clock which would be unaffected by stop/pause.
 * @param milliseconds
 * @param clock
 */
function delay(milliseconds, clock) {
    var _a;
    var future = new Future_1.Future();
    var schedule = (_a = clock === null || clock === void 0 ? void 0 : clock.schedule.bind(clock)) !== null && _a !== void 0 ? _a : setTimeout;
    schedule(function () {
        future.resolve();
    }, milliseconds);
    return future.promise;
}
exports.delay = delay;
