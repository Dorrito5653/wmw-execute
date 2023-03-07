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
exports.Trigger = void 0;
var EventDispatcher_1 = require("./EventDispatcher");
var vector_1 = require("./Math/vector");
var Events_1 = require("./Events");
var CollisionType_1 = require("./Collision/CollisionType");
var Actor_1 = require("./Actor");
var triggerDefaults = {
    pos: vector_1.Vector.Zero,
    width: 10,
    height: 10,
    visible: false,
    action: function () {
        return;
    },
    filter: function () { return true; },
    repeat: -1
};
/**
 * Triggers are a method of firing arbitrary code on collision. These are useful
 * as 'buttons', 'switches', or to trigger effects in a game. By default triggers
 * are invisible, and can only be seen when [[Trigger.visible]] is set to `true`.
 */
var Trigger = /** @class */ (function (_super) {
    __extends(Trigger, _super);
    /**
     *
     * @param opts Trigger options
     */
    function Trigger(opts) {
        var _this = _super.call(this, { x: opts.pos.x, y: opts.pos.y, width: opts.width, height: opts.height }) || this;
        /**
         * Action to fire when triggered by collision
         */
        _this.action = function () {
            return;
        };
        /**
         * Filter to add additional granularity to action dispatch, if a filter is specified the action will only fire when
         * filter return true for the collided actor.
         */
        _this.filter = function () { return true; };
        /**
         * Number of times to repeat before killing the trigger,
         */
        _this.repeat = -1;
        opts = __assign(__assign({}, triggerDefaults), opts);
        _this.filter = opts.filter || _this.filter;
        _this.repeat = opts.repeat || _this.repeat;
        _this.action = opts.action || _this.action;
        if (opts.target) {
            _this.target = opts.target;
        }
        _this.graphics.visible = opts.visible;
        _this.body.collisionType = CollisionType_1.CollisionType.Passive;
        _this.eventDispatcher = new EventDispatcher_1.EventDispatcher();
        _this.events.on('collisionstart', function (evt) {
            if (_this.filter(evt.other)) {
                _this.emit('enter', new Events_1.EnterTriggerEvent(_this, evt.other));
                _this._dispatchAction();
                // remove trigger if its done, -1 repeat forever
                if (_this.repeat === 0) {
                    _this.kill();
                }
            }
        });
        _this.events.on('collisionend', function (evt) {
            if (_this.filter(evt.other)) {
                _this.emit('exit', new Events_1.ExitTriggerEvent(_this, evt.other));
            }
        });
        return _this;
    }
    Object.defineProperty(Trigger.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (target) {
            this._target = target;
            this.filter = function (actor) { return actor === target; };
        },
        enumerable: false,
        configurable: true
    });
    Trigger.prototype._initialize = function (engine) {
        _super.prototype._initialize.call(this, engine);
    };
    Trigger.prototype._dispatchAction = function () {
        if (this.repeat !== 0) {
            this.action.call(this);
            this.repeat--;
        }
    };
    return Trigger;
}(Actor_1.Actor));
exports.Trigger = Trigger;
