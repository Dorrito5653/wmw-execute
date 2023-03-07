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
exports.ParticleEmitter = exports.Particle = exports.ParticleImpl = exports.EmitterType = void 0;
var Actor_1 = require("./Actor");
var Color_1 = require("./Color");
var vector_1 = require("./Math/vector");
var Util = require("./Util/Util");
var Configurable_1 = require("./Configurable");
var Random_1 = require("./Math/Random");
var CollisionType_1 = require("./Collision/CollisionType");
var TransformComponent_1 = require("./EntityComponentSystem/Components/TransformComponent");
var GraphicsComponent_1 = require("./Graphics/GraphicsComponent");
var Entity_1 = require("./EntityComponentSystem/Entity");
var BoundingBox_1 = require("./Collision/BoundingBox");
var util_1 = require("./Math/util");
/**
 * An enum that represents the types of emitter nozzles
 */
var EmitterType;
(function (EmitterType) {
    /**
     * Constant for the circular emitter type
     */
    EmitterType[EmitterType["Circle"] = 0] = "Circle";
    /**
     * Constant for the rectangular emitter type
     */
    EmitterType[EmitterType["Rectangle"] = 1] = "Rectangle";
})(EmitterType = exports.EmitterType || (exports.EmitterType = {}));
/**
 * @hidden
 */
var ParticleImpl = /** @class */ (function (_super) {
    __extends(ParticleImpl, _super);
    function ParticleImpl(emitterOrConfig, life, opacity, beginColor, endColor, position, velocity, acceleration, startSize, endSize) {
        var _this = _super.call(this) || this;
        _this.position = new vector_1.Vector(0, 0);
        _this.velocity = new vector_1.Vector(0, 0);
        _this.acceleration = new vector_1.Vector(0, 0);
        _this.particleRotationalVelocity = 0;
        _this.currentRotation = 0;
        _this.focus = null;
        _this.focusAccel = 0;
        _this.opacity = 1;
        _this.beginColor = Color_1.Color.White;
        _this.endColor = Color_1.Color.White;
        // Life is counted in ms
        _this.life = 300;
        _this.fadeFlag = false;
        // Color transitions
        _this._rRate = 1;
        _this._gRate = 1;
        _this._bRate = 1;
        _this._aRate = 0;
        _this._currentColor = Color_1.Color.White;
        _this.emitter = null;
        _this.particleSize = 5;
        _this.particleSprite = null;
        _this.sizeRate = 0;
        _this.elapsedMultiplier = 0;
        _this.visible = true;
        _this.isOffscreen = false;
        var emitter = emitterOrConfig;
        if (emitter && !(emitterOrConfig instanceof ParticleEmitter)) {
            var config = emitterOrConfig;
            emitter = config.emitter;
            life = config.life;
            opacity = config.opacity;
            endColor = config.endColor;
            beginColor = config.beginColor;
            position = config.position;
            velocity = config.velocity;
            acceleration = config.acceleration;
            startSize = config.startSize;
            endSize = config.endSize;
        }
        _this.emitter = emitter;
        _this.life = life || _this.life;
        _this.opacity = opacity || _this.opacity;
        _this.endColor = endColor || _this.endColor.clone();
        _this.beginColor = beginColor || _this.beginColor.clone();
        _this._currentColor = _this.beginColor.clone();
        _this.position = (position || _this.position).add(_this.emitter.pos);
        _this.velocity = velocity || _this.velocity;
        _this.acceleration = acceleration || _this.acceleration;
        _this._rRate = (_this.endColor.r - _this.beginColor.r) / _this.life;
        _this._gRate = (_this.endColor.g - _this.beginColor.g) / _this.life;
        _this._bRate = (_this.endColor.b - _this.beginColor.b) / _this.life;
        _this._aRate = _this.opacity / _this.life;
        _this.startSize = startSize || 0;
        _this.endSize = endSize || 0;
        if (_this.endSize > 0 && _this.startSize > 0) {
            _this.sizeRate = (_this.endSize - _this.startSize) / _this.life;
            _this.particleSize = _this.startSize;
        }
        _this.addComponent((_this.transform = new TransformComponent_1.TransformComponent()));
        _this.addComponent((_this.graphics = new GraphicsComponent_1.GraphicsComponent()));
        _this.transform.pos = _this.position;
        _this.transform.rotation = _this.currentRotation;
        _this.transform.scale = (0, vector_1.vec)(1, 1); // TODO wut
        if (_this.particleSprite) {
            _this.graphics.opacity = _this.opacity;
            _this.graphics.use(_this.particleSprite);
        }
        else {
            _this.graphics.localBounds = BoundingBox_1.BoundingBox.fromDimension(_this.particleSize, _this.particleSize, vector_1.Vector.Half);
            _this.graphics.onPostDraw = function (ctx) {
                ctx.save();
                _this.graphics.opacity = _this.opacity;
                var tmpColor = _this._currentColor.clone();
                tmpColor.a = 1;
                ctx.debug.drawPoint((0, vector_1.vec)(0, 0), { color: tmpColor, size: _this.particleSize });
                ctx.restore();
            };
        }
        return _this;
    }
    ParticleImpl.prototype.kill = function () {
        this.emitter.removeParticle(this);
    };
    ParticleImpl.prototype.update = function (_engine, delta) {
        this.life = this.life - delta;
        this.elapsedMultiplier = this.elapsedMultiplier + delta;
        if (this.life < 0) {
            this.kill();
        }
        if (this.fadeFlag) {
            this.opacity = (0, util_1.clamp)(this._aRate * this.life, 0.0001, 1);
        }
        if (this.startSize > 0 && this.endSize > 0) {
            this.particleSize = (0, util_1.clamp)(this.sizeRate * delta + this.particleSize, Math.min(this.startSize, this.endSize), Math.max(this.startSize, this.endSize));
        }
        this._currentColor.r = (0, util_1.clamp)(this._currentColor.r + this._rRate * delta, 0, 255);
        this._currentColor.g = (0, util_1.clamp)(this._currentColor.g + this._gRate * delta, 0, 255);
        this._currentColor.b = (0, util_1.clamp)(this._currentColor.b + this._bRate * delta, 0, 255);
        this._currentColor.a = (0, util_1.clamp)(this.opacity, 0.0001, 1);
        if (this.focus) {
            var accel = this.focus
                .sub(this.position)
                .normalize()
                .scale(this.focusAccel)
                .scale(delta / 1000);
            this.velocity = this.velocity.add(accel);
        }
        else {
            this.velocity = this.velocity.add(this.acceleration.scale(delta / 1000));
        }
        this.position = this.position.add(this.velocity.scale(delta / 1000));
        if (this.particleRotationalVelocity) {
            this.currentRotation = (this.currentRotation + (this.particleRotationalVelocity * delta) / 1000) % (2 * Math.PI);
        }
        this.transform.pos = this.position;
        this.transform.rotation = this.currentRotation;
        this.transform.scale = (0, vector_1.vec)(1, 1); // todo wut
        this.graphics.opacity = this.opacity;
    };
    return ParticleImpl;
}(Entity_1.Entity));
exports.ParticleImpl = ParticleImpl;
/**
 * Particle is used in a [[ParticleEmitter]]
 */
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    function Particle(emitterOrConfig, life, opacity, beginColor, endColor, position, velocity, acceleration, startSize, endSize) {
        return _super.call(this, emitterOrConfig, life, opacity, beginColor, endColor, position, velocity, acceleration, startSize, endSize) || this;
    }
    return Particle;
}((0, Configurable_1.Configurable)(ParticleImpl)));
exports.Particle = Particle;
/**
 * Using a particle emitter is a great way to create interesting effects
 * in your game, like smoke, fire, water, explosions, etc. `ParticleEmitter`
 * extend [[Actor]] allowing you to use all of the features that come with.
 */
