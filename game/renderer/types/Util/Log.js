"use strict";
exports.__esModule = true;
exports.ScreenAppender = exports.ConsoleAppender = exports.Logger = exports.LogLevel = void 0;
/* eslint-disable no-console */
/**
 * Logging level that Excalibur will tag
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 0] = "Debug";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Fatal"] = 4] = "Fatal";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Static singleton that represents the logging facility for Excalibur.
 * Excalibur comes built-in with a [[ConsoleAppender]] and [[ScreenAppender]].
 * Derive from [[Appender]] to create your own logging appenders.
 */
var Logger = /** @class */ (function () {
    function Logger() {
        this._appenders = [];
        /**
         * Gets or sets the default logging level. Excalibur will only log
         * messages if equal to or above this level. Default: [[LogLevel.Info]]
         */
        this.defaultLevel = LogLevel.Info;
        if (Logger._INSTANCE) {
            throw new Error('Logger is a singleton');
        }
        Logger._INSTANCE = this;
        // Default console appender
        Logger._INSTANCE.addAppender(new ConsoleAppender());
        return Logger._INSTANCE;
    }
    /**
     * Gets the current static instance of Logger
     */
    Logger.getInstance = function () {
        if (Logger._INSTANCE == null) {
            Logger._INSTANCE = new Logger();
        }
        return Logger._INSTANCE;
    };
    /**
     * Adds a new [[Appender]] to the list of appenders to write to
     */
    Logger.prototype.addAppender = function (appender) {
        this._appenders.push(appender);
    };
    /**
     * Clears all appenders from the logger
     */
    Logger.prototype.clearAppenders = function () {
        this._appenders.length = 0;
    };
    /**
     * Logs a message at a given LogLevel
     * @param level  The LogLevel`to log the message at
     * @param args   An array of arguments to write to an appender
     */
    Logger.prototype._log = function (level, args) {
        if (level == null) {
            level = this.defaultLevel;
        }
        var len = this._appenders.length;
        for (var i = 0; i < len; i++) {
            if (level >= this.defaultLevel) {
                this._appenders[i].log(level, args);
            }
        }
    };
    /**
     * Writes a log message at the [[LogLevel.Debug]] level
     * @param args  Accepts any number of arguments
     */
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogLevel.Debug, args);
    };
    /**
     * Writes a log message at the [[LogLevel.Info]] level
     * @param args  Accepts any number of arguments
     */
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogLevel.Info, args);
    };
    /**
     * Writes a log message at the [[LogLevel.Warn]] level
     * @param args  Accepts any number of arguments
     */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogLevel.Warn, args);
    };
    /**
     * Writes a log message at the [[LogLevel.Error]] level
     * @param args  Accepts any number of arguments
     */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogLevel.Error, args);
    };
    /**
     * Writes a log message at the [[LogLevel.Fatal]] level
     * @param args  Accepts any number of arguments
     */
    Logger.prototype.fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogLevel.Fatal, args);
    };
    Logger._INSTANCE = null;
    return Logger;
}());
exports.Logger = Logger;
/**
 * Console appender for browsers (i.e. `console.log`)
 */
var ConsoleAppender = /** @class */ (function () {
    function ConsoleAppender() {
    }
    /**
     * Logs a message at the given [[LogLevel]]
     * @param level  Level to log at
     * @param args   Arguments to log
     */
    ConsoleAppender.prototype.log = function (level, args) {
        // Check for console support
        if (!console && !console.log && console.warn && console.error) {
            // todo maybe do something better than nothing
            return;
        }
        // Create a new console args array
        var consoleArgs = [];
        consoleArgs.unshift.apply(consoleArgs, args);
        consoleArgs.unshift('[' + LogLevel[level] + '] : ');
        if (level < LogLevel.Warn) {
            // Call .log for Debug/Info
            if (console.log.apply) {
                // this is required on some older browsers that don't support apply on console.log :(
                console.log.apply(console, consoleArgs);
            }
            else {
                console.log(consoleArgs.join(' '));
            }
        }
        else if (level < LogLevel.Error) {
            // Call .warn for Warn
            if (console.warn.apply) {
                console.warn.apply(console, consoleArgs);
            }
            else {
                console.warn(consoleArgs.join(' '));
            }
        }
        else {
            // Call .error for Error/Fatal
            if (console.error.apply) {
                console.error.apply(console, consoleArgs);
            }
            else {
                console.error(consoleArgs.join(' '));
            }
        }
    };
    return ConsoleAppender;
}());
exports.ConsoleAppender = ConsoleAppender;
/**
 * On-screen (canvas) appender
 */
var ScreenAppender = /** @class */ (function () {
    /**
     * @param width   Width of the screen appender in pixels
     * @param height  Height of the screen appender in pixels
     */
    function ScreenAppender(width, height) {
        // @todo Clean this up
        this._messages = [];
        this._canvas = document.createElement('canvas');
        this._canvas.width = width || window.innerWidth;
        this._canvas.height = height || window.innerHeight;
        this._canvas.style.position = 'absolute';
        // eslint-disable-next-line
        this._ctx = this._canvas.getContext('2d'); // eslint-disable-line
        document.body.appendChild(this._canvas);
    }
    /**
     * Logs a message at the given [[LogLevel]]
     * @param level  Level to log at
     * @param args   Arguments to log
     */
    ScreenAppender.prototype.log = function (level, args) {
        var message = args.join(',');
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._messages.unshift('[' + LogLevel[level] + '] : ' + message);
        var pos = 10;
        var opacity = 1.0;
        for (var i = 0; i < this._messages.length; i++) {
            this._ctx.fillStyle = 'rgba(255,255,255,' + opacity.toFixed(2) + ')';
            this._ctx.fillText(this._messages[i], 200, pos);
            pos += 10;
            opacity = opacity > 0 ? opacity - 0.05 : 0;
        }
    };
    return ScreenAppender;
}());
exports.ScreenAppender = ScreenAppender;
