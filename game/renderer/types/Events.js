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
exports.ExitTriggerEvent = exports.EnterTriggerEvent = exports.EnterViewPortEvent = exports.ExitViewPortEvent = exports.DeactivateEvent = exports.ActivateEvent = exports.InitializeEvent = exports.CollisionEndEvent = exports.CollisionStartEvent = exports.CollisionPostSolveEvent = exports.CollisionPreSolveEvent = exports.ContactEndEvent = exports.ContactStartEvent = exports.PostCollisionEvent = exports.PreCollisionEvent = exports.HiddenEvent = exports.VisibleEvent = exports.GamepadAxisEvent = exports.GamepadButtonEvent = exports.GamepadDisconnectEvent = exports.GamepadConnectEvent = exports.PostFrameEvent = exports.PreFrameEvent = exports.PostUpdateEvent = exports.PreUpdateEvent = exports.PostDebugDrawEvent = exports.PreDebugDrawEvent = exports.PostDrawEvent = exports.PreDrawEvent = exports.GameStopEvent = exports.GameStartEvent = exports.PostKillEvent = exports.PreKillEvent = exports.KillEvent = exports.GameEvent = exports.EventTypes = void 0;
var EventTypes;
(function (EventTypes) {
    EventTypes["Kill"] = "kill";
    EventTypes["PreKill"] = "prekill";
    EventTypes["PostKill"] = "postkill";
    EventTypes["PreDraw"] = "predraw";
    EventTypes["PostDraw"] = "postdraw";
    EventTypes["PreDebugDraw"] = "predebugdraw";
    EventTypes["PostDebugDraw"] = "postdebugdraw";
    EventTypes["PreUpdate"] = "preupdate";
    EventTypes["PostUpdate"] = "postupdate";
    EventTypes["PreFrame"] = "preframe";
    EventTypes["PostFrame"] = "postframe";
    EventTypes["PreCollision"] = "precollision";
    EventTypes["CollisionStart"] = "collisionstart";
    EventTypes["CollisionEnd"] = "collisionend";
    EventTypes["PostCollision"] = "postcollision";
    EventTypes["Initialize"] = "initialize";
    EventTypes["Activate"] = "activate";
    EventTypes["Deactivate"] = "deactivate";
    EventTypes["ExitViewport"] = "exitviewport";
    EventTypes["EnterViewport"] = "enterviewport";
    EventTypes["ExitTrigger"] = "exit";
    EventTypes["EnterTrigger"] = "enter";
    EventTypes["Connect"] = "connect";
    EventTypes["Disconnect"] = "disconnect";
    EventTypes["Button"] = "button";
    EventTypes["Axis"] = "axis";
    EventTypes["Visible"] = "visible";
    EventTypes["Hidden"] = "hidden";
    EventTypes["Start"] = "start";
    EventTypes["Stop"] = "stop";
    EventTypes["PointerUp"] = "pointerup";
    EventTypes["PointerDown"] = "pointerdown";
    EventTypes["PointerMove"] = "pointermove";
    EventTypes["PointerEnter"] = "pointerenter";
    EventTypes["PointerLeave"] = "pointerleave";
    EventTypes["PointerCancel"] = "pointercancel";
    EventTypes["PointerWheel"] = "pointerwheel";
    EventTypes["Up"] = "up";
    EventTypes["Down"] = "down";
    EventTypes["Move"] = "move";
    EventTypes["Enter"] = "enter";
    EventTypes["Leave"] = "leave";
    EventTypes["Cancel"] = "cancel";
    EventTypes["Wheel"] = "wheel";
    EventTypes["Press"] = "press";
    EventTypes["Release"] = "release";
    EventTypes["Hold"] = "hold";
    EventTypes["PointerDragStart"] = "pointerdragstart";
    EventTypes["PointerDragEnd"] = "pointerdragend";
    EventTypes["PointerDragEnter"] = "pointerdragenter";
    EventTypes["PointerDragLeave"] = "pointerdragleave";
    EventTypes["PointerDragMove"] = "pointerdragmove";
})(EventTypes = exports.EventTypes || (exports.EventTypes = {}));
/**
 * Base event type in Excalibur that all other event types derive from. Not all event types are thrown on all Excalibur game objects,
 * some events are unique to a type, others are not.
 *
 */
