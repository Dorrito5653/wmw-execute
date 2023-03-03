"use strict";
exports.__esModule = true;
exports.ActionContext = void 0;
var EasingFunctions_1 = require("../Util/EasingFunctions");
var ActionQueue_1 = require("./ActionQueue");
var Repeat_1 = require("./Action/Repeat");
var RepeatForever_1 = require("./Action/RepeatForever");
var MoveBy_1 = require("./Action/MoveBy");
var MoveTo_1 = require("./Action/MoveTo");
var RotateTo_1 = require("./Action/RotateTo");
var RotateBy_1 = require("./Action/RotateBy");
var ScaleTo_1 = require("./Action/ScaleTo");
var ScaleBy_1 = require("./Action/ScaleBy");
var CallMethod_1 = require("./Action/CallMethod");
var EaseTo_1 = require("./Action/EaseTo");
var EaseBy_1 = require("./Action/EaseBy");
var Blink_1 = require("./Action/Blink");
var Fade_1 = require("./Action/Fade");
var Delay_1 = require("./Action/Delay");
var Die_1 = require("./Action/Die");
var Follow_1 = require("./Action/Follow");
var Meet_1 = require("./Action/Meet");
var vector_1 = require("../Math/vector");
/**
 * The fluent Action API allows you to perform "actions" on
 * [[Actor|Actors]] such as following, moving, rotating, and
 * more. You can implement your own actions by implementing
 * the [[Action]] interface.
 */
