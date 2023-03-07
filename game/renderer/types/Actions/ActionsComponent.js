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
exports.__esModule = true;
exports.ActionsComponent = void 0;
var ActionContext_1 = require("./ActionContext");
var Component_1 = require("../EntityComponentSystem/Component");
var MotionComponent_1 = require("../EntityComponentSystem/Components/MotionComponent");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
;
var ActionsComponent = /** @class */ (function (_super) {
    __extends(ActionsComponent, _super);
    function ActionsComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ex.actions';
        _this.dependencies = [TransformComponent_1.TransformComponent, MotionComponent_1.MotionComponent];
        return _this;
    }
    ActionsComponent.prototype.onAdd = function (entity) {
        this._ctx = new ActionContext_1.ActionContext(entity);
    };
    ActionsComponent.prototype.onRemove = function () {
        this._ctx = null;
    };
    /**
     * Returns the internal action queue
     * @returns action queue
     */
    ActionsComponent.prototype.getQueue = function () {
        var _a;
        return (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.getQueue();
    };
    ActionsComponent.prototype.runAction = function (action) {
        var _a;
        return (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.runAction(action);
    };
    /**
     * Updates the internal action context, performing action and moving through the internal queue
     * @param elapsedMs
     */
    ActionsComponent.prototype.update = function (elapsedMs) {
        var _a;
        return (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.update(elapsedMs);
    };
    /**
     * Clears all queued actions from the Actor
     */
    ActionsComponent.prototype.clearActions = function () {
        var _a;
        (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.clearActions();
    };
    ActionsComponent.prototype.easeTo = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._ctx.easeTo.apply(this._ctx, args);
    };
    ActionsComponent.prototype.easeBy = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._ctx.easeBy.apply(this._ctx, args);
    };
    ActionsComponent.prototype.moveTo = function (xOrPos, yOrSpeed, speedOrUndefined) {
        return this._ctx.moveTo.apply(this._ctx, [xOrPos, yOrSpeed, speedOrUndefined]);
    };
    ActionsComponent.prototype.moveBy = function (xOffsetOrVector, yOffsetOrSpeed, speedOrUndefined) {
        return this._ctx.moveBy.apply(this._ctx, [xOffsetOrVector, yOffsetOrSpeed, speedOrUndefined]);
    };
    /**
     * This method will rotate an actor to the specified angle at the speed
     * specified (in radians per second) and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadians  The angle to rotate to in radians
     * @param speed         The angular velocity of the rotation specified in radians per second
     * @param rotationType  The [[RotationType]] to use for this rotation
     */
    ActionsComponent.prototype.rotateTo = function (angleRadians, speed, rotationType) {
        return this._ctx.rotateTo(angleRadians, speed, rotationType);
    };
    /**
     * This method will rotate an actor by the specified angle offset, from it's current rotation given a certain speed
     * in radians/sec and return back the actor. This method is part
     * of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadiansOffset  The angle to rotate to in radians relative to the current rotation
     * @param speed          The speed in radians/sec the actor should rotate at
     * @param rotationType  The [[RotationType]] to use for this rotation, default is shortest path
     */
    ActionsComponent.prototype.rotateBy = function (angleRadiansOffset, speed, rotationType) {
        return this._ctx.rotateBy(angleRadiansOffset, speed, rotationType);
    };
    ActionsComponent.prototype.scaleTo = function (sizeXOrVector, sizeYOrSpeed, speedXOrUndefined, speedYOrUndefined) {
        return this._ctx.scaleTo.apply(this._ctx, [sizeXOrVector, sizeYOrSpeed, speedXOrUndefined, speedYOrUndefined]);
    };
    ActionsComponent.prototype.scaleBy = function (sizeOffsetXOrVector, sizeOffsetYOrSpeed, speed) {
        return this._ctx.scaleBy.apply(this._ctx, [sizeOffsetXOrVector, sizeOffsetYOrSpeed, speed]);
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
    ActionsComponent.prototype.blink = function (timeVisible, timeNotVisible, numBlinks) {
        return this._ctx.blink(timeVisible, timeNotVisible, numBlinks);
    };
    /**
     * This method will cause an actor's opacity to change from its current value
     * to the provided value by a specified time (in milliseconds). This method is
     * part of the actor 'Action' fluent API allowing action chaining.
     * @param opacity  The ending opacity
     * @param time     The time it should take to fade the actor (in milliseconds)
     */
    ActionsComponent.prototype.fade = function (opacity, time) {
        return this._ctx.fade(opacity, time);
    };
    /**
     * This method will delay the next action from executing for a certain
     * amount of time (in milliseconds). This method is part of the actor
     * 'Action' fluent API allowing action chaining.
     * @param time  The amount of time to delay the next action in the queue from executing in milliseconds
     */
    ActionsComponent.prototype.delay = function (time) {
        return this._ctx.delay(time);
    };
    /**
     * This method will add an action to the queue that will remove the actor from the
     * scene once it has completed its previous  Any actions on the
     * action queue after this action will not be executed.
     */
    ActionsComponent.prototype.die = function () {
        return this._ctx.die();
    };
    /**
     * This method allows you to call an arbitrary method as the next action in the
     * action queue. This is useful if you want to execute code in after a specific
     * action, i.e An actor arrives at a destination after traversing a path
     */
    ActionsComponent.prototype.callMethod = function (method) {
        return this._ctx.callMethod(method);
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
    ActionsComponent.prototype.repeat = function (repeatBuilder, times) {
        return this._ctx.repeat(repeatBuilder, times);
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
    ActionsComponent.prototype.repeatForever = function (repeatBuilder) {
        return this._ctx.repeatForever(repeatBuilder);
    };
    /**
     * This method will cause the entity to follow another at a specified distance
     * @param entity           The entity to follow
     * @param followDistance  The distance to maintain when following, if not specified the actor will follow at the current distance.
     */
    ActionsComponent.prototype.follow = function (entity, followDistance) {
        return this._ctx.follow(entity, followDistance);
    };
    /**
     * This method will cause the entity to move towards another until they
     * collide "meet" at a specified speed.
     * @param entity  The entity to meet
     * @param speed  The speed in pixels per second to move, if not specified it will match the speed of the other actor
     */
    ActionsComponent.prototype.meet = function (entity, speed) {
        return this._ctx.meet(entity, speed);
    };
    /**
     * Returns a promise that resolves when the current action queue up to now
     * is finished.
     */
    ActionsComponent.prototype.toPromise = function () {
        return this._ctx.toPromise();
    };
    return ActionsComponent;
}(Component_1.Component));
exports.ActionsComponent = ActionsComponent;