var ParticleEmitter = /** @class */ (function (_super) {
    __extends(ParticleEmitter, _super);
    /**
     * @param config particle emitter options bag
     */
    function ParticleEmitter(config) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, { width: (_a = config.width) !== null && _a !== void 0 ? _a : 0, height: (_b = config.height) !== null && _b !== void 0 ? _b : 0 }) || this;
        _this._particlesToEmit = 0;
        _this.numParticles = 0;
        /**
         * Gets or sets the isEmitting flag
         */
        _this.isEmitting = true;
        /**
         * Gets or sets the backing particle collection
         */
        _this.particles = [];
        /**
         * Gets or sets the backing deadParticle collection
         */
        _this.deadParticles = [];
        /**
         * Gets or sets the minimum particle velocity
         */
        _this.minVel = 0;
        /**
         * Gets or sets the maximum particle velocity
         */
        _this.maxVel = 0;
        /**
         * Gets or sets the acceleration vector for all particles
         */
        _this.acceleration = new vector_1.Vector(0, 0);
        /**
         * Gets or sets the minimum angle in radians
         */
        _this.minAngle = 0;
        /**
         * Gets or sets the maximum angle in radians
         */
        _this.maxAngle = 0;
        /**
         * Gets or sets the emission rate for particles (particles/sec)
         */
        _this.emitRate = 1; //particles/sec
        /**
         * Gets or sets the life of each particle in milliseconds
         */
        _this.particleLife = 2000;
        /**
         * Gets or sets the fade flag which causes particles to gradually fade out over the course of their life.
         */
        _this.fadeFlag = false;
        /**
         * Gets or sets the optional focus where all particles should accelerate towards
         */
        _this.focus = null;
        /**
         * Gets or sets the acceleration for focusing particles if a focus has been specified
         */
        _this.focusAccel = null;
        /**
         * Gets or sets the optional starting size for the particles
         */
        _this.startSize = null;
        /**
         * Gets or sets the optional ending size for the particles
         */
        _this.endSize = null;
        /**
         * Gets or sets the minimum size of all particles
         */
        _this.minSize = 5;
        /**
         * Gets or sets the maximum size of all particles
         */
        _this.maxSize = 5;
        /**
         * Gets or sets the beginning color of all particles
         */
        _this.beginColor = Color_1.Color.White;
        /**
         * Gets or sets the ending color of all particles
         */
        _this.endColor = Color_1.Color.White;
        _this._sprite = null;
        /**
         * Gets or sets the emitter type for the particle emitter
         */
        _this.emitterType = EmitterType.Rectangle;
        /**
         * Gets or sets the emitter radius, only takes effect when the [[emitterType]] is [[EmitterType.Circle]]
         */
        _this.radius = 0;
        /**
         * Gets or sets the particle rotational speed velocity
         */
        _this.particleRotationalVelocity = 0;
        /**
         * Indicates whether particles should start with a random rotation
         */
        _this.randomRotation = false;
        var _c = __assign({}, config), x = _c.x, y = _c.y, pos = _c.pos, isEmitting = _c.isEmitting, minVel = _c.minVel, maxVel = _c.maxVel, acceleration = _c.acceleration, minAngle = _c.minAngle, maxAngle = _c.maxAngle, emitRate = _c.emitRate, particleLife = _c.particleLife, opacity = _c.opacity, fadeFlag = _c.fadeFlag, focus = _c.focus, focusAccel = _c.focusAccel, startSize = _c.startSize, endSize = _c.endSize, minSize = _c.minSize, maxSize = _c.maxSize, beginColor = _c.beginColor, endColor = _c.endColor, particleSprite = _c.particleSprite, emitterType = _c.emitterType, radius = _c.radius, particleRotationalVelocity = _c.particleRotationalVelocity, randomRotation = _c.randomRotation, random = _c.random;
        _this.pos = pos !== null && pos !== void 0 ? pos : (0, vector_1.vec)(x !== null && x !== void 0 ? x : 0, y !== null && y !== void 0 ? y : 0);
        _this.isEmitting = isEmitting !== null && isEmitting !== void 0 ? isEmitting : _this.isEmitting;
        _this.minVel = minVel !== null && minVel !== void 0 ? minVel : _this.minVel;
        _this.maxVel = maxVel !== null && maxVel !== void 0 ? maxVel : _this.maxVel;
        _this.acceleration = acceleration !== null && acceleration !== void 0 ? acceleration : _this.acceleration;
        _this.minAngle = minAngle !== null && minAngle !== void 0 ? minAngle : _this.minAngle;
        _this.maxAngle = maxAngle !== null && maxAngle !== void 0 ? maxAngle : _this.maxAngle;
        _this.emitRate = emitRate !== null && emitRate !== void 0 ? emitRate : _this.emitRate;
        _this.particleLife = particleLife !== null && particleLife !== void 0 ? particleLife : _this.particleLife;
        _this.opacity = opacity !== null && opacity !== void 0 ? opacity : _this.opacity;
        _this.fadeFlag = fadeFlag !== null && fadeFlag !== void 0 ? fadeFlag : _this.fadeFlag;
        _this.focus = focus !== null && focus !== void 0 ? focus : _this.focus;
        _this.focusAccel = focusAccel !== null && focusAccel !== void 0 ? focusAccel : _this.focusAccel;
        _this.startSize = startSize !== null && startSize !== void 0 ? startSize : _this.startSize;
        _this.endSize = endSize !== null && endSize !== void 0 ? endSize : _this.endSize;
        _this.minSize = minSize !== null && minSize !== void 0 ? minSize : _this.minSize;
        _this.maxSize = maxSize !== null && maxSize !== void 0 ? maxSize : _this.maxSize;
        _this.beginColor = beginColor !== null && beginColor !== void 0 ? beginColor : _this.beginColor;
        _this.endColor = endColor !== null && endColor !== void 0 ? endColor : _this.endColor;
        _this.particleSprite = particleSprite !== null && particleSprite !== void 0 ? particleSprite : _this.particleSprite;
        _this.emitterType = emitterType !== null && emitterType !== void 0 ? emitterType : _this.emitterType;
        _this.radius = radius !== null && radius !== void 0 ? radius : _this.radius;
        _this.particleRotationalVelocity = particleRotationalVelocity !== null && particleRotationalVelocity !== void 0 ? particleRotationalVelocity : _this.particleRotationalVelocity;
        _this.randomRotation = randomRotation !== null && randomRotation !== void 0 ? randomRotation : _this.randomRotation;
        _this.body.collisionType = CollisionType_1.CollisionType.PreventCollision;
        _this.random = random !== null && random !== void 0 ? random : new Random_1.Random();
        return _this;
    }
    Object.defineProperty(ParticleEmitter.prototype, "opacity", {
        /**
         * Gets the opacity of each particle from 0 to 1.0
         */
        get: function () {
            return _super.prototype.graphics.opacity;
        },
        /**
         * Gets the opacity of each particle from 0 to 1.0
         */
        set: function (opacity) {
            _super.prototype.graphics.opacity = opacity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "particleSprite", {
        /**
         * Gets or sets the sprite that a particle should use
         */
        get: function () {
            return this._sprite;
        },
        set: function (val) {
            if (val) {
                this._sprite = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    ParticleEmitter.prototype.removeParticle = function (particle) {
        this.deadParticles.push(particle);
    };
    /**
     * Causes the emitter to emit particles
     * @param particleCount  Number of particles to emit right now
     */
    ParticleEmitter.prototype.emitParticles = function (particleCount) {
        var _a;
        for (var i = 0; i < particleCount; i++) {
            var p = this._createParticle();
            this.particles.push(p);
            if ((_a = this === null || this === void 0 ? void 0 : this.scene) === null || _a === void 0 ? void 0 : _a.world) {
                this.scene.world.add(p);
            }
        }
    };
    ParticleEmitter.prototype.clearParticles = function () {
        this.particles.length = 0;
    };
    // Creates a new particle given the constraints of the emitter
    ParticleEmitter.prototype._createParticle = function () {
        // todo implement emitter constraints;
        var ranX = 0;
        var ranY = 0;
        var angle = (0, util_1.randomInRange)(this.minAngle, this.maxAngle, this.random);
        var vel = (0, util_1.randomInRange)(this.minVel, this.maxVel, this.random);
        var size = this.startSize || (0, util_1.randomInRange)(this.minSize, this.maxSize, this.random);
        var dx = vel * Math.cos(angle);
        var dy = vel * Math.sin(angle);
        if (this.emitterType === EmitterType.Rectangle) {
            ranX = (0, util_1.randomInRange)(0, this.width, this.random);
            ranY = (0, util_1.randomInRange)(0, this.height, this.random);
        }
        else if (this.emitterType === EmitterType.Circle) {
            var radius = (0, util_1.randomInRange)(0, this.radius, this.random);
            ranX = radius * Math.cos(angle);
            ranY = radius * Math.sin(angle);
        }
        var p = new Particle(this, this.particleLife, this.opacity, this.beginColor, this.endColor, new vector_1.Vector(ranX, ranY), new vector_1.Vector(dx, dy), this.acceleration, this.startSize, this.endSize);
        p.fadeFlag = this.fadeFlag;
        p.particleSize = size;
        if (this.particleSprite) {
            p.particleSprite = this.particleSprite;
            p.graphics.opacity = this.opacity;
            p.graphics.use(this._sprite);
        }
        p.particleRotationalVelocity = this.particleRotationalVelocity;
        if (this.randomRotation) {
            p.currentRotation = (0, util_1.randomInRange)(0, Math.PI * 2, this.random);
        }
        if (this.focus) {
            p.focus = this.focus.add(new vector_1.Vector(this.pos.x, this.pos.y));
            p.focusAccel = this.focusAccel;
        }
        return p;
    };
    ParticleEmitter.prototype.update = function (engine, delta) {
        var _a;
        _super.prototype.update.call(this, engine, delta);
        if (this.isEmitting) {
            this._particlesToEmit += this.emitRate * (delta / 1000);
            if (this._particlesToEmit > 1.0) {
                this.emitParticles(Math.floor(this._particlesToEmit));
                this._particlesToEmit = this._particlesToEmit - Math.floor(this._particlesToEmit);
            }
        }
        // deferred removal
        for (var i = 0; i < this.deadParticles.length; i++) {
            Util.removeItemFromArray(this.deadParticles[i], this.particles);
            if ((_a = this === null || this === void 0 ? void 0 : this.scene) === null || _a === void 0 ? void 0 : _a.world) {
                this.scene.world.remove(this.deadParticles[i], false);
            }
        }
        this.deadParticles.length = 0;
    };
    return ParticleEmitter;
}(Actor_1.Actor));
exports.ParticleEmitter = ParticleEmitter;
