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
exports.Actor = exports.isActor = void 0;
var Events_1 = require("./Events");
var Log_1 = require("./Util/Log");
var vector_1 = require("./Math/vector");
var BodyComponent_1 = require("./Collision/BodyComponent");
var CollisionType_1 = require("./Collision/CollisionType");
var Entity_1 = require("./EntityComponentSystem/Entity");
var TransformComponent_1 = require("./EntityComponentSystem/Components/TransformComponent");
var MotionComponent_1 = require("./EntityComponentSystem/Components/MotionComponent");
var GraphicsComponent_1 = require("./Graphics/GraphicsComponent");
var Rectangle_1 = require("./Graphics/Rectangle");
var ColliderComponent_1 = require("./Collision/ColliderComponent");
var Shape_1 = require("./Collision/Colliders/Shape");
var Watch_1 = require("./Util/Watch");
var Circle_1 = require("./Graphics/Circle");
var PointerComponent_1 = require("./Input/PointerComponent");
var ActionsComponent_1 = require("./Actions/ActionsComponent");
var Raster_1 = require("./Graphics/Raster");
var Text_1 = require("./Graphics/Text");
var coord_plane_1 = require("./Math/coord-plane");
/**
 * Type guard for checking if something is an Actor
 * @param x
 */
function isActor(x) {
    return x instanceof Actor;
}
exports.isActor = isActor;
/**
 * The most important primitive in Excalibur is an `Actor`. Anything that
 * can move on the screen, collide with another `Actor`, respond to events,
 * or interact with the current scene, must be an actor. An `Actor` **must**
 * be part of a [[Scene]] for it to be drawn to the screen.
 */