var GameEvent = /** @class */ (function () {
    function GameEvent() {
        this._bubbles = true;
    }
    Object.defineProperty(GameEvent.prototype, "bubbles", {
        /**
         * If set to false, prevents event from propagating to other actors. If true it will be propagated
         * to all actors that apply.
         */
        get: function () {
            return this._bubbles;
        },
        set: function (value) {
            this._bubbles = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Prevents event from bubbling
     */
    GameEvent.prototype.stopPropagation = function () {
        this.bubbles = false;
    };
    return GameEvent;
}());
exports.GameEvent = GameEvent;
/**
 * The 'kill' event is emitted on actors when it is killed. The target is the actor that was killed.
 */
var KillEvent = /** @class */ (function (_super) {
    __extends(KillEvent, _super);
    function KillEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return KillEvent;
}(GameEvent));
exports.KillEvent = KillEvent;
/**
 * The 'prekill' event is emitted directly before an actor is killed.
 */
var PreKillEvent = /** @class */ (function (_super) {
    __extends(PreKillEvent, _super);
    function PreKillEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return PreKillEvent;
}(GameEvent));
exports.PreKillEvent = PreKillEvent;
/**
 * The 'postkill' event is emitted directly after the actor is killed.
 */
var PostKillEvent = /** @class */ (function (_super) {
    __extends(PostKillEvent, _super);
    function PostKillEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return PostKillEvent;
}(GameEvent));
exports.PostKillEvent = PostKillEvent;
/**
 * The 'start' event is emitted on engine when has started and is ready for interaction.
 */
var GameStartEvent = /** @class */ (function (_super) {
    __extends(GameStartEvent, _super);
    function GameStartEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return GameStartEvent;
}(GameEvent));
exports.GameStartEvent = GameStartEvent;
/**
 * The 'stop' event is emitted on engine when has been stopped and will no longer take input, update or draw.
 */
var GameStopEvent = /** @class */ (function (_super) {
    __extends(GameStopEvent, _super);
    function GameStopEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return GameStopEvent;
}(GameEvent));
exports.GameStopEvent = GameStopEvent;
/**
 * The 'predraw' event is emitted on actors, scenes, and engine before drawing starts. Actors' predraw happens inside their graphics
 * transform so that all drawing takes place with the actor as the origin.
 *
 */
var PreDrawEvent = /** @class */ (function (_super) {
    __extends(PreDrawEvent, _super);
    function PreDrawEvent(ctx, delta, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PreDrawEvent;
}(GameEvent));
exports.PreDrawEvent = PreDrawEvent;
/**
 * The 'postdraw' event is emitted on actors, scenes, and engine after drawing finishes. Actors' postdraw happens inside their graphics
 * transform so that all drawing takes place with the actor as the origin.
 *
 */
var PostDrawEvent = /** @class */ (function (_super) {
    __extends(PostDrawEvent, _super);
    function PostDrawEvent(ctx, delta, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PostDrawEvent;
}(GameEvent));
exports.PostDrawEvent = PostDrawEvent;
/**
 * The 'predebugdraw' event is emitted on actors, scenes, and engine before debug drawing starts.
 */
var PreDebugDrawEvent = /** @class */ (function (_super) {
    __extends(PreDebugDrawEvent, _super);
    function PreDebugDrawEvent(ctx, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.target = target;
        return _this;
    }
    return PreDebugDrawEvent;
}(GameEvent));
exports.PreDebugDrawEvent = PreDebugDrawEvent;
/**
 * The 'postdebugdraw' event is emitted on actors, scenes, and engine after debug drawing starts.
 */
var PostDebugDrawEvent = /** @class */ (function (_super) {
    __extends(PostDebugDrawEvent, _super);
    function PostDebugDrawEvent(ctx, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.target = target;
        return _this;
    }
    return PostDebugDrawEvent;
}(GameEvent));
exports.PostDebugDrawEvent = PostDebugDrawEvent;
/**
 * The 'preupdate' event is emitted on actors, scenes, camera, and engine before the update starts.
 */
var PreUpdateEvent = /** @class */ (function (_super) {
    __extends(PreUpdateEvent, _super);
    function PreUpdateEvent(engine, delta, target) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PreUpdateEvent;
}(GameEvent));
exports.PreUpdateEvent = PreUpdateEvent;
/**
 * The 'postupdate' event is emitted on actors, scenes, camera, and engine after the update ends.
 */
var PostUpdateEvent = /** @class */ (function (_super) {
    __extends(PostUpdateEvent, _super);
    function PostUpdateEvent(engine, delta, target) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PostUpdateEvent;
}(GameEvent));
exports.PostUpdateEvent = PostUpdateEvent;
/**
 * The 'preframe' event is emitted on the engine, before the frame begins.
 */
var PreFrameEvent = /** @class */ (function (_super) {
    __extends(PreFrameEvent, _super);
    function PreFrameEvent(engine, prevStats) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.prevStats = prevStats;
        _this.target = engine;
        return _this;
    }
    return PreFrameEvent;
}(GameEvent));
exports.PreFrameEvent = PreFrameEvent;
/**
 * The 'postframe' event is emitted on the engine, after a frame ends.
 */
var PostFrameEvent = /** @class */ (function (_super) {
    __extends(PostFrameEvent, _super);
    function PostFrameEvent(engine, stats) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.stats = stats;
        _this.target = engine;
        return _this;
    }
    return PostFrameEvent;
}(GameEvent));
exports.PostFrameEvent = PostFrameEvent;
/**
 * Event received when a gamepad is connected to Excalibur. [[Gamepads]] receives this event.
 */
var GamepadConnectEvent = /** @class */ (function (_super) {
    __extends(GamepadConnectEvent, _super);
    function GamepadConnectEvent(index, gamepad) {
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.gamepad = gamepad;
        _this.target = gamepad;
        return _this;
    }
    return GamepadConnectEvent;
}(GameEvent));
exports.GamepadConnectEvent = GamepadConnectEvent;
/**
 * Event received when a gamepad is disconnected from Excalibur. [[Gamepads]] receives this event.
 */
var GamepadDisconnectEvent = /** @class */ (function (_super) {
    __extends(GamepadDisconnectEvent, _super);
    function GamepadDisconnectEvent(index, gamepad) {
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.gamepad = gamepad;
        _this.target = gamepad;
        return _this;
    }
    return GamepadDisconnectEvent;
}(GameEvent));
exports.GamepadDisconnectEvent = GamepadDisconnectEvent;
/**
 * Gamepad button event. See [[Gamepads]] for information on responding to controller input. [[Gamepad]] instances receive this event;
 */
var GamepadButtonEvent = /** @class */ (function (_super) {
    __extends(GamepadButtonEvent, _super);
    /**
     * @param button  The Gamepad button
     * @param value   A numeric value between 0 and 1
     */
    function GamepadButtonEvent(button, value, target) {
        var _this = _super.call(this) || this;
        _this.button = button;
        _this.value = value;
        _this.target = target;
        return _this;
    }
    return GamepadButtonEvent;
}(GameEvent));
exports.GamepadButtonEvent = GamepadButtonEvent;
/**
 * Gamepad axis event. See [[Gamepads]] for information on responding to controller input. [[Gamepad]] instances receive this event;
 */
var GamepadAxisEvent = /** @class */ (function (_super) {
    __extends(GamepadAxisEvent, _super);
    /**
     * @param axis  The Gamepad axis
     * @param value A numeric value between -1 and 1
     */
    function GamepadAxisEvent(axis, value, target) {
        var _this = _super.call(this) || this;
        _this.axis = axis;
        _this.value = value;
        _this.target = target;
        return _this;
    }
    return GamepadAxisEvent;
}(GameEvent));
exports.GamepadAxisEvent = GamepadAxisEvent;
/**
 * Event received by the [[Engine]] when the browser window is visible on a screen.
 */
var VisibleEvent = /** @class */ (function (_super) {
    __extends(VisibleEvent, _super);
    function VisibleEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return VisibleEvent;
}(GameEvent));
exports.VisibleEvent = VisibleEvent;
/**
 * Event received by the [[Engine]] when the browser window is hidden from all screens.
 */
var HiddenEvent = /** @class */ (function (_super) {
    __extends(HiddenEvent, _super);
    function HiddenEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return HiddenEvent;
}(GameEvent));
exports.HiddenEvent = HiddenEvent;
/**
 * Event thrown on an [[Actor|actor]] when a collision will occur this frame if it resolves
 */
var PreCollisionEvent = /** @class */ (function (_super) {
    __extends(PreCollisionEvent, _super);
    /**
     * @param actor         The actor the event was thrown on
     * @param other         The actor that will collided with the current actor
     * @param side          The side that will be collided with the current actor
     * @param intersection  Intersection vector
     */
    function PreCollisionEvent(actor, other, side, intersection) {
        var _this = _super.call(this) || this;
        _this.other = other;
        _this.side = side;
        _this.intersection = intersection;
        _this.target = actor;
        return _this;
    }
    return PreCollisionEvent;
}(GameEvent));
exports.PreCollisionEvent = PreCollisionEvent;
/**
 * Event thrown on an [[Actor|actor]] when a collision has been resolved (body reacted) this frame
 */
var PostCollisionEvent = /** @class */ (function (_super) {
    __extends(PostCollisionEvent, _super);
    /**
     * @param actor         The actor the event was thrown on
     * @param other         The actor that did collide with the current actor
     * @param side          The side that did collide with the current actor
     * @param intersection  Intersection vector
     */
    function PostCollisionEvent(actor, other, side, intersection) {
        var _this = _super.call(this) || this;
        _this.other = other;
        _this.side = side;
        _this.intersection = intersection;
        _this.target = actor;
        return _this;
    }
    Object.defineProperty(PostCollisionEvent.prototype, "actor", {
        get: function () {
            return this.target;
        },
        set: function (actor) {
            this.target = actor;
        },
        enumerable: false,
        configurable: true
    });
    return PostCollisionEvent;
}(GameEvent));
exports.PostCollisionEvent = PostCollisionEvent;
var ContactStartEvent = /** @class */ (function () {
    function ContactStartEvent(target, other, contact) {
        this.target = target;
        this.other = other;
        this.contact = contact;
    }
    return ContactStartEvent;
}());
exports.ContactStartEvent = ContactStartEvent;
var ContactEndEvent = /** @class */ (function () {
    function ContactEndEvent(target, other) {
        this.target = target;
        this.other = other;
    }
    return ContactEndEvent;
}());
exports.ContactEndEvent = ContactEndEvent;
var CollisionPreSolveEvent = /** @class */ (function () {
    function CollisionPreSolveEvent(target, other, side, intersection, contact) {
        this.target = target;
        this.other = other;
        this.side = side;
        this.intersection = intersection;
        this.contact = contact;
    }
    return CollisionPreSolveEvent;
}());
exports.CollisionPreSolveEvent = CollisionPreSolveEvent;
var CollisionPostSolveEvent = /** @class */ (function () {
    function CollisionPostSolveEvent(target, other, side, intersection, contact) {
        this.target = target;
        this.other = other;
        this.side = side;
        this.intersection = intersection;
        this.contact = contact;
    }
    return CollisionPostSolveEvent;
}());
exports.CollisionPostSolveEvent = CollisionPostSolveEvent;
/**
 * Event thrown the first time an [[Actor|actor]] collides with another, after an actor is in contact normal collision events are fired.
 */
var CollisionStartEvent = /** @class */ (function (_super) {
    __extends(CollisionStartEvent, _super);
    /**
     *
     * @param actor
     * @param other
     * @param contact
     */
    function CollisionStartEvent(actor, other, contact) {
        var _this = _super.call(this) || this;
        _this.other = other;
        _this.contact = contact;
        _this.target = actor;
        return _this;
    }
    Object.defineProperty(CollisionStartEvent.prototype, "actor", {
        get: function () {
            return this.target;
        },
        set: function (actor) {
            this.target = actor;
        },
        enumerable: false,
        configurable: true
    });
    return CollisionStartEvent;
}(GameEvent));
exports.CollisionStartEvent = CollisionStartEvent;
/**
 * Event thrown when the [[Actor|actor]] is no longer colliding with another
 */
var CollisionEndEvent = /** @class */ (function (_super) {
    __extends(CollisionEndEvent, _super);
    /**
     *
     */
    function CollisionEndEvent(actor, other) {
        var _this = _super.call(this) || this;
        _this.other = other;
        _this.target = actor;
        return _this;
    }
    Object.defineProperty(CollisionEndEvent.prototype, "actor", {
        get: function () {
            return this.target;
        },
        set: function (actor) {
            this.target = actor;
        },
        enumerable: false,
        configurable: true
    });
    return CollisionEndEvent;
}(GameEvent));
exports.CollisionEndEvent = CollisionEndEvent;
/**
 * Event thrown on an [[Actor]] and a [[Scene]] only once before the first update call
 */
var InitializeEvent = /** @class */ (function (_super) {
    __extends(InitializeEvent, _super);
    /**
     * @param engine  The reference to the current engine
     */
    function InitializeEvent(engine, target) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.target = target;
        return _this;
    }
    return InitializeEvent;
}(GameEvent));
exports.InitializeEvent = InitializeEvent;
/**
 * Event thrown on a [[Scene]] on activation
 */
var ActivateEvent = /** @class */ (function (_super) {
    __extends(ActivateEvent, _super);
    /**
     * @param context  The context for the scene activation
     */
    function ActivateEvent(context, target) {
        var _this = _super.call(this) || this;
        _this.context = context;
        _this.target = target;
        return _this;
    }
    return ActivateEvent;
}(GameEvent));
exports.ActivateEvent = ActivateEvent;
/**
 * Event thrown on a [[Scene]] on deactivation
 */
var DeactivateEvent = /** @class */ (function (_super) {
    __extends(DeactivateEvent, _super);
    /**
     * @param context  The context for the scene deactivation
     */
    function DeactivateEvent(context, target) {
        var _this = _super.call(this) || this;
        _this.context = context;
        _this.target = target;
        return _this;
    }
    return DeactivateEvent;
}(GameEvent));
exports.DeactivateEvent = DeactivateEvent;
/**
 * Event thrown on an [[Actor]] when it completely leaves the screen.
 */
var ExitViewPortEvent = /** @class */ (function (_super) {
    __extends(ExitViewPortEvent, _super);
    function ExitViewPortEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return ExitViewPortEvent;
}(GameEvent));
exports.ExitViewPortEvent = ExitViewPortEvent;
/**
 * Event thrown on an [[Actor]] when it completely leaves the screen.
 */
var EnterViewPortEvent = /** @class */ (function (_super) {
    __extends(EnterViewPortEvent, _super);
    function EnterViewPortEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return EnterViewPortEvent;
}(GameEvent));
exports.EnterViewPortEvent = EnterViewPortEvent;
var EnterTriggerEvent = /** @class */ (function (_super) {
    __extends(EnterTriggerEvent, _super);
    function EnterTriggerEvent(target, actor) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.actor = actor;
        return _this;
    }
    return EnterTriggerEvent;
}(GameEvent));
exports.EnterTriggerEvent = EnterTriggerEvent;
var ExitTriggerEvent = /** @class */ (function (_super) {
    __extends(ExitTriggerEvent, _super);
    function ExitTriggerEvent(target, actor) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.actor = actor;
        return _this;
    }
    return ExitTriggerEvent;
}(GameEvent));
exports.ExitTriggerEvent = ExitTriggerEvent;
