"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Semaphore = void 0;
var Future_1 = require("./Future");
var AsyncWaitQueue = /** @class */ (function () {
    function AsyncWaitQueue() {
        // Code from StephenCleary https://gist.github.com/StephenCleary/ba50b2da419c03b9cba1d20cb4654d5e
        this._queue = [];
    }
    Object.defineProperty(AsyncWaitQueue.prototype, "length", {
        get: function () {
            return this._queue.length;
        },
        enumerable: false,
        configurable: true
    });
    AsyncWaitQueue.prototype.enqueue = function () {
        var future = new Future_1.Future();
        this._queue.push(future);
        return future.promise;
    };
    AsyncWaitQueue.prototype.dequeue = function (value) {
        var future = this._queue.shift();
        future.resolve(value);
    };
    return AsyncWaitQueue;
}());
/**
 * Semaphore allows you to limit the amount of async calls happening between `enter()` and `exit()`
 *
 * This can be useful when limiting the number of http calls, browser api calls, etc either for performance or to work
 * around browser limitations like max Image.decode() calls in chromium being 256.
 */
var Semaphore = /** @class */ (function () {
    function Semaphore(_count) {
        this._count = _count;
        this._waitQueue = new AsyncWaitQueue();
    }
    Object.defineProperty(Semaphore.prototype, "count", {
        get: function () {
            return this._count;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Semaphore.prototype, "waiting", {
        get: function () {
            return this._waitQueue.length;
        },
        enumerable: false,
        configurable: true
    });
    Semaphore.prototype.enter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this._count !== 0) {
                    this._count--;
                    return [2 /*return*/, Promise.resolve()];
                }
                return [2 /*return*/, this._waitQueue.enqueue()];
            });
        });
    };
    Semaphore.prototype.exit = function (count) {
        if (count === void 0) { count = 1; }
        if (count === 0) {
            return;
        }
        while (count !== 0 && this._waitQueue.length !== 0) {
            this._waitQueue.dequeue(null);
            count--;
        }
        this._count += count;
    };
    return Semaphore;
}());
exports.Semaphore = Semaphore;