var Actor = /** @class */ (function (_super) {
    __extends(Actor, _super);
    // #endregion
    /**
     *
     * @param config
     */
    function Actor(config) {
        var _this = _super.call(this) || this;
        /**
         * The anchor to apply all actor related transformations like rotation,
         * translation, and scaling. By default the anchor is in the center of
         * the actor. By default it is set to the center of the actor (.5, .5)
         *
         * An anchor of (.5, .5) will ensure that drawings are centered.
         *
         * Use `anchor.setTo` to set the anchor to a different point using
         * values between 0 and 1. For example, anchoring to the top-left would be
         * `Actor.anchor.setTo(0, 0)` and top-right would be `Actor.anchor.setTo(0, 1)`.
         */
        _this._anchor = (0, Watch_1.watch)(vector_1.Vector.Half, function (v) { return _this._handleAnchorChange(v); });
        /**
         * Convenience reference to the global logger
         */
        _this.logger = Log_1.Logger.getInstance();
        /**
         * The scene that the actor is in
         */
        _this.scene = null;
        /**
         * Draggable helper
         */
        _this._draggable = false;
        _this._dragging = false;
        _this._pointerDragStartHandler = function () {
            _this._dragging = true;
        };
        _this._pointerDragEndHandler = function () {
            _this._dragging = false;
        };
        _this._pointerDragMoveHandler = function (pe) {
            if (_this._dragging) {
                _this.pos = pe.worldPos;
            }
        };
        _this._pointerDragLeaveHandler = function (pe) {
            if (_this._dragging) {
                _this.pos = pe.worldPos;
            }
        };
        var _a = __assign({}, config), name = _a.name, x = _a.x, y = _a.y, pos = _a.pos, coordPlane = _a.coordPlane, scale = _a.scale, width = _a.width, height = _a.height, radius = _a.radius, collider = _a.collider, vel = _a.vel, acc = _a.acc, rotation = _a.rotation, angularVelocity = _a.angularVelocity, z = _a.z, color = _a.color, visible = _a.visible, anchor = _a.anchor, collisionType = _a.collisionType, collisionGroup = _a.collisionGroup;
        _this._setName(name);
        _this.anchor = anchor !== null && anchor !== void 0 ? anchor : Actor.defaults.anchor.clone();
        var tx = new TransformComponent_1.TransformComponent();
        _this.addComponent(tx);
        _this.pos = pos !== null && pos !== void 0 ? pos : (0, vector_1.vec)(x !== null && x !== void 0 ? x : 0, y !== null && y !== void 0 ? y : 0);
        _this.rotation = rotation !== null && rotation !== void 0 ? rotation : 0;
        _this.scale = scale !== null && scale !== void 0 ? scale : (0, vector_1.vec)(1, 1);
        _this.z = z !== null && z !== void 0 ? z : 0;
        tx.coordPlane = coordPlane !== null && coordPlane !== void 0 ? coordPlane : coord_plane_1.CoordPlane.World;
        _this.addComponent(new PointerComponent_1.PointerComponent);
        _this.addComponent(new GraphicsComponent_1.GraphicsComponent({
            anchor: _this.anchor
        }));
        _this.addComponent(new MotionComponent_1.MotionComponent());
        _this.vel = vel !== null && vel !== void 0 ? vel : vector_1.Vector.Zero;
        _this.acc = acc !== null && acc !== void 0 ? acc : vector_1.Vector.Zero;
        _this.angularVelocity = angularVelocity !== null && angularVelocity !== void 0 ? angularVelocity : 0;
        _this.addComponent(new ActionsComponent_1.ActionsComponent());
        _this.addComponent(new BodyComponent_1.BodyComponent());
        _this.body.collisionType = collisionType !== null && collisionType !== void 0 ? collisionType : CollisionType_1.CollisionType.Passive;
        if (collisionGroup) {
            _this.body.group = collisionGroup;
        }
        if (collider) {
            _this.addComponent(new ColliderComponent_1.ColliderComponent(collider));
        }
        else if (radius) {
            _this.addComponent(new ColliderComponent_1.ColliderComponent(Shape_1.Shape.Circle(radius)));
        }
        else {
            if (width > 0 && height > 0) {
                _this.addComponent(new ColliderComponent_1.ColliderComponent(Shape_1.Shape.Box(width, height, _this.anchor)));
            }
            else {
                _this.addComponent(new ColliderComponent_1.ColliderComponent()); // no collider
            }
        }
        _this.graphics.visible = visible !== null && visible !== void 0 ? visible : true;
        if (color) {
            _this.color = color;
            if (width && height) {
                _this.graphics.add(new Rectangle_1.Rectangle({
                    color: color,
                    width: width,
                    height: height
                }));
            }
            else if (radius) {
                _this.graphics.add(new Circle_1.Circle({
                    color: color,
                    radius: radius
                }));
            }
        }
        return _this;
    }
    Object.defineProperty(Actor.prototype, "body", {
        /**
         * The physics body the is associated with this actor. The body is the container for all physical properties, like position, velocity,
         * acceleration, mass, inertia, etc.
         */
        get: function () {
            return this.get(BodyComponent_1.BodyComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "transform", {
        /**
         * Access the Actor's built in [[TransformComponent]]
         */
        get: function () {
            return this.get(TransformComponent_1.TransformComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "motion", {
        /**
         * Access the Actor's built in [[MotionComponent]]
         */
        get: function () {
            return this.get(MotionComponent_1.MotionComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "graphics", {
        /**
         * Access to the Actor's built in [[GraphicsComponent]]
         */
        get: function () {
            return this.get(GraphicsComponent_1.GraphicsComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "collider", {
        /**
         * Access to the Actor's built in [[ColliderComponent]]
         */
        get: function () {
            return this.get(ColliderComponent_1.ColliderComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "pointer", {
        /**
         * Access to the Actor's built in [[PointerComponent]] config
         */
        get: function () {
            return this.get(PointerComponent_1.PointerComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "actions", {
        /**
         * Useful for quickly scripting actor behavior, like moving to a place, patrolling back and forth, blinking, etc.
         *
         *  Access to the Actor's built in [[ActionsComponent]] which forwards to the
         * [[ActionContext|Action context]] of the actor.
         */
        get: function () {
            return this.get(ActionsComponent_1.ActionsComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "pos", {
        /**
         * Gets the position vector of the actor in pixels
         */
        get: function () {
            return this.transform.pos;
        },
        /**
         * Sets the position vector of the actor in pixels
         */
        set: function (thePos) {
            this.transform.pos = thePos.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "oldPos", {
        /**
         * Gets the position vector of the actor from the last frame
         */
        get: function () {
            return this.body.oldPos;
        },
        /**
         * Sets the position vector of the actor in the last frame
         */
        set: function (thePos) {
            this.body.oldPos.setTo(thePos.x, thePos.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "vel", {
        /**
         * Gets the velocity vector of the actor in pixels/sec
         */
        get: function () {
            return this.motion.vel;
        },
        /**
         * Sets the velocity vector of the actor in pixels/sec
         */
        set: function (theVel) {
            this.motion.vel = theVel.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "oldVel", {
        /**
         * Gets the velocity vector of the actor from the last frame
         */
        get: function () {
            return this.body.oldVel;
        },
        /**
         * Sets the velocity vector of the actor from the last frame
         */
        set: function (theVel) {
            this.body.oldVel.setTo(theVel.x, theVel.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "acc", {
        /**
         * Gets the acceleration vector of the actor in pixels/second/second. An acceleration pointing down such as (0, 100) may be
         * useful to simulate a gravitational effect.
         */
        get: function () {
            return this.motion.acc;
        },
        /**
         * Sets the acceleration vector of teh actor in pixels/second/second
         */
        set: function (theAcc) {
            this.motion.acc = theAcc.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "oldAcc", {
        /**
         * Gets the acceleration of the actor from the last frame. This does not include the global acc [[Physics.acc]].
         */
        get: function () {
            return this.body.oldAcc;
        },
        /**
         * Sets the acceleration of the actor from the last frame. This does not include the global acc [[Physics.acc]].
         */
        set: function (theAcc) {
            this.body.oldAcc.setTo(theAcc.x, theAcc.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "rotation", {
        /**
         * Gets the rotation of the actor in radians. 1 radian = 180/PI Degrees.
         */
        get: function () {
            return this.transform.rotation;
        },
        /**
         * Sets the rotation of the actor in radians. 1 radian = 180/PI Degrees.
         */
        set: function (theAngle) {
            this.transform.rotation = theAngle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "angularVelocity", {
        /**
         * Gets the rotational velocity of the actor in radians/second
         */
        get: function () {
            return this.motion.angularVelocity;
        },
        /**
         * Sets the rotational velocity of the actor in radians/sec
         */
        set: function (angularVelocity) {
            this.motion.angularVelocity = angularVelocity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "scale", {
        get: function () {
            return this.get(TransformComponent_1.TransformComponent).scale;
        },
        set: function (scale) {
            this.get(TransformComponent_1.TransformComponent).scale = scale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "anchor", {
        get: function () {
            return this._anchor;
        },
        set: function (vec) {
            var _this = this;
            this._anchor = (0, Watch_1.watch)(vec, function (v) { return _this._handleAnchorChange(v); });
            this._handleAnchorChange(vec);
        },
        enumerable: false,
        configurable: true
    });
    Actor.prototype._handleAnchorChange = function (v) {
        if (this.graphics) {
            this.graphics.anchor = v;
        }
    };
    Object.defineProperty(Actor.prototype, "isOffScreen", {
        /**
         * Indicates whether the actor is physically in the viewport
         */
        get: function () {
            return this.hasTag('ex.offscreen');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "draggable", {
        get: function () {
            return this._draggable;
        },
        set: function (isDraggable) {
            if (isDraggable) {
                if (isDraggable && !this._draggable) {
                    this.on('pointerdragstart', this._pointerDragStartHandler);
                    this.on('pointerdragend', this._pointerDragEndHandler);
                    this.on('pointerdragmove', this._pointerDragMoveHandler);
                    this.on('pointerdragleave', this._pointerDragLeaveHandler);
                }
                else if (!isDraggable && this._draggable) {
                    this.off('pointerdragstart', this._pointerDragStartHandler);
                    this.off('pointerdragend', this._pointerDragEndHandler);
                    this.off('pointerdragmove', this._pointerDragMoveHandler);
                    this.off('pointerdragleave', this._pointerDragLeaveHandler);
                }
                this._draggable = isDraggable;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "color", {
        /**
         * Sets the color of the actor's current graphic
         */
        get: function () {
            return this._color;
        },
        set: function (v) {
            var _a;
            this._color = v.clone();
            var defaultLayer = this.graphics.layers["default"];
            var currentGraphic = (_a = defaultLayer.graphics[0]) === null || _a === void 0 ? void 0 : _a.graphic;
            if (currentGraphic instanceof Raster_1.Raster || currentGraphic instanceof Text_1.Text) {
                currentGraphic.color = this._color;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * `onInitialize` is called before the first update of the actor. This method is meant to be
     * overridden. This is where initialization of child actors should take place.
     *
     * Synonymous with the event handler `.on('initialize', (evt) => {...})`
     */
    Actor.prototype.onInitialize = function (_engine) {
        // Override me
    };
    /**
     * Initializes this actor and all it's child actors, meant to be called by the Scene before first update not by users of Excalibur.
     *
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * @internal
     */
    Actor.prototype._initialize = function (engine) {
        _super.prototype._initialize.call(this, engine);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child._initialize(engine);
        }
    };
    Actor.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    Actor.prototype.once = function (eventName, handler) {
        _super.prototype.once.call(this, eventName, handler);
    };
    Actor.prototype.off = function (eventName, handler) {
        _super.prototype.off.call(this, eventName, handler);
    };
    // #endregion
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _prekill handler for [[onPreKill]] lifecycle event
     * @internal
     */
    Actor.prototype._prekill = function (_scene) {
        _super.prototype.emit.call(this, 'prekill', new Events_1.PreKillEvent(this));
        this.onPreKill(_scene);
    };
    /**
     * Safe to override onPreKill lifecycle event handler. Synonymous with `.on('prekill', (evt) =>{...})`
     *
     * `onPreKill` is called directly before an actor is killed and removed from its current [[Scene]].
     */
    Actor.prototype.onPreKill = function (_scene) {
        // Override me
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _prekill handler for [[onPostKill]] lifecycle event
     * @internal
     */
    Actor.prototype._postkill = function (_scene) {
        _super.prototype.emit.call(this, 'postkill', new Events_1.PostKillEvent(this));
        this.onPostKill(_scene);
    };
    /**
     * Safe to override onPostKill lifecycle event handler. Synonymous with `.on('postkill', (evt) => {...})`
     *
     * `onPostKill` is called directly after an actor is killed and remove from its current [[Scene]].
     */
    Actor.prototype.onPostKill = function (_scene) {
        // Override me
    };
    /**
     * If the current actor is a member of the scene, this will remove
     * it from the scene graph. It will no longer be drawn or updated.
     */
    Actor.prototype.kill = function () {
        if (this.scene) {
            this._prekill(this.scene);
            this.emit('kill', new Events_1.KillEvent(this));
            _super.prototype.kill.call(this);
            this._postkill(this.scene);
        }
        else {
            this.logger.warn('Cannot kill actor, it was never added to the Scene');
        }
    };
    /**
     * If the current actor is killed, it will now not be killed.
     */
    Actor.prototype.unkill = function () {
        this.active = true;
    };
    /**
     * Indicates wether the actor has been killed.
     */
    Actor.prototype.isKilled = function () {
        return !this.active;
    };
    Object.defineProperty(Actor.prototype, "z", {
        /**
         * Gets the z-index of an actor. The z-index determines the relative order an actor is drawn in.
         * Actors with a higher z-index are drawn on top of actors with a lower z-index
         */
        get: function () {
            return this.get(TransformComponent_1.TransformComponent).z;
        },
        /**
         * Sets the z-index of an actor and updates it in the drawing list for the scene.
         * The z-index determines the relative order an actor is drawn in.
         * Actors with a higher z-index are drawn on top of actors with a lower z-index
         * @param newZ new z-index to assign
         */
        set: function (newZ) {
            this.get(TransformComponent_1.TransformComponent).z = newZ;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "center", {
        /**
         * Get the center point of an actor (global position)
         */
        get: function () {
            var globalPos = this.getGlobalPos();
            return new vector_1.Vector(globalPos.x + this.width / 2 - this.anchor.x * this.width, globalPos.y + this.height / 2 - this.anchor.y * this.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "localCenter", {
        /**
         * Get the local center point of an actor
         */
        get: function () {
            return new vector_1.Vector(this.pos.x + this.width / 2 - this.anchor.x * this.width, this.pos.y + this.height / 2 - this.anchor.y * this.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "width", {
        get: function () {
            return this.collider.localBounds.width * this.getGlobalScale().x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "height", {
        get: function () {
            return this.collider.localBounds.height * this.getGlobalScale().y;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets this actor's rotation taking into account any parent relationships
     *
     * @returns Rotation angle in radians
     */
    Actor.prototype.getGlobalRotation = function () {
        return this.get(TransformComponent_1.TransformComponent).globalRotation;
    };
    /**
     * Gets an actor's world position taking into account parent relationships, scaling, rotation, and translation
     *
     * @returns Position in world coordinates
     */
    Actor.prototype.getGlobalPos = function () {
        return this.get(TransformComponent_1.TransformComponent).globalPos;
    };
    /**
     * Gets the global scale of the Actor
     */
    Actor.prototype.getGlobalScale = function () {
        return this.get(TransformComponent_1.TransformComponent).globalScale;
    };
    // #region Collision
    /**
     * Tests whether the x/y specified are contained in the actor
     * @param x  X coordinate to test (in world coordinates)
     * @param y  Y coordinate to test (in world coordinates)
     * @param recurse checks whether the x/y are contained in any child actors (if they exist).
     */
    Actor.prototype.contains = function (x, y, recurse) {
        if (recurse === void 0) { recurse = false; }
        var point = (0, vector_1.vec)(x, y);
        var collider = this.get(ColliderComponent_1.ColliderComponent);
        collider.update();
        var geom = collider.get();
        if (!geom) {
            return false;
        }
        var containment = geom.contains(point);
        if (recurse) {
            return (containment ||
                this.children.some(function (child) {
                    return child.contains(x, y, true);
                }));
        }
        return containment;
    };
    /**
     * Returns true if the two actor.collider's surfaces are less than or equal to the distance specified from each other
     * @param actor     Actor to test
     * @param distance  Distance in pixels to test
     */
    Actor.prototype.within = function (actor, distance) {
        var collider = this.get(ColliderComponent_1.ColliderComponent);
        var otherCollider = actor.get(ColliderComponent_1.ColliderComponent);
        var me = collider.get();
        var other = otherCollider.get();
        if (me && other) {
            return me.getClosestLineBetween(other).getLength() <= distance;
        }
        return false;
    };
    // #endregion
    // #region Update
    /**
     * Called by the Engine, updates the state of the actor
     * @internal
     * @param engine The reference to the current game engine
     * @param delta  The time elapsed since the last update in milliseconds
     */
    Actor.prototype.update = function (engine, delta) {
        this._initialize(engine);
        this._preupdate(engine, delta);
        this._postupdate(engine, delta);
    };
    /**
     * Safe to override onPreUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreUpdate` is called directly before an actor is updated.
     */
    Actor.prototype.onPreUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     * Safe to override onPostUpdate lifecycle event handler. Synonymous with `.on('postupdate', (evt) =>{...})`
     *
     * `onPostUpdate` is called directly after an actor is updated.
     */
    Actor.prototype.onPostUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPreUpdate]] lifecycle event
     * @internal
     */
    Actor.prototype._preupdate = function (engine, delta) {
        this.emit('preupdate', new Events_1.PreUpdateEvent(engine, delta, this));
        this.onPreUpdate(engine, delta);
    };
    /**
     * It is not recommended that internal excalibur methods be overridden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPostUpdate]] lifecycle event
     * @internal
     */
    Actor.prototype._postupdate = function (engine, delta) {
        this.emit('postupdate', new Events_1.PreUpdateEvent(engine, delta, this));
        this.onPostUpdate(engine, delta);
    };
    // #region Properties
    /**
     * Set defaults for all Actors
     */
    Actor.defaults = {
        anchor: vector_1.Vector.Half
    };
    return Actor;
}(Entity_1.Entity));
exports.Actor = Actor;
