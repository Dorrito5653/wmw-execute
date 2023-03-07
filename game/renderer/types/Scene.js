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
exports.Scene = void 0;
var ScreenElement_1 = require("./ScreenElement");
var Events_1 = require("./Events");
var Log_1 = require("./Util/Log");
var Timer_1 = require("./Timer");
var TileMap_1 = require("./TileMap");
var Camera_1 = require("./Camera");
var Actor_1 = require("./Actor");
var Class_1 = require("./Class");
var Util = require("./Util/Util");
var Trigger_1 = require("./Trigger");
var System_1 = require("./EntityComponentSystem/System");
var World_1 = require("./EntityComponentSystem/World");
var MotionSystem_1 = require("./Collision/MotionSystem");
var CollisionSystem_1 = require("./Collision/CollisionSystem");
var Entity_1 = require("./EntityComponentSystem/Entity");
var GraphicsSystem_1 = require("./Graphics/GraphicsSystem");
var DebugSystem_1 = require("./Debug/DebugSystem");
var PointerSystem_1 = require("./Input/PointerSystem");
var ActionsSystem_1 = require("./Actions/ActionsSystem");
var IsometricEntitySystem_1 = require("./TileMap/IsometricEntitySystem");
var OffscreenSystem_1 = require("./Graphics/OffscreenSystem");
/**
 * [[Actor|Actors]] are composed together into groupings called Scenes in
 * Excalibur. The metaphor models the same idea behind real world
 * actors in a scene. Only actors in scenes will be updated and drawn.
 *
 * Typical usages of a scene include: levels, menus, loading screens, etc.
 */
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        _this._logger = Log_1.Logger.getInstance();
        /**
         * Gets or sets the current camera for the scene
         */
        _this.camera = new Camera_1.Camera();
        /**
         * The ECS world for the scene
         */
        _this.world = new World_1.World(_this);
        _this._isInitialized = false;
        _this._timers = [];
        _this._cancelQueue = [];
        // Initialize systems
        // Update
        _this.world.add(new ActionsSystem_1.ActionsSystem());
        _this.world.add(new MotionSystem_1.MotionSystem());
        _this.world.add(new CollisionSystem_1.CollisionSystem());
        _this.world.add(new PointerSystem_1.PointerSystem());
        _this.world.add(new IsometricEntitySystem_1.IsometricEntitySystem());
        // Draw
        _this.world.add(new OffscreenSystem_1.OffscreenSystem());
        _this.world.add(new GraphicsSystem_1.GraphicsSystem());
        _this.world.add(new DebugSystem_1.DebugSystem());
        return _this;
    }
    Object.defineProperty(Scene.prototype, "actors", {
        /**
         * The actors in the current scene
         */
        get: function () {
            return this.world.entityManager.entities.filter(function (e) {
                return e instanceof Actor_1.Actor;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "entities", {
        /**
         * The entities in the current scene
         */
        get: function () {
            return this.world.entityManager.entities;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "triggers", {
        /**
         * The triggers in the current scene
         */
        get: function () {
            return this.world.entityManager.entities.filter(function (e) {
                return e instanceof Trigger_1.Trigger;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "tileMaps", {
        /**
         * The [[TileMap]]s in the scene, if any
         */
        get: function () {
            return this.world.entityManager.entities.filter(function (e) {
                return e instanceof TileMap_1.TileMap;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "timers", {
        get: function () {
            return this._timers;
        },
        enumerable: false,
        configurable: true
    });
    Scene.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    Scene.prototype.once = function (eventName, handler) {
        _super.prototype.once.call(this, eventName, handler);
    };
    Scene.prototype.off = function (eventName, handler) {
        _super.prototype.off.call(this, eventName, handler);
    };
    /**
     * This is called before the first update of the [[Scene]]. Initializes scene members like the camera. This method is meant to be
     * overridden. This is where initialization of child actors should take place.
     */
    Scene.prototype.onInitialize = function (_engine) {
        // will be overridden
    };
    /**
     * This is called when the scene is made active and started. It is meant to be overridden,
     * this is where you should setup any DOM UI or event handlers needed for the scene.
     */
    Scene.prototype.onActivate = function (_context) {
        // will be overridden
    };
    /**
     * This is called when the scene is made transitioned away from and stopped. It is meant to be overridden,
     * this is where you should cleanup any DOM UI or event handlers needed for the scene.
     */
    Scene.prototype.onDeactivate = function (_context) {
        // will be overridden
    };
    /**
     * Safe to override onPreUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreUpdate` is called directly before a scene is updated.
     */
    Scene.prototype.onPreUpdate = function (_engine, _delta) {
        // will be overridden
    };
    /**
     * Safe to override onPostUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPostUpdate` is called directly after a scene is updated.
     */
    Scene.prototype.onPostUpdate = function (_engine, _delta) {
        // will be overridden
    };
    /**
     * Safe to override onPreDraw lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreDraw` is called directly before a scene is drawn.
     *
     */
    Scene.prototype.onPreDraw = function (_ctx, _delta) {
        // will be overridden
    };
    /**
     * Safe to override onPostDraw lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPostDraw` is called directly after a scene is drawn.
     *
     */
    Scene.prototype.onPostDraw = function (_ctx, _delta) {
        // will be overridden
    };
    /**
     * Initializes actors in the scene
     */
    Scene.prototype._initializeChildren = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var child = _a[_i];
            child._initialize(this.engine);
        }
    };
    Object.defineProperty(Scene.prototype, "isInitialized", {
        /**
         * Gets whether or not the [[Scene]] has been initialized
         */
        get: function () {
            return this._isInitialized;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Initializes the scene before the first update, meant to be called by engine not by users of
     * Excalibur
     * @internal
     */
    Scene.prototype._initialize = function (engine) {
        if (!this.isInitialized) {
            this.engine = engine;
            // Initialize camera first
            this.camera._initialize(engine);
            this.world.systemManager.initialize();
            // This order is important! we want to be sure any custom init that add actors
            // fire before the actor init
            this.onInitialize.call(this, engine);
            this._initializeChildren();
            this._logger.debug('Scene.onInitialize', this, engine);
            this.eventDispatcher.emit('initialize', new Events_1.InitializeEvent(engine, this));
            this._isInitialized = true;
        }
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Activates the scene with the base behavior, then calls the overridable `onActivate` implementation.
     * @internal
     */
    Scene.prototype._activate = function (context) {
        this._logger.debug('Scene.onActivate', this);
        this.onActivate(context);
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Deactivates the scene with the base behavior, then calls the overridable `onDeactivate` implementation.
     * @internal
     */
    Scene.prototype._deactivate = function (context) {
        this._logger.debug('Scene.onDeactivate', this);
        this.onDeactivate(context);
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPreUpdate]] lifecycle event
     * @internal
     */
    Scene.prototype._preupdate = function (_engine, delta) {
        this.emit('preupdate', new Events_1.PreUpdateEvent(_engine, delta, this));
        this.onPreUpdate(_engine, delta);
    };
    /**
     *  It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPostUpdate]] lifecycle event
     * @internal
     */
    Scene.prototype._postupdate = function (_engine, delta) {
        this.emit('postupdate', new Events_1.PostUpdateEvent(_engine, delta, this));
        this.onPostUpdate(_engine, delta);
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _predraw handler for [[onPreDraw]] lifecycle event
     *
     * @internal
     */
    Scene.prototype._predraw = function (_ctx, _delta) {
        this.emit('predraw', new Events_1.PreDrawEvent(_ctx, _delta, this));
        this.onPreDraw(_ctx, _delta);
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _postdraw handler for [[onPostDraw]] lifecycle event
     *
     * @internal
     */
    Scene.prototype._postdraw = function (_ctx, _delta) {
        this.emit('postdraw', new Events_1.PostDrawEvent(_ctx, _delta, this));
        this.onPostDraw(_ctx, _delta);
    };
    /**
     * Updates all the actors and timers in the scene. Called by the [[Engine]].
     * @param engine  Reference to the current Engine
     * @param delta   The number of milliseconds since the last update
     */
    Scene.prototype.update = function (engine, delta) {
        this._preupdate(engine, delta);
        // TODO differed entity removal for timers
        var i, len;
        // Remove timers in the cancel queue before updating them
        for (i = 0, len = this._cancelQueue.length; i < len; i++) {
            this.removeTimer(this._cancelQueue[i]);
        }
        this._cancelQueue.length = 0;
        // Cycle through timers updating timers
        for (var _i = 0, _a = this._timers; _i < _a.length; _i++) {
            var timer = _a[_i];
            timer.update(delta);
        }
        this.world.update(System_1.SystemType.Update, delta);
        // Camera last keeps renders smooth that are based on entity/actor
        if (this.camera) {
            this.camera.update(engine, delta);
        }
        this._collectActorStats(engine);
        this._postupdate(engine, delta);
    };
    /**
     * Draws all the actors in the Scene. Called by the [[Engine]].
     *
     * @param ctx    The current rendering context
     * @param delta  The number of milliseconds since the last draw
     */
    Scene.prototype.draw = function (ctx, delta) {
        var _a;
        this._predraw(ctx, delta);
        this.world.update(System_1.SystemType.Draw, delta);
        if ((_a = this.engine) === null || _a === void 0 ? void 0 : _a.isDebug) {
            this.debugDraw(ctx);
        }
        this._postdraw(ctx, delta);
    };
    /**
     * Draws all the actors' debug information in the Scene. Called by the [[Engine]].
     * @param ctx  The current rendering context
     */
    /* istanbul ignore next */
    Scene.prototype.debugDraw = function (ctx) {
        this.emit('predebugdraw', new Events_1.PreDebugDrawEvent(ctx, this));
        // pass
        this.emit('postdebugdraw', new Events_1.PostDebugDrawEvent(ctx, this));
    };
    /**
     * Checks whether an actor is contained in this scene or not
     */
    Scene.prototype.contains = function (actor) {
        return this.actors.indexOf(actor) > -1;
    };
    Scene.prototype.add = function (entity) {
        this.emit('entityadded', { target: entity });
        this.world.add(entity);
        entity.scene = this;
        if (entity instanceof Timer_1.Timer) {
            if (!Util.contains(this._timers, entity)) {
                this.addTimer(entity);
            }
            return;
        }
    };
    Scene.prototype.remove = function (entity) {
        if (entity instanceof Entity_1.Entity) {
            this.emit('entityremoved', { target: entity });
            this.world.remove(entity);
        }
        if (entity instanceof Timer_1.Timer) {
            this.removeTimer(entity);
        }
    };
    /**
     * Removes all entities and timers from the scene, optionally indicate whether deferred should or shouldn't be used.
     *
     * By default entities use deferred removal
     * @param deferred
     */
    Scene.prototype.clear = function (deferred) {
        if (deferred === void 0) { deferred = true; }
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            this.world.remove(entity, deferred);
        }
        for (var _b = 0, _c = this.timers; _b < _c.length; _b++) {
            var timer = _c[_b];
            this.removeTimer(timer);
        }
    };
    /**
     * Adds a [[Timer]] to the scene
     * @param timer  The timer to add
     */
    Scene.prototype.addTimer = function (timer) {
        this._timers.push(timer);
        timer.scene = this;
        return timer;
    };
    /**
     * Removes a [[Timer]] from the scene.
     * @warning Can be dangerous, use [[cancelTimer]] instead
     * @param timer  The timer to remove
     */
    Scene.prototype.removeTimer = function (timer) {
        var i = this._timers.indexOf(timer);
        if (i !== -1) {
            this._timers.splice(i, 1);
        }
        return timer;
    };
    /**
     * Cancels a [[Timer]], removing it from the scene nicely
     * @param timer  The timer to cancel
     */
    Scene.prototype.cancelTimer = function (timer) {
        this._cancelQueue.push(timer);
        return timer;
    };
    /**
     * Tests whether a [[Timer]] is active in the scene
     */
    Scene.prototype.isTimerActive = function (timer) {
        return this._timers.indexOf(timer) > -1 && !timer.complete;
    };
    Scene.prototype.isCurrentScene = function () {
        if (this.engine) {
            return this.engine.currentScene === this;
        }
        return false;
    };
    Scene.prototype._collectActorStats = function (engine) {
        var screenElements = this.actors.filter(function (a) { return a instanceof ScreenElement_1.ScreenElement; });
        for (var _i = 0, screenElements_1 = screenElements; _i < screenElements_1.length; _i++) {
            var _ui = screenElements_1[_i];
            engine.stats.currFrame.actors.ui++;
        }
        for (var _a = 0, _b = this.actors; _a < _b.length; _a++) {
            var actor = _b[_a];
            engine.stats.currFrame.actors.alive++;
            for (var _c = 0, _d = actor.children; _c < _d.length; _c++) {
                var child = _d[_c];
                if ((0, ScreenElement_1.isScreenElement)(child)) {
                    // TODO not true
                    engine.stats.currFrame.actors.ui++;
                }
                else {
                    engine.stats.currFrame.actors.alive++;
                }
            }
        }
    };
    return Scene;
}(Class_1.Class));
exports.Scene = Scene;
