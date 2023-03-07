"use strict";
exports.__esModule = true;
exports.randomIntInRange = exports.randomInRange = exports.range = exports.toRadians = exports.toDegrees = exports.canonicalizeAngle = exports.clamp = exports.sign = exports.frac = exports.TwoPI = void 0;
var Random_1 = require("./Random");
/**
 * Two PI constant
 */
exports.TwoPI = Math.PI * 2;
/**
 * Returns the fractional part of a number
 * @param x
 */
function frac(x) {
    if (x >= 0) {
        return x - Math.floor(x);
    }
    else {
        return x - Math.ceil(x);
    }
}
exports.frac = frac;
/**
 * Returns the sign of a number, if 0 returns 0
 */
function sign(val) {
    if (val === 0) {
        return 0;
    }
    return val < 0 ? -1 : 1;
}
exports.sign = sign;
;
/**
 * Clamps a value between a min and max inclusive
 */
function clamp(val, min, max) {
    return Math.min(Math.max(min, val), max);
}
exports.clamp = clamp;
/**
 * Convert an angle to be the equivalent in the range [0, 2PI]
 */
function canonicalizeAngle(angle) {
    var tmpAngle = angle;
    if (angle > exports.TwoPI) {
        while (tmpAngle > exports.TwoPI) {
            tmpAngle -= exports.TwoPI;
        }
    }
    if (angle < 0) {
        while (tmpAngle < 0) {
            tmpAngle += exports.TwoPI;
        }
    }
    return tmpAngle;
}
exports.canonicalizeAngle = canonicalizeAngle;
/**
 * Convert radians to degrees
 */
function toDegrees(radians) {
    return (180 / Math.PI) * radians;
}
exports.toDegrees = toDegrees;
/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
    return (degrees / 180) * Math.PI;
}
exports.toRadians = toRadians;
/**
 * Generate a range of numbers
 * For example: range(0, 5) -> [0, 1, 2, 3, 4, 5]
 * @param from inclusive
 * @param to inclusive
 */
var range = function (from, to) { return Array.from(new Array(to - from + 1), function (_x, i) { return i + from; }); };
exports.range = range;
/**
 * Find a random floating point number in range
 */
function randomInRange(min, max, random) {
    if (random === void 0) { random = new Random_1.Random(); }
    return random ? random.floating(min, max) : min + Math.random() * (max - min);
}
exports.randomInRange = randomInRange;
/**
 * Find a random integer in a range
 */
function randomIntInRange(min, max, random) {
    if (random === void 0) { random = new Random_1.Random(); }
    return random ? random.integer(min, max) : Math.round(randomInRange(min, max));
}
exports.randomIntInRange = randomIntInRange;