var ActionContext = /** @class */ (function () {
    function ActionContext(entity) {
        this._entity = entity;
        this._queue = new ActionQueue_1.ActionQueue(entity);
    }
    ActionContext.prototype.getQueue = function () {
        return this._queue;
    };
    ActionContext.prototype.update = function (elapsedMs) {
        this._queue.update(elapsedMs);
    };
    /**
     * Clears all queued actions from the Actor
     */
    ActionContext.prototype.clearActions = function () {
        this._queue.clearActions();
    };
    ActionContext.prototype.runAction = function (action) {
        action.reset();
        this._queue.add(action);
        return this;
    };
    ActionContext.prototype.easeTo = function () {
        var _a, _b;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var x = 0;
        var y = 0;
        var duration = 0;
        var easingFcn = EasingFunctions_1.EasingFunctions.Linear;
        if (args[0] instanceof vector_1.Vector) {
            x = args[0].x;
            y = args[0].y;
            duration = args[1];
            easingFcn = (_a = args[2]) !== null && _a !== void 0 ? _a : easingFcn;
        }
        else {
            x = args[0];
            y = args[1];
            duration = args[2];
            easingFcn = (_b = args[3]) !== null && _b !== void 0 ? _b : easingFcn;
        }
        this._queue.add(new EaseTo_1.EaseTo(this._entity, x, y, duration, easingFcn));
        return this;
    };
    ActionContext.prototype.easeBy = function () {
        var _a, _b;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var offsetX = 0;
        var offsetY = 0;
        var duration = 0;
        var easingFcn = EasingFunctions_1.EasingFunctions.Linear;
        if (args[0] instanceof vector_1.Vector) {
            offsetX = args[0].x;
            offsetY = args[0].y;
            duration = args[1];
            easingFcn = (_a = args[2]) !== null && _a !== void 0 ? _a : easingFcn;
        }
        else {
            offsetX = args[0];
            offsetY = args[1];
            duration = args[2];
            easingFcn = (_b = args[3]) !== null && _b !== void 0 ? _b : easingFcn;
        }
        this._queue.add(new EaseBy_1.EaseBy(this._entity, offsetX, offsetY, duration, easingFcn));
        return this;
    };
    ActionContext.prototype.moveTo = function (xOrPos, yOrSpeed, speedOrUndefined) {
        var x = 0;
        var y = 0;
        var speed = 0;
        if (xOrPos instanceof vector_1.Vector) {
            x = xOrPos.x;
            y = xOrPos.y;
            speed = yOrSpeed;
        }
        else {
            x = xOrPos;
            y = yOrSpeed;
            speed = speedOrUndefined;
        }
        this._queue.add(new MoveTo_1.MoveTo(this._entity, x, y, speed));
        return this;
    };
    ActionContext.prototype.moveBy = function (xOffsetOrVector, yOffsetOrSpeed, speedOrUndefined) {
        var xOffset = 0;
        var yOffset = 0;
        var speed = 0;
        if (xOffsetOrVector instanceof vector_1.Vector) {
            xOffset = xOffsetOrVector.x;
            yOffset = xOffsetOrVector.y;
            speed = yOffsetOrSpeed;
        }
        else {
            xOffset = xOffsetOrVector;
            yOffset = yOffsetOrSpeed;
            speed = speedOrUndefined;
        }
        this._queue.add(new MoveBy_1.MoveBy(this._entity, xOffset, yOffset, speed));
        return this;
    };
    /**
     * This method will rotate an actor to the specified angle at the speed
     * specified (in radians per second) and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadians  The angle to rotate to in radians
     * @param speed         The angular velocity of the rotation specified in radians per second
     * @param rotationType  The [[RotationType]] to use for this rotation
     */
    ActionContext.prototype.rotateTo = function (angleRadians, speed, rotationType) {
        this._queue.add(new RotateTo_1.RotateTo(this._entity, angleRadians, speed, rotationType));
        return this;
    };
    /**
     * This method will rotate an actor by the specified angle offset, from it's current rotation given a certain speed
     * in radians/sec and return back the actor. This method is part
     * of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadiansOffset  The angle to rotate to in radians relative to the current rotation
     * @param speed          The speed in radians/sec the actor should rotate at
     * @param rotationType  The [[RotationType]] to use for this rotation, default is shortest path
     */
    ActionContext.prototype.rotateBy = function (angleRadiansOffset, speed, rotationType) {
        this._queue.add(new RotateBy_1.RotateBy(this._entity, angleRadiansOffset, speed, rotationType));
        return this;
    };
    ActionContext.prototype.scaleTo = function (sizeXOrVector, sizeYOrSpeed, speedXOrUndefined, speedYOrUndefined) {
        var sizeX = 1;
        var sizeY = 1;
        var speedX = 0;
        var speedY = 0;
        if (sizeXOrVector instanceof vector_1.Vector && sizeYOrSpeed instanceof vector_1.Vector) {
            sizeX = sizeXOrVector.x;
            sizeY = sizeXOrVector.y;
            speedX = sizeYOrSpeed.x;
            speedY = sizeYOrSpeed.y;
        }
        if (typeof sizeXOrVector === 'number' && typeof sizeYOrSpeed === 'number') {
            sizeX = sizeXOrVector;
            sizeY = sizeYOrSpeed;
            speedX = speedXOrUndefined;
            speedY = speedYOrUndefined;
        }
        this._queue.add(new ScaleTo_1.ScaleTo(this._entity, sizeX, sizeY, speedX, speedY));
        return this;
    };
    ActionContext.prototype.scaleBy = function (sizeOffsetXOrVector, sizeOffsetYOrSpeed, speed) {
        var sizeOffsetX = 1;
        var sizeOffsetY = 1;
        if (sizeOffsetXOrVector instanceof vector_1.Vector) {
            sizeOffsetX = sizeOffsetXOrVector.x;
            sizeOffsetY = sizeOffsetXOrVector.y;
            speed = sizeOffsetYOrSpeed;
        }
        if (typeof sizeOffsetXOrVector === 'number' && typeof sizeOffsetYOrSpeed === 'number') {
            sizeOffsetX = sizeOffsetXOrVector;
            sizeOffsetY = sizeOffsetYOrSpeed;
        }
        this._queue.add(new ScaleBy_1.ScaleBy(this._entity, sizeOffsetX, sizeOffsetY, speed));
        return this;
    };
    /**
     * This method will cause an actor to blink (become visible and not
     * visible). Optionally, you may specify the number of blinks. Specify the amount of time
     * the actor should be visible per blink, and the amount of time not visible.
     * This method is part of the actor 'Action' fluent API allowing action chaining.
     * @param timeVisible     The amount of time to stay visible per blink in milliseconds
     * @param timeNotVisible  The amount of time to stay not visible per blink in milliseconds
     * @param numBlinks       The number of times to blink
     */
    ActionContext.prototype.blink = function (timeVisible, timeNotVisible, numBlinks) {
        if (numBlinks === void 0) { numBlinks = 1; }
        this._queue.add(new Blink_1.Blink(this._entity, timeVisible, timeNotVisible, numBlinks));
        return this;
    };
    /**
     * This method will cause an actor's opacity to change from its current value
     * to the provided value by a specified time (in milliseconds). This method is
     * part of the actor 'Action' fluent API allowing action chaining.
     * @param opacity  The ending opacity
     * @param time     The time it should take to fade the actor (in milliseconds)
     */
    ActionContext.prototype.fade = function (opacity, time) {
        this._queue.add(new Fade_1.Fade(this._entity, opacity, time));
        return this;
    };
    /**
     * This method will delay the next action from executing for a certain
     * amount of time (in milliseconds). This method is part of the actor
     * 'Action' fluent API allowing action chaining.
     * @param time  The amount of time to delay the next action in the queue from executing in milliseconds
     */
    ActionContext.prototype.delay = function (time) {
        this._queue.add(new Delay_1.Delay(time));
        return this;
    };
    /**
     * This method will add an action to the queue that will remove the actor from the
     * scene once it has completed its previous  Any actions on the
     * action queue after this action will not be executed.
     */
    ActionContext.prototype.die = function () {
        this._queue.add(new Die_1.Die(this._entity));
        return this;
    };
    /**
     * This method allows you to call an arbitrary method as the next action in the
     * action queue. This is useful if you want to execute code in after a specific
     * action, i.e An actor arrives at a destination after traversing a path
     */
    ActionContext.prototype.callMethod = function (method) {
        this._queue.add(new CallMethod_1.CallMethod(method));
        return this;
    };
    /**
     * This method will cause the actor to repeat all of the actions built in
     * the `repeatBuilder` callback. If the number of repeats
     * is not specified it will repeat forever. This method is part of
     * the actor 'Action' fluent API allowing action chaining
     *
     * ```typescript
     * // Move up in a zig-zag by repeated moveBy's
     * actor.actions.repeat(repeatCtx => {
     *  repeatCtx.moveBy(10, 0, 10);
     *  repeatCtx.moveBy(0, 10, 10);
     * }, 5);
     * ```
     *
     * @param repeatBuilder The builder to specify the repeatable list of actions
     * @param times  The number of times to repeat all the previous actions in the action queue. If nothing is specified the actions
     * will repeat forever
     */
    ActionContext.prototype.repeat = function (repeatBuilder, times) {
        if (!times) {
            this.repeatForever(repeatBuilder);
            return this;
        }
        this._queue.add(new Repeat_1.Repeat(this._entity, repeatBuilder, times));
        return this;
    };
    /**
     * This method will cause the actor to repeat all of the actions built in
     * the `repeatBuilder` callback. If the number of repeats
     * is not specified it will repeat forever. This method is part of
     * the actor 'Action' fluent API allowing action chaining
     *
     * ```typescript
     * // Move up in a zig-zag by repeated moveBy's
     * actor.actions.repeat(repeatCtx => {
     *  repeatCtx.moveBy(10, 0, 10);
     *  repeatCtx.moveBy(0, 10, 10);
     * }, 5);
     * ```
     *
     * @param repeatBuilder The builder to specify the repeatable list of actions
     */
    ActionContext.prototype.repeatForever = function (repeatBuilder) {
        this._queue.add(new RepeatForever_1.RepeatForever(this._entity, repeatBuilder));
        return this;
    };
    /**
     * This method will cause the entity to follow another at a specified distance
     * @param entity           The entity to follow
     * @param followDistance  The distance to maintain when following, if not specified the actor will follow at the current distance.
     */
    ActionContext.prototype.follow = function (entity, followDistance) {
        if (followDistance === undefined) {
            this._queue.add(new Follow_1.Follow(this._entity, entity));
        }
        else {
            this._queue.add(new Follow_1.Follow(this._entity, entity, followDistance));
        }
        return this;
    };
    /**
     * This method will cause the entity to move towards another until they
     * collide "meet" at a specified speed.
     * @param entity  The entity to meet
     * @param speed  The speed in pixels per second to move, if not specified it will match the speed of the other actor
     */
    ActionContext.prototype.meet = function (entity, speed) {
        if (speed === undefined) {
            this._queue.add(new Meet_1.Meet(this._entity, entity));
        }
        else {
            this._queue.add(new Meet_1.Meet(this._entity, entity, speed));
        }
        return this;
    };
    /**
     * Returns a promise that resolves when the current action queue up to now
     * is finished.
     */
    ActionContext.prototype.toPromise = function () {
        var _this = this;
        var temp = new Promise(function (resolve) {
            _this._queue.add(new CallMethod_1.CallMethod(function () {
                resolve();
            }));
        });
        return temp;
    };
    return ActionContext;
}());
exports.ActionContext = ActionContext;
