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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.obsolete = exports.resetObsoleteCounter = exports.maxMessages = void 0;
var Flags_1 = require("../Flags");
var Log_1 = require("./Log");
exports.maxMessages = 5;
var obsoleteMessage = {};
var resetObsoleteCounter = function () {
    for (var message in obsoleteMessage) {
        obsoleteMessage[message] = 0;
    }
};
exports.resetObsoleteCounter = resetObsoleteCounter;
var logMessage = function (message, options) {
    var suppressObsoleteMessages = Flags_1.Flags.isEnabled('suppress-obsolete-message');
    if (obsoleteMessage[message] < exports.maxMessages && !suppressObsoleteMessages) {
        Log_1.Logger.getInstance().warn(message);
        // tslint:disable-next-line: no-console
        if (console.trace && options.showStackTrace) {
            // tslint:disable-next-line: no-console
            console.trace();
        }
    }
    obsoleteMessage[message]++;
};
/**
 * Obsolete decorator for marking Excalibur methods obsolete, you can optionally specify a custom message and/or alternate replacement
 * method do the deprecated one. Inspired by https://github.com/jayphelps/core-decorators.js
 */
function obsolete(options) {
    options = __assign({ message: 'This feature will be removed in future versions of Excalibur.', alternateMethod: null, showStackTrace: false }, options);
    return function (target, property, descriptor) {
        if (descriptor &&
            !(typeof descriptor.value === 'function' || typeof descriptor.get === 'function' || typeof descriptor.set === 'function')) {
            throw new SyntaxError('Only classes/functions/getters/setters can be marked as obsolete');
        }
        var methodSignature = "".concat(target.name || '').concat(target.name && property ? '.' : '').concat(property ? property : '');
        var message = "".concat(methodSignature, " is marked obsolete: ").concat(options.message) +
            (options.alternateMethod ? " Use ".concat(options.alternateMethod, " instead") : '');
        if (!obsoleteMessage[message]) {
            obsoleteMessage[message] = 0;
        }
        // If descriptor is null it is a class
        var method = descriptor ? __assign({}, descriptor) : target;
        if (!descriptor) {
            // with es2015 classes we need to change our decoration tactic
            var DecoratedClass = /** @class */ (function (_super) {
                __extends(DecoratedClass, _super);
                function DecoratedClass() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    logMessage(message, options);
                    return _super.apply(this, args) || this;
                }
                return DecoratedClass;
            }(method));
            return DecoratedClass;
        }
        if (descriptor && descriptor.value) {
            method.value = function () {
                logMessage(message, options);
                return descriptor.value.apply(this, arguments);
            };
            return method;
        }
        if (descriptor && descriptor.get) {
            method.get = function () {
                logMessage(message, options);
                return descriptor.get.apply(this, arguments);
            };
        }
        if (descriptor && descriptor.set) {
            method.set = function () {
                logMessage(message, options);
                return descriptor.set.apply(this, arguments);
            };
        }
        return method;
    };
}
exports.obsolete = obsolete;
