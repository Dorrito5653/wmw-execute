"use strict";
exports.__esModule = true;
exports.PhysicsStats = exports.FrameStats = exports.Debug = void 0;
var DebugFlags_1 = require("./DebugFlags");
var Color_1 = require("../Color");
/**
 * Debug statistics and flags for Excalibur. If polling these values, it would be
 * best to do so on the `postupdate` event for [[Engine]], after all values have been
 * updated during a frame.
 */
var Debug = /** @class */ (function () {
    function Debug(engine) {
        /**
         * Performance statistics
         */
        this.stats = {
            /**
             * Current frame statistics. Engine reuses this instance, use [[FrameStats.clone]] to copy frame stats.
             * Best accessed on [[postframe]] event. See [[FrameStats]]
             */
            currFrame: new FrameStats(),
            /**
             * Previous frame statistics. Engine reuses this instance, use [[FrameStats.clone]] to copy frame stats.
             * Best accessed on [[preframe]] event. Best inspected on engine event `preframe`. See [[FrameStats]]
             */
            prevFrame: new FrameStats()
        };
        /**
         * Filter debug context to named entities or entity ids
         */
        this.filter = {
            /**
             * Toggle filter on or off (default off) must be on for DebugDraw to use filters
             */
            useFilter: false,
            /**
             * Query for entities by name, if the entity name contains `nameQuery` it will be included
             */
            nameQuery: '',
            /**
             * Query for Entity ids, if the id matches it will be included
             */
            ids: []
        };
        /**
         * Entity debug settings
         */
        this.entity = {
            showAll: false,
            showId: true,
            showName: false
        };
        /**
         * Transform component debug settings
         */
        this.transform = {
            showAll: false,
            showPosition: false,
            showPositionLabel: false,
            positionColor: Color_1.Color.Yellow,
            showZIndex: false,
            showScale: false,
            scaleColor: Color_1.Color.Green,
            showRotation: false,
            rotationColor: Color_1.Color.Blue
        };
        /**
         * Graphics component debug settings
         */
        this.graphics = {
            showAll: false,
            showBounds: true,
            boundsColor: Color_1.Color.Yellow
        };
        /**
         * Collider component debug settings
         */
        this.collider = {
            showAll: false,
            showBounds: true,
            boundsColor: Color_1.Color.Blue,
            showOwner: false,
            showGeometry: true,
            geometryColor: Color_1.Color.Green
        };
        /**
         * Physics simulation debug settings
         */
        this.physics = {
            showAll: false,
            showBroadphaseSpacePartitionDebug: false,
            showCollisionNormals: false,
            collisionNormalColor: Color_1.Color.Cyan,
            showCollisionContacts: true,
            collisionContactColor: Color_1.Color.Red
        };
        /**
         * Motion component debug settings
         */
        this.motion = {
            showAll: false,
            showVelocity: false,
            velocityColor: Color_1.Color.Yellow,
            showAcceleration: false,
            accelerationColor: Color_1.Color.Red
        };
        /**
         * Body component debug settings
         */
        this.body = {
            showAll: false,
            showCollisionGroup: false,
            showCollisionType: false,
            showSleeping: false,
            showMotion: false,
            showMass: false
        };
        /**
         * Camera debug settings
         */
        this.camera = {
            showAll: false,
            showFocus: false,
            focusColor: Color_1.Color.Red,
            showZoom: false
        };
        this._engine = engine;
        this.colorBlindMode = new DebugFlags_1.ColorBlindFlags(this._engine);
    }
    /**
     * Switch the current excalibur clock with the [[TestClock]] and return
     * it in the same running state.
     *
     * This is useful when you need to debug frame by frame.
     */
    Debug.prototype.useTestClock = function () {
        var clock = this._engine.clock;
        var wasRunning = clock.isRunning();
        clock.stop();
        var testClock = clock.toTestClock();
        if (wasRunning) {
            testClock.start();
        }
        this._engine.clock = testClock;
        return testClock;
    };
    /**
     * Switch the current excalibur clock with the [[StandardClock]] and
     * return it in the same running state.
     *
     * This is useful when you need to switch back to normal mode after
     * debugging.
     */
    Debug.prototype.useStandardClock = function () {
        var currentClock = this._engine.clock;
        var wasRunning = currentClock.isRunning();
        currentClock.stop();
        var standardClock = currentClock.toStandardClock();
        if (wasRunning) {
            standardClock.start();
        }
        this._engine.clock = standardClock;
        return standardClock;
    };
    return Debug;
}());
exports.Debug = Debug;
/**
 * Implementation of a frame's stats. Meant to have values copied via [[FrameStats.reset]], avoid
 * creating instances of this every frame.
 */
