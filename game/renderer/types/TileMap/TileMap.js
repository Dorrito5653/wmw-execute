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
exports.Tile = exports.TileMap = void 0;
var BoundingBox_1 = require("../Collision/BoundingBox");
var vector_1 = require("../Math/vector");
var Log_1 = require("../Util/Log");
var Events = require("../Events");
var Entity_1 = require("../EntityComponentSystem/Entity");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
var BodyComponent_1 = require("../Collision/BodyComponent");
var CollisionType_1 = require("../Collision/CollisionType");
var Shape_1 = require("../Collision/Colliders/Shape");
var Graphics_1 = require("../Graphics");
var Util_1 = require("../Util/Util");
var MotionComponent_1 = require("../EntityComponentSystem/Components/MotionComponent");
var ColliderComponent_1 = require("../Collision/ColliderComponent");
var Color_1 = require("../Color");
var DebugGraphicsComponent_1 = require("../Graphics/DebugGraphicsComponent");
/**
 * The TileMap provides a mechanism for doing flat 2D tiles rendered in a grid.
 *
 * TileMaps are useful for top down or side scrolling grid oriented games.
 */
var TileMap = /** @class */ (function (_super) {
    __extends(TileMap, _super);
    /**
     * @param options
     */
    function TileMap(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, null, options.name) || this;
        _this._token = 0;
        _this._onScreenXStart = 0;
        _this._onScreenXEnd = Number.MAX_VALUE;
        _this._onScreenYStart = 0;
        _this._onScreenYEnd = Number.MAX_VALUE;
        _this.logger = Log_1.Logger.getInstance();
        _this.tiles = [];
        _this._rows = [];
        _this._cols = [];
        _this.renderFromTopOfGraphic = false;
        _this._collidersDirty = true;
        _this._originalOffsets = new WeakMap();
        _this.addComponent(new TransformComponent_1.TransformComponent());
        _this.addComponent(new MotionComponent_1.MotionComponent());
        _this.addComponent(new BodyComponent_1.BodyComponent({
            type: CollisionType_1.CollisionType.Fixed
        }));
        _this.addComponent(new Graphics_1.GraphicsComponent({
            onPostDraw: function (ctx, delta) { return _this.draw(ctx, delta); }
        }));
        _this.addComponent(new DebugGraphicsComponent_1.DebugGraphicsComponent(function (ctx) { return _this.debug(ctx); }));
        _this.addComponent(new ColliderComponent_1.ColliderComponent());
        _this._graphics = _this.get(Graphics_1.GraphicsComponent);
        _this._transform = _this.get(TransformComponent_1.TransformComponent);
        _this._motion = _this.get(MotionComponent_1.MotionComponent);
        _this._collider = _this.get(ColliderComponent_1.ColliderComponent);
        _this._composite = _this._collider.useCompositeCollider([]);
        _this._transform.pos = (_a = options.pos) !== null && _a !== void 0 ? _a : vector_1.Vector.Zero;
        _this._oldPos = _this._transform.pos;
        _this.renderFromTopOfGraphic = (_b = options.renderFromTopOfGraphic) !== null && _b !== void 0 ? _b : _this.renderFromTopOfGraphic;
        _this.tileWidth = options.tileWidth;
        _this.tileHeight = options.tileHeight;
        _this.rows = options.rows;
        _this.columns = options.columns;
        _this.tiles = new Array(_this.rows * _this.columns);
        _this._rows = new Array(_this.rows);
        _this._cols = new Array(_this.columns);
        var currentCol = [];
        for (var i = 0; i < _this.columns; i++) {
            for (var j = 0; j < _this.rows; j++) {
                var cd = new Tile({
                    x: i,
                    y: j,
                    map: _this
                });
                cd.map = _this;
                _this.tiles[i + j * _this.columns] = cd;
                currentCol.push(cd);
                if (!_this._rows[j]) {
                    _this._rows[j] = [];
                }
                _this._rows[j].push(cd);
            }
            _this._cols[i] = currentCol;
            currentCol = [];
        }
        _this._graphics.localBounds = new BoundingBox_1.BoundingBox({
            left: 0,
            top: 0,
            right: _this.columns * _this.tileWidth,
            bottom: _this.rows * _this.tileHeight
        });
        return _this;
    }
    TileMap.prototype.flagCollidersDirty = function () {
        this._collidersDirty = true;
    };
    Object.defineProperty(TileMap.prototype, "x", {
        get: function () {
            var _a;
            return (_a = this._transform.pos.x) !== null && _a !== void 0 ? _a : 0;
        },
        set: function (val) {
            var _a;
            if ((_a = this._transform) === null || _a === void 0 ? void 0 : _a.pos) {
                this.get(TransformComponent_1.TransformComponent).pos = (0, vector_1.vec)(val, this.y);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileMap.prototype, "y", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._transform) === null || _a === void 0 ? void 0 : _a.pos.y) !== null && _b !== void 0 ? _b : 0;
        },
        set: function (val) {
            var _a;
            if ((_a = this._transform) === null || _a === void 0 ? void 0 : _a.pos) {
                this._transform.pos = (0, vector_1.vec)(this.x, val);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileMap.prototype, "z", {
        get: function () {
            var _a;
            return (_a = this._transform.z) !== null && _a !== void 0 ? _a : 0;
        },
        set: function (val) {
            if (this._transform) {
                this._transform.z = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileMap.prototype, "rotation", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._transform) === null || _a === void 0 ? void 0 : _a.rotation) !== null && _b !== void 0 ? _b : 0;
        },
        set: function (val) {
            var _a;
            if ((_a = this._transform) === null || _a === void 0 ? void 0 : _a.rotation) {
                this._transform.rotation = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileMap.prototype, "scale", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._transform) === null || _a === void 0 ? void 0 : _a.scale) !== null && _b !== void 0 ? _b : vector_1.Vector.One;
        },
        set: function (val) {
            var _a;
            if ((_a = this._transform) === null || _a === void 0 ? void 0 : _a.scale) {
                this._transform.scale = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileMap.prototype, "pos", {
        get: function () {
            return this._transform.pos;
        },
        set: function (val) {
            this._transform.pos = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileMap.prototype, "vel", {
        get: function () {
            return this._motion.vel;
        },
        set: function (val) {
            this._motion.vel = val;
        },
        enumerable: false,
        configurable: true
    });
    TileMap.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    TileMap.prototype._initialize = function (engine) {
        _super.prototype._initialize.call(this, engine);
    };
    TileMap.prototype._getOrSetColliderOriginalOffset = function (collider) {
        if (!this._originalOffsets.has(collider)) {
            var originalOffset = collider.offset;
            this._originalOffsets.set(collider, originalOffset);
            return originalOffset;
        }
        else {
            return this._originalOffsets.get(collider);
        }
    };
    /**
     * Tiles colliders based on the solid tiles in the tilemap.
     */
    TileMap.prototype._updateColliders = function () {
        this._composite.clearColliders();
        var colliders = [];
        this._composite = this._collider.useCompositeCollider([]);
        var current;
        // Bad square tesselation algo
        for (var i = 0; i < this.columns; i++) {
            // Scan column for colliders
            for (var j = 0; j < this.rows; j++) {
                // Columns start with a new collider
                if (j === 0) {
                    current = null;
                }
                var tile = this.tiles[i + j * this.columns];
                // Current tile in column is solid build up current collider
                if (tile.solid) {
                    // Use custom collider otherwise bounding box
                    if (tile.getColliders().length > 0) {
                        for (var _i = 0, _a = tile.getColliders(); _i < _a.length; _i++) {
                            var collider = _a[_i];
                            var originalOffset = this._getOrSetColliderOriginalOffset(collider);
                            collider.offset = (0, vector_1.vec)(tile.x * this.tileWidth, tile.y * this.tileHeight).add(originalOffset);
                            collider.owner = this;
                            this._composite.addCollider(collider);
                        }
                        current = null;
                    }
                    else {
                        if (!current) {
                            current = tile.bounds;
                        }
                        else {
                            current = current.combine(tile.bounds);
                        }
                    }
                }
                else {
                    // Not solid skip and cut off the current collider
                    if (current) {
                        colliders.push(current);
                    }
                    current = null;
                }
            }
            // After a column is complete check to see if it can be merged into the last one
            if (current) {
                // if previous is the same combine it
                var prev = colliders[colliders.length - 1];
                if (prev && prev.top === current.top && prev.bottom === current.bottom) {
                    colliders[colliders.length - 1] = prev.combine(current);
                }
                else {
                    // else new collider
                    colliders.push(current);
                }
            }
        }
        for (var _b = 0, colliders_1 = colliders; _b < colliders_1.length; _b++) {
            var c = colliders_1[_b];
            var collider = Shape_1.Shape.Box(c.width, c.height, vector_1.Vector.Zero, (0, vector_1.vec)(c.left - this.pos.x, c.top - this.pos.y));
            collider.owner = this;
            this._composite.addCollider(collider);
        }
        this._collider.update();
    };
    /**
     * Returns the [[Tile]] by index (row major order)
     */
    TileMap.prototype.getTileByIndex = function (index) {
        return this.tiles[index];
    };
    /**
     * Returns the [[Tile]] by its x and y integer coordinates
     */
    TileMap.prototype.getTile = function (x, y) {
        if (x < 0 || y < 0 || x >= this.columns || y >= this.rows) {
            return null;
        }
        return this.tiles[x + y * this.columns];
    };
    /**
     * Returns the [[Tile]] by testing a point in world coordinates,
     * returns `null` if no Tile was found.
     */
    TileMap.prototype.getTileByPoint = function (point) {
        var x = Math.floor((point.x - this.pos.x) / this.tileWidth);
        var y = Math.floor((point.y - this.pos.y) / this.tileHeight);
        var tile = this.getTile(x, y);
        if (x >= 0 && y >= 0 && x < this.columns && y < this.rows && tile) {
            return tile;
        }
        return null;
    };
    TileMap.prototype.getRows = function () {
        return this._rows;
    };
    TileMap.prototype.getColumns = function () {
        return this._cols;
    };
    TileMap.prototype.update = function (engine, delta) {
        this.onPreUpdate(engine, delta);
        this.emit('preupdate', new Events.PreUpdateEvent(engine, delta, this));
        if (!this._oldPos.equals(this.pos)) {
            this.flagCollidersDirty();
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i]) {
                    this.tiles[i].flagDirty();
                }
            }
        }
        if (this._collidersDirty) {
            this._collidersDirty = false;
            this._updateColliders();
        }
        this._token++;
        var worldBounds = engine.getWorldBounds();
        var worldCoordsUpperLeft = (0, vector_1.vec)(worldBounds.left, worldBounds.top);
        var worldCoordsLowerRight = (0, vector_1.vec)(worldBounds.right, worldBounds.bottom);
        var pos = this.pos;
        var maybeParallax = this.get(Graphics_1.ParallaxComponent);
        var parallaxOffset = vector_1.Vector.One;
        if (maybeParallax) {
            var oneMinusFactor = vector_1.Vector.One.sub(maybeParallax.parallaxFactor);
            parallaxOffset = engine.currentScene.camera.pos.scale(oneMinusFactor);
            pos = pos.add(parallaxOffset);
        }
        this._onScreenXStart = Math.max(Math.floor((worldCoordsUpperLeft.x - pos.x) / this.tileWidth) - 2, 0);
        this._onScreenYStart = Math.max(Math.floor((worldCoordsUpperLeft.y - pos.y) / this.tileHeight) - 2, 0);
        this._onScreenXEnd = Math.max(Math.floor((worldCoordsLowerRight.x - pos.x) / this.tileWidth) + 2, 0);
        this._onScreenYEnd = Math.max(Math.floor((worldCoordsLowerRight.y - pos.y) / this.tileHeight) + 2, 0);
        // why are we resetting pos?
        this._transform.pos = (0, vector_1.vec)(this.x, this.y);
        this.onPostUpdate(engine, delta);
        this.emit('postupdate', new Events.PostUpdateEvent(engine, delta, this));
    };
    /**
     * Draws the tile map to the screen. Called by the [[Scene]].
     * @param ctx ExcaliburGraphicsContext
     * @param delta  The number of milliseconds since the last draw
     */
    TileMap.prototype.draw = function (ctx, delta) {
        this.emit('predraw', new Events.PreDrawEvent(ctx, delta, this)); // TODO fix event
        var x = this._onScreenXStart;
        var xEnd = Math.min(this._onScreenXEnd, this.columns);
        var y = this._onScreenYStart;
        var yEnd = Math.min(this._onScreenYEnd, this.rows);
        var graphics, graphicsIndex, graphicsLen;
        for (x; x < xEnd; x++) {
            for (y; y < yEnd; y++) {
                // get non-negative tile sprites
                graphics = this.getTile(x, y).getGraphics();
                for (graphicsIndex = 0, graphicsLen = graphics.length; graphicsIndex < graphicsLen; graphicsIndex++) {
                    // draw sprite, warning if sprite doesn't exist
                    var graphic = graphics[graphicsIndex];
                    if (graphic) {
                        if ((0, Graphics_1.hasGraphicsTick)(graphic)) {
                            graphic === null || graphic === void 0 ? void 0 : graphic.tick(delta, this._token);
                        }
                        var offsetY = this.renderFromTopOfGraphic ? 0 : (graphic.height - this.tileHeight);
                        graphic.draw(ctx, x * this.tileWidth, y * this.tileHeight - offsetY);
                    }
                }
            }
            y = this._onScreenYStart;
        }
        this.emit('postdraw', new Events.PostDrawEvent(ctx, delta, this));
    };
    TileMap.prototype.debug = function (gfx) {
        var width = this.tileWidth * this.columns;
        var height = this.tileHeight * this.rows;
        var pos = vector_1.Vector.Zero;
        for (var r = 0; r < this.rows + 1; r++) {
            var yOffset = (0, vector_1.vec)(0, r * this.tileHeight);
            gfx.drawLine(pos.add(yOffset), pos.add((0, vector_1.vec)(width, yOffset.y)), Color_1.Color.Red, 2);
        }
        for (var c = 0; c < this.columns + 1; c++) {
            var xOffset = (0, vector_1.vec)(c * this.tileWidth, 0);
            gfx.drawLine(pos.add(xOffset), pos.add((0, vector_1.vec)(xOffset.x, height)), Color_1.Color.Red, 2);
        }
        var colliders = this._composite.getColliders();
        for (var _i = 0, colliders_2 = colliders; _i < colliders_2.length; _i++) {
            var collider = colliders_2[_i];
            var grayish = Color_1.Color.Gray;
            grayish.a = 0.5;
            var bounds = collider.localBounds;
            var pos_1 = collider.worldPos.sub(this.pos);
            gfx.drawRectangle(pos_1, bounds.width, bounds.height, grayish);
        }
    };
    return TileMap;
}(Entity_1.Entity));
exports.TileMap = TileMap;
/**
 * TileMap Tile
 *
 * A light-weight object that occupies a space in a collision map. Generally
 * created by a [[TileMap]].
 *
 * Tiles can draw multiple sprites. Note that the order of drawing is the order
 * of the sprites in the array so the last one will be drawn on top. You can
 * use transparency to create layers this way.
 */
var Tile = /** @class */ (function (_super) {
    __extends(Tile, _super);
    function Tile(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this) || this;
        _this._posDirty = false;
        _this._solid = false;
        _this._graphics = [];
        /**
         * Current list of colliders for this tile
         */
        _this._colliders = [];
        /**
         * Arbitrary data storage per tile, useful for any game specific data
         */
        _this.data = new Map();
        _this.x = options.x;
        _this.y = options.y;
        _this.map = options.map;
        _this.width = options.map.tileWidth;
        _this.height = options.map.tileHeight;
        _this.solid = (_a = options.solid) !== null && _a !== void 0 ? _a : _this.solid;
        _this._graphics = (_b = options.graphics) !== null && _b !== void 0 ? _b : [];
        _this._recalculate();
        return _this;
    }
    Object.defineProperty(Tile.prototype, "pos", {
        // private _transform: TransformComponent;
        /**
         * Return the world position of the top left corner of the tile
         */
        get: function () {
            if (this._posDirty) {
                this._recalculate();
                this._posDirty = false;
            }
            return this._pos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "solid", {
        /**
         * Wether this tile should be treated as solid by the tilemap
         */
        get: function () {
            return this._solid;
        },
        /**
         * Wether this tile should be treated as solid by the tilemap
         */
        set: function (val) {
            var _a;
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.flagCollidersDirty();
            this._solid = val;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Current list of graphics for this tile
     */
    Tile.prototype.getGraphics = function () {
        return this._graphics;
    };
    /**
     * Add another [[Graphic]] to this TileMap tile
     * @param graphic
     */
    Tile.prototype.addGraphic = function (graphic) {
        this._graphics.push(graphic);
    };
    /**
     * Remove an instance of a [[Graphic]] from this tile
     */
    Tile.prototype.removeGraphic = function (graphic) {
        (0, Util_1.removeItemFromArray)(graphic, this._graphics);
    };
    /**
     * Clear all graphics from this tile
     */
    Tile.prototype.clearGraphics = function () {
        this._graphics.length = 0;
    };
    /**
     * Returns the list of colliders
     */
    Tile.prototype.getColliders = function () {
        return this._colliders;
    };
    /**
     * Adds a custom collider to the [[Tile]] to use instead of it's bounds
     *
     * If no collider is set but [[Tile.solid]] is set, the tile bounds are used as a collider.
     *
     * **Note!** the [[Tile.solid]] must be set to true for it to act as a "fixed" collider
     * @param collider
     */
    Tile.prototype.addCollider = function (collider) {
        this._colliders.push(collider);
        this.map.flagCollidersDirty();
    };
    /**
     * Removes a collider from the [[Tile]]
     * @param collider
     */
    Tile.prototype.removeCollider = function (collider) {
        var index = this._colliders.indexOf(collider);
        if (index > -1) {
            this._colliders.splice(index, 1);
        }
        this.map.flagCollidersDirty();
    };
    /**
     * Clears all colliders from the [[Tile]]
     */
    Tile.prototype.clearColliders = function () {
        this._colliders.length = 0;
        this.map.flagCollidersDirty();
    };
    Tile.prototype.flagDirty = function () {
        return this._posDirty = true;
    };
    Tile.prototype._recalculate = function () {
        this._pos = this.map.pos.add((0, vector_1.vec)(this.x * this.map.tileWidth, this.y * this.map.tileHeight));
        this._bounds = new BoundingBox_1.BoundingBox(this._pos.x, this._pos.y, this._pos.x + this.width, this._pos.y + this.height);
        this._posDirty = false;
    };
    Object.defineProperty(Tile.prototype, "bounds", {
        get: function () {
            if (this._posDirty) {
                this._recalculate();
            }
            return this._bounds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "center", {
        get: function () {
            if (this._posDirty) {
                this._recalculate();
            }
            return new vector_1.Vector(this._pos.x + this.width / 2, this._pos.y + this.height / 2);
        },
        enumerable: false,
        configurable: true
    });
    return Tile;
}(Entity_1.Entity));
exports.Tile = Tile;
