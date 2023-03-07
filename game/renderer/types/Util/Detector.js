"use strict";
exports.__esModule = true;
exports.Detector = void 0;
var Log_1 = require("./Log");
/**
 * This is the list of features that will be used to log the supported
 * features to the console when Detector.logBrowserFeatures() is called.
 */
var REPORTED_FEATURES = {
    webgl: 'WebGL',
    webaudio: 'WebAudio',
    gamepadapi: 'Gamepad API'
};
/**
 * Excalibur internal feature detection helper class
 */
var Detector = /** @class */ (function () {
    function Detector() {
        this._features = null;
        this.failedTests = [];
        // critical browser features required for ex to run
        this._criticalTests = {
            // Test canvas/2d context support
            canvasSupport: function () {
                var elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            },
            // Test array buffer support ex uses for downloading binary data
            arrayBufferSupport: function () {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/');
                try {
                    xhr.responseType = 'arraybuffer';
                }
                catch (e) {
                    return false;
                }
                return xhr.responseType === 'arraybuffer';
            },
            // Test data urls ex uses for sprites
            dataUrlSupport: function () {
                var canvas = document.createElement('canvas');
                return canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
            },
            // Test object url support for loading
            objectUrlSupport: function () {
                return 'URL' in window && 'revokeObjectURL' in URL && 'createObjectURL' in URL;
            },
            // RGBA support for colors
            rgbaSupport: function () {
                var style = document.createElement('a').style;
                style.cssText = 'background-color:rgba(150,255,150,.5)';
                return ('' + style.backgroundColor).indexOf('rgba') > -1;
            }
        };
        // warnings excalibur performance will be degraded
        this._warningTest = {
            webAudioSupport: function () {
                return !!(window.AudioContext ||
                    window.webkitAudioContext ||
                    window.mozAudioContext ||
                    window.msAudioContext ||
                    window.oAudioContext);
            },
            webglSupport: function () {
                var elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('webgl'));
            }
        };
        this._features = this._loadBrowserFeatures();
    }
    /**
     * Returns a map of currently supported browser features. This method
     * treats the features as a singleton and will only calculate feature
     * support if it has not previously been done.
     */
    Detector.prototype.getBrowserFeatures = function () {
        if (this._features === null) {
            this._features = this._loadBrowserFeatures();
        }
        return this._features;
    };
    /**
     * Report on non-critical browser support for debugging purposes.
     * Use native browser console colors for visibility.
     */
    Detector.prototype.logBrowserFeatures = function () {
        var msg = '%cSUPPORTED BROWSER FEATURES\n==========================%c\n';
        var args = ['font-weight: bold; color: navy', 'font-weight: normal; color: inherit'];
        var supported = this.getBrowserFeatures();
        for (var _i = 0, _a = Object.keys(REPORTED_FEATURES); _i < _a.length; _i++) {
            var feature = _a[_i];
            if (supported[feature]) {
                msg += '(%c\u2713%c)'; // (✓)
                args.push('font-weight: bold; color: green');
                args.push('font-weight: normal; color: inherit');
            }
            else {
                msg += '(%c\u2717%c)'; // (✗)
                args.push('font-weight: bold; color: red');
                args.push('font-weight: normal; color: inherit');
            }
            msg += ' ' + REPORTED_FEATURES[feature] + '\n';
        }
        args.unshift(msg);
        // eslint-disable-next-line no-console
        console.log.apply(console, args);
    };
    /**
     * Executes several IIFE's to get a constant reference to supported
     * features within the current execution context.
     */
    Detector.prototype._loadBrowserFeatures = function () {
        var _this = this;
        return {
            // IIFE to check canvas support
            canvas: (function () {
                return _this._criticalTests.canvasSupport();
            })(),
            // IIFE to check arraybuffer support
            arraybuffer: (function () {
                return _this._criticalTests.arrayBufferSupport();
            })(),
            // IIFE to check dataurl support
            dataurl: (function () {
                return _this._criticalTests.dataUrlSupport();
            })(),
            // IIFE to check objecturl support
            objecturl: (function () {
                return _this._criticalTests.objectUrlSupport();
            })(),
            // IIFE to check rgba support
            rgba: (function () {
                return _this._criticalTests.rgbaSupport();
            })(),
            // IIFE to check webaudio support
            webaudio: (function () {
                return _this._warningTest.webAudioSupport();
            })(),
            // IIFE to check webgl support
            webgl: (function () {
                return _this._warningTest.webglSupport();
            })(),
            // IIFE to check gamepadapi support
            gamepadapi: (function () {
                return !!navigator.getGamepads;
            })()
        };
    };
    Detector.prototype.test = function () {
        // Critical test will for ex not to run
        var failedCritical = false;
        for (var test in this._criticalTests) {
            if (!this._criticalTests[test].call(this)) {
                this.failedTests.push(test);
                Log_1.Logger.getInstance().error('Critical browser feature missing, Excalibur requires:', test);
                failedCritical = true;
            }
        }
        if (failedCritical) {
            return false;
        }
        // Warning tests do not for ex to return false to compatibility
        for (var warning in this._warningTest) {
            if (!this._warningTest[warning]()) {
                Log_1.Logger.getInstance().warn('Warning browser feature missing, Excalibur will have reduced performance:', warning);
            }
        }
        return true;
    };
    return Detector;
}());
exports.Detector = Detector;
