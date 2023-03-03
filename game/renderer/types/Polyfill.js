"use strict";
exports.__esModule = true;
exports.polyfill = void 0;
require("core-js/es/array/sort");
require("core-js/es/object/keys");
/**
 * Polyfill adding function
 */
function polyfill() {
    /* istanbul ignore next */
    if (typeof window === 'undefined') {
        window = {
            audioContext: function () {
                return;
            }
        };
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setInterval(callback, 1000 / 60);
                };
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.cancelAnimationFrame) {
        window.cancelAnimationFrame =
            window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                function () {
                    return;
                };
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.AudioContext) {
        if (window.webkitAudioContext) {
            var ctx = window.webkitAudioContext;
            var replaceMe_1 = ctx.prototype.decodeAudioData;
            window.webkitAudioContext.prototype.decodeAudioData = function (arrayBuffer) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    replaceMe_1.call(_this, arrayBuffer, resolve, reject);
                });
            };
        }
        window.AudioContext =
            window.AudioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.msAudioContext ||
                window.oAudioContext;
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.devicePixelRatio) {
        window.devicePixelRatio = window.devicePixelRatio || 1;
    }
}
exports.polyfill = polyfill;