var FrameStats = /** @class */ (function () {
    function FrameStats() {
        this._id = 0;
        this._delta = 0;
        this._fps = 0;
        this._actorStats = {
            alive: 0,
            killed: 0,
            ui: 0,
            get remaining() {
                return this.alive - this.killed;
            },
            get total() {
                return this.remaining + this.ui;
            }
        };
        this._durationStats = {
            update: 0,
            draw: 0,
            get total() {
                return this.update + this.draw;
            }
        };
        this._physicsStats = new PhysicsStats();
        this._graphicsStats = {
            drawCalls: 0,
            drawnImages: 0
        };
    }
    /**
     * Zero out values or clone other IFrameStat stats. Allows instance reuse.
     *
     * @param [otherStats] Optional stats to clone
     */
    FrameStats.prototype.reset = function (otherStats) {
        if (otherStats) {
            this.id = otherStats.id;
            this.delta = otherStats.delta;
            this.fps = otherStats.fps;
            this.actors.alive = otherStats.actors.alive;
            this.actors.killed = otherStats.actors.killed;
            this.actors.ui = otherStats.actors.ui;
            this.duration.update = otherStats.duration.update;
            this.duration.draw = otherStats.duration.draw;
            this._physicsStats.reset(otherStats.physics);
            this.graphics.drawCalls = otherStats.graphics.drawCalls;
            this.graphics.drawnImages = otherStats.graphics.drawnImages;
        }
        else {
            this.id = this.delta = this.fps = 0;
            this.actors.alive = this.actors.killed = this.actors.ui = 0;
            this.duration.update = this.duration.draw = 0;
            this._physicsStats.reset();
            this.graphics.drawnImages = this.graphics.drawCalls = 0;
        }
    };
    /**
     * Provides a clone of this instance.
     */
    FrameStats.prototype.clone = function () {
        var fs = new FrameStats();
        fs.reset(this);
        return fs;
    };
    Object.defineProperty(FrameStats.prototype, "id", {
        /**
         * Gets the frame's id
         */
        get: function () {
            return this._id;
        },
        /**
         * Sets the frame's id
         */
        set: function (value) {
            this._id = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "delta", {
        /**
         * Gets the frame's delta (time since last frame)
         */
        get: function () {
            return this._delta;
        },
        /**
         * Sets the frame's delta (time since last frame). Internal use only.
         * @internal
         */
        set: function (value) {
            this._delta = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "fps", {
        /**
         * Gets the frame's frames-per-second (FPS)
         */
        get: function () {
            return this._fps;
        },
        /**
         * Sets the frame's frames-per-second (FPS). Internal use only.
         * @internal
         */
        set: function (value) {
            this._fps = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "actors", {
        /**
         * Gets the frame's actor statistics
         */
        get: function () {
            return this._actorStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "duration", {
        /**
         * Gets the frame's duration statistics
         */
        get: function () {
            return this._durationStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "physics", {
        /**
         * Gets the frame's physics statistics
         */
        get: function () {
            return this._physicsStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "graphics", {
        /**
         * Gets the frame's graphics statistics
         */
        get: function () {
            return this._graphicsStats;
        },
        enumerable: false,
        configurable: true
    });
    return FrameStats;
}());
exports.FrameStats = FrameStats;
var PhysicsStats = /** @class */ (function () {
    function PhysicsStats() {
        this._pairs = 0;
        this._collisions = 0;
        this._contacts = new Map();
        this._fastBodies = 0;
        this._fastBodyCollisions = 0;
        this._broadphase = 0;
        this._narrowphase = 0;
    }
    /**
     * Zero out values or clone other IPhysicsStats stats. Allows instance reuse.
     *
     * @param [otherStats] Optional stats to clone
     */
    PhysicsStats.prototype.reset = function (otherStats) {
        if (otherStats) {
            this.pairs = otherStats.pairs;
            this.collisions = otherStats.collisions;
            this.contacts = otherStats.contacts;
            this.fastBodies = otherStats.fastBodies;
            this.fastBodyCollisions = otherStats.fastBodyCollisions;
            this.broadphase = otherStats.broadphase;
            this.narrowphase = otherStats.narrowphase;
        }
        else {
            this.pairs = this.collisions = this.fastBodies = 0;
            this.fastBodyCollisions = this.broadphase = this.narrowphase = 0;
            this.contacts.clear();
        }
    };
    /**
     * Provides a clone of this instance.
     */
    PhysicsStats.prototype.clone = function () {
        var ps = new PhysicsStats();
        ps.reset(this);
        return ps;
    };
    Object.defineProperty(PhysicsStats.prototype, "pairs", {
        get: function () {
            return this._pairs;
        },
        set: function (value) {
            this._pairs = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "collisions", {
        get: function () {
            return this._collisions;
        },
        set: function (value) {
            this._collisions = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "contacts", {
        get: function () {
            return this._contacts;
        },
        set: function (contacts) {
            this._contacts = contacts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "fastBodies", {
        get: function () {
            return this._fastBodies;
        },
        set: function (value) {
            this._fastBodies = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "fastBodyCollisions", {
        get: function () {
            return this._fastBodyCollisions;
        },
        set: function (value) {
            this._fastBodyCollisions = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "broadphase", {
        get: function () {
            return this._broadphase;
        },
        set: function (value) {
            this._broadphase = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "narrowphase", {
        get: function () {
            return this._narrowphase;
        },
        set: function (value) {
            this._narrowphase = value;
        },
        enumerable: false,
        configurable: true
    });
    return PhysicsStats;
}());
exports.PhysicsStats = PhysicsStats;
