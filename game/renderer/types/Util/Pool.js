"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Pool = void 0;
var __1 = require("..");
var Pool = /** @class */ (function () {
    function Pool(builder, recycler, maxObjects) {
        if (maxObjects === void 0) { maxObjects = 100; }
        this.builder = builder;
        this.recycler = recycler;
        this.maxObjects = maxObjects;
        this.totalAllocations = 0;
        this.index = 0;
        this.objects = [];
        this.disableWarnings = false;
        this._logger = __1.Logger.getInstance();
    }
    Pool.prototype.preallocate = function () {
        for (var i = 0; i < this.maxObjects; i++) {
            this.objects[i] = this.builder();
        }
    };
    /**
     * Use many instances out of the in the context and return all to the pool.
     *
     * By returning values out of the context they will be un-hooked from the pool and are free to be passed to consumers
     * @param context
     */
    Pool.prototype.using = function (context) {
        var result = context(this);
        if (result) {
            return this.done.apply(this, result);
        }
        return this.done();
    };
    /**
     * Use a single instance out of th pool and immediately return it to the pool
     * @param context
     */
    Pool.prototype.borrow = function (context) {
        var object = this.get();
        context(object);
        this.index--;
    };
    /**
     * Retrieve a value from the pool, will allocate a new instance if necessary or recycle from the pool
     * @param args
     */
    Pool.prototype.get = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.index === this.maxObjects) {
            if (!this.disableWarnings) {
                this._logger.warn('Max pooled objects reached, possible memory leak? Doubling');
            }
            this.maxObjects = this.maxObjects * 2;
        }
        if (this.objects[this.index]) {
            // Pool has an available object already constructed
            return this.recycler.apply(this, __spreadArray([this.objects[this.index++]], args, false));
        }
        else {
            // New allocation
            this.totalAllocations++;
            var object = (this.objects[this.index++] = this.builder.apply(this, args));
            return object;
        }
    };
    Pool.prototype.done = function () {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        // All objects in pool now considered "free"
        this.index = 0;
        for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
            var object = objects_1[_a];
            var poolIndex = this.objects.indexOf(object);
            // Build a new object to take the pool place
            this.objects[poolIndex] = this.builder(); // TODO problematic 0-arg only support
            this.totalAllocations++;
        }
        return objects;
    };
    return Pool;
}());
exports.Pool = Pool;
