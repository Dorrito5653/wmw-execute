"use strict";
exports.__esModule = true;
exports.Resource = void 0;
var Log_1 = require("../Util/Log");
var EventDispatcher_1 = require("../EventDispatcher");
/**
 * The [[Resource]] type allows games built in Excalibur to load generic resources.
 * For any type of remote resource it is recommended to use [[Resource]] for preloading.
 */
var Resource = /** @class */ (function () {
    /**
     * @param path          Path to the remote resource
     * @param responseType  The type to expect as a response: "" | "arraybuffer" | "blob" | "document" | "json" | "text";
     * @param bustCache     Whether or not to cache-bust requests
     */
    function Resource(path, responseType, bustCache) {
        if (bustCache === void 0) { bustCache = true; }
        this.path = path;
        this.responseType = responseType;
        this.bustCache = bustCache;
        this.data = null;
        this.logger = Log_1.Logger.getInstance();
        this.events = new EventDispatcher_1.EventDispatcher();
    }
    /**
     * Returns true if the Resource is completely loaded and is ready
     * to be drawn.
     */
    Resource.prototype.isLoaded = function () {
        return this.data !== null;
    };
    Resource.prototype._cacheBust = function (uri) {
        var query = /\?\w*=\w*/;
        if (query.test(uri)) {
            uri += '&__=' + Date.now();
        }
        else {
            uri += '?__=' + Date.now();
        }
        return uri;
    };
    /**
     * Begin loading the resource and returns a promise to be resolved on completion
     */
    Resource.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Exit early if we already have data
            if (_this.data !== null) {
                _this.logger.debug('Already have data for resource', _this.path);
                _this.events.emit('complete', _this.data);
                resolve(_this.data);
                return;
            }
            var request = new XMLHttpRequest();
            request.open('GET', _this.bustCache ? _this._cacheBust(_this.path) : _this.path, true);
            request.responseType = _this.responseType;
            request.addEventListener('loadstart', function (e) { return _this.events.emit('loadstart', e); });
            request.addEventListener('progress', function (e) { return _this.events.emit('progress', e); });
            request.addEventListener('error', function (e) { return _this.events.emit('error', e); });
            request.addEventListener('load', function (e) { return _this.events.emit('load', e); });
            request.addEventListener('load', function () {
                // XHR on file:// success status is 0, such as with PhantomJS
                if (request.status !== 0 && request.status !== 200) {
                    _this.logger.error('Failed to load resource ', _this.path, ' server responded with error code', request.status);
                    _this.events.emit('error', request.response);
                    reject(new Error(request.statusText));
                    return;
                }
                _this.data = request.response;
                _this.events.emit('complete', _this.data);
                _this.logger.debug('Completed loading resource', _this.path);
                resolve(_this.data);
            });
            request.send();
        });
    };
    return Resource;
}());
exports.Resource = Resource;
