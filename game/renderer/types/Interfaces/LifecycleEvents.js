"use strict";
exports.__esModule = true;
exports.hasPostDraw = exports.hasPreDraw = exports.hasOnPostUpdate = exports.has_postupdate = exports.hasOnPreUpdate = exports.has_preupdate = exports.hasOnInitialize = exports.has_initialize = void 0;
/**
 * Type guard checking for internal initialize method
 * @internal
 * @param a
 */
function has_initialize(a) {
    return !!a._initialize;
}
exports.has_initialize = has_initialize;
/**
 *
 */
function hasOnInitialize(a) {
    return !!a.onInitialize;
}
exports.hasOnInitialize = hasOnInitialize;
/**
 *
 */
function has_preupdate(a) {
    return !!a._preupdate;
}
exports.has_preupdate = has_preupdate;
/**
 *
 */
function hasOnPreUpdate(a) {
    return !!a.onPreUpdate;
}
exports.hasOnPreUpdate = hasOnPreUpdate;
/**
 *
 */
function has_postupdate(a) {
    return !!a.onPostUpdate;
}
exports.has_postupdate = has_postupdate;
/**
 *
 */
function hasOnPostUpdate(a) {
    return !!a.onPostUpdate;
}
exports.hasOnPostUpdate = hasOnPostUpdate;
/**
 *
 */
function hasPreDraw(a) {
    return !!a.onPreDraw;
}
exports.hasPreDraw = hasPreDraw;
/**
 *
 */
function hasPostDraw(a) {
    return !!a.onPostDraw;
}
exports.hasPostDraw = hasPostDraw;
