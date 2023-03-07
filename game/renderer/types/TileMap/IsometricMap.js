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
exports.IsometricMap = exports.IsometricTile = void 0;
var __1 = require("..");
var TransformComponent_1 = require("../EntityComponentSystem/Components/TransformComponent");
var Entity_1 = require("../EntityComponentSystem/Entity");
var Graphics_1 = require("../Graphics");
var IsometricEntityComponent_1 = require("./IsometricEntityComponent");
var IsometricTile = /** @class */ (function (_super) {
    __extends(IsometricTile, _super);
    /**
     * Construct a new IsometricTile
     * @param x tile coordinate in x (not world position)
     * @param y tile coordinate in y (not world position)
     * @param graphicsOffset offset that tile should be shifted by (default (0, 0))
     * @param map reference to owning IsometricMap
     */
    function IsometricTile(x, y, graphicsOffset, map) {
        var _this = _super.call(this, [
            new TransformComponent_1.TransformComponent(),
            new Graphics_1.GraphicsComponent({
                offset: graphicsOffset !== null && graphicsOffset !== void 0 ? graphicsOffset : __1.Vector.Zero,
                onPostDraw: function (gfx, elapsed) { return _this.draw(gfx, elapsed); }
            }),
            new IsometricEntityComponent_1.IsometricEntityComponent(map)
        ]) || this;
        /**
         * Indicates whether this tile is solid
         */
        _this.solid = false;
        _this._tileBounds = new __1.BoundingBox();
        _this._graphics = [];
        /**
         * Tile colliders
         */
        _this._colliders = [];
        _this.x = x;
        _this.y = y;
        _this.map = map;
        _this._transform = _this.get(TransformComponent_1.TransformComponent);
        _this._isometricEntityComponent = _this.get(IsometricEntityComponent_1.IsometricEntityComponent);
        var halfTileWidth = _this.map.tileWidth / 2;
        var halfTileHeight = _this.map.tileHeight / 2;
        // See https://clintbellanger.net/articles/isometric_math/ for formula
        // The x position shifts left with every y step
        var xPos = (_this.x - _this.y) * halfTileWidth;
        // The y position needs to go down with every x step
        var yPos = (_this.x + _this.y) * halfTileHeight;
        _this._transform.pos = (0, __1.vec)(xPos, yPos);
        _this._isometricEntityComponent.elevation = 0;
        _this._gfx = _this.get(Graphics_1.GraphicsComponent);
        _this._gfx.visible = false; // start not visible
        var totalWidth = _this.map.tileWidth;
        var totalHeight = _this.map.tileHeight;
        // initial guess at gfx bounds based on the tile
        var offset = (0, __1.vec)(0, (_this.map.renderFromTopOfGraphic ? totalHeight : 0));
        _this._gfx.localBounds = _this._tileBounds = new __1.BoundingBox({
            left: -totalWidth / 2,
            top: -totalHeight,
            right: totalWidth / 2,
            bottom: totalHeight
        }).translate(offset);
        return _this;
    }
    IsometricTile.prototype.getGraphics = function () {
        return this._graphics;
    };
    /**
     * Tile graphics
     */
    IsometricTile.prototype.addGraphic = function (graphic) {
        this._graphics.push(graphic);
        this._gfx.visible = true;
        this._gfx.localBounds = this._recalculateBounds();
    };
    IsometricTile.prototype._recalculateBounds = function () {
        var bounds = this._tileBounds.clone();
        for (var _i = 0, _a = this._graphics; _i < _a.length; _i++) {
            var graphic = _a[_i];
            var offset = (0, __1.vec)(this.map.graphicsOffset.x - this.map.tileWidth / 2, this.map.graphicsOffset.y - (this.map.renderFromTopOfGraphic ? 0 : (graphic.height - this.map.tileHeight)));
            bounds = bounds.combine(graphic.localBounds.translate(offset));
        }
        return bounds;
    };
    IsometricTile.prototype.removeGraphic = function (graphic) {
        var index = this._graphics.indexOf(graphic);
        if (index > -1) {
            this._graphics.splice(index, 1);
        }
        this._gfx.localBounds = this._recalculateBounds();
    };
    IsometricTile.prototype.clearGraphics = function () {
        this._graphics.length = 0;
        this._gfx.visible = false;
        this._gfx.localBounds = this._recalculateBounds();
    };
    IsometricTile.prototype.getColliders = function () {
        return this._colliders;
    };
    /**
     * Adds a collider to the IsometricTile
     *
     * **Note!** the [[Tile.solid]] must be set to true for it to act as a "fixed" collider
     * @param collider
     */
    IsometricTile.prototype.addCollider = function (collider) {
        this._colliders.push(collider);
        this.map.flagCollidersDirty();
    };
    /**
     * Removes a collider from the IsometricTile
     * @param collider
     */
    IsometricTile.prototype.removeCollider = function (collider) {
        var index = this._colliders.indexOf(collider);
        if (index > -1) {
            this._colliders.splice(index, 1);
        }
        this.map.flagCollidersDirty();
    };
    /**
     * Clears all colliders from the IsometricTile
     */
    IsometricTile.prototype.clearColliders = function () {
        this._colliders.length = 0;
        this.map.flagCollidersDirty();
    };
    Object.defineProperty(IsometricTile.prototype, "pos", {
        /**
         * Returns the top left corner of the [[IsometricTile]] in world space
         */
        get: function () {
            return this.map.tileToWorld((0, __1.vec)(this.x, this.y));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IsometricTile.prototype, "center", {
        /**
         * Returns the center of the [[IsometricTile]]
         */
        get: function () {
            return this.pos.add((0, __1.vec)(0, this.map.tileHeight / 2));
        },
        enumerable: false,
        configurable: true
    });
    IsometricTile.prototype.draw = function (gfx, _elapsed) {
        var halfTileWidth = this.map.tileWidth / 2;
        gfx.save();
        // shift left origin to corner of map, not the left corner of the first sprite
        gfx.translate(-halfTileWidth, 0);
        for (var _i = 0, _a = this._graphics; _i < _a.length; _i++) {
            var graphic = _a[_i];
            graphic.draw(gfx, this.map.graphicsOffset.x, this.map.graphicsOffset.y - (this.map.renderFromTopOfGraphic ? 0 : (graphic.height - this.map.tileHeight)));
        }
        gfx.restore();
    };
    return IsometricTile;
}(Entity_1.Entity));
exports.IsometricTile = IsometricTile;
/**
 * The IsometricMap is a special tile map that provides isometric rendering support to Excalibur
 *
 * The tileWidth and tileHeight should be the height and width in pixels of the parallelogram of the base of the tile art asset.
 * The tileWidth and tileHeight is not necessarily the same as your graphic pixel width and height.
 *
 * Please refer to the docs https://excaliburjs.com for more details calculating what your tile width and height should be given
 * your art assets.
 */
var IsometricMap = /** @class */ (function (_super) {
    __extends(IsometricMap, _super);
    function IsometricMap(options) {
        var _this = _super.call(this, [
            new TransformComponent_1.TransformComponent(),
            new __1.BodyComponent({
                type: __1.CollisionType.Fixed
            }),
            new __1.ColliderComponent(),
            new Graphics_1.DebugGraphicsComponent(function (ctx) { return _this.debug(ctx); }, false)
        ], options.name) || this;
        /**
         * Render the tile graphic from the top instead of the bottom
         *
         * default is `false` meaning rendering from the bottom
         */
        _this.renderFromTopOfGraphic = false;
        _this.graphicsOffset = (0, __1.vec)(0, 0);
        _this._collidersDirty = false;
        _this._originalOffsets = new WeakMap();
        var pos = options.pos, tileWidth = options.tileWidth, tileHeight = options.tileHeight, width = options.columns, height = options.rows, renderFromTopOfGraphic = options.renderFromTopOfGraphic, graphicsOffset = options.graphicsOffset;
        _this.transform = _this.get(TransformComponent_1.TransformComponent);
        if (pos) {
            _this.transform.pos = pos;
        }
        _this.collider = _this.get(__1.ColliderComponent);
        if (_this.collider) {
            _this.collider.set(_this._composite = new __1.CompositeCollider([]));
        }
        _this.renderFromTopOfGraphic = renderFromTopOfGraphic !== null && renderFromTopOfGraphic !== void 0 ? renderFromTopOfGraphic : _this.renderFromTopOfGraphic;
        _this.graphicsOffset = graphicsOffset !== null && graphicsOffset !== void 0 ? graphicsOffset : _this.graphicsOffset;
        _this.tileWidth = tileWidth;
        _this.tileHeight = tileHeight;
        _this.columns = width;
        _this.rows = height;
        _this.tiles = new Array(width * height);
        // build up tile representation
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var tile = new IsometricTile(x, y, _this.graphicsOffset, _this);
                _this.tiles[x + y * width] = tile;
                _this.addChild(tile);
                // TODO row/columns helpers
            }
        }
        return _this;
    }
    IsometricMap.prototype.update = function () {
        if (this._collidersDirty) {
            this.updateColliders();
            this._collidersDirty = false;
        }
    };
    IsometricMap.prototype.flagCollidersDirty = function () {
        this._collidersDirty = true;
    };
    IsometricMap.prototype._getOrSetColliderOriginalOffset = function (collider) {
        if (!this._originalOffsets.has(collider)) {
            var originalOffset = collider.offset;
            this._originalOffsets.set(collider, originalOffset);
            return originalOffset;
        }
        else {
            return this._originalOffsets.get(collider);
        }
    };
    IsometricMap.prototype.updateColliders = function () {
        this._composite.clearColliders();
        var pos = this.get(TransformComponent_1.TransformComponent).pos;
        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            if (tile.solid) {
                for (var _b = 0, _c = tile.getColliders(); _b < _c.length; _b++) {
                    var collider = _c[_b];
                    var originalOffset = this._getOrSetColliderOriginalOffset(collider);
                    collider.offset = this.tileToWorld((0, __1.vec)(tile.x, tile.y))
                        .sub(pos)
                        .add(originalOffset)
                        .sub((0, __1.vec)(this.tileWidth / 2, this.tileHeight)); // We need to unshift height based on drawing
                    collider.owner = this;
                    this._composite.addCollider(collider);
                }
            }
        }
        this.collider.update();
    };
    /**
     * Convert world space coordinates to the tile x, y coordinate
     * @param worldCoordinate
     */
    IsometricMap.prototype.worldToTile = function (worldCoordinate) {
        worldCoordinate = worldCoordinate.sub(this.transform.globalPos);
        var halfTileWidth = this.tileWidth / 2;
        var halfTileHeight = this.tileHeight / 2;
        // See https://clintbellanger.net/articles/isometric_math/ for formula
        return (0, __1.vec)(~~((worldCoordinate.x / halfTileWidth + (worldCoordinate.y / halfTileHeight)) / 2), ~~((worldCoordinate.y / halfTileHeight - (worldCoordinate.x / halfTileWidth)) / 2));
    };
    /**
     * Given a tile coordinate, return the top left corner in world space
     * @param tileCoordinate
     */
    IsometricMap.prototype.tileToWorld = function (tileCoordinate) {
        var halfTileWidth = this.tileWidth / 2;
        var halfTileHeight = this.tileHeight / 2;
        // The x position shifts left with every y step
        var xPos = (tileCoordinate.x - tileCoordinate.y) * halfTileWidth;
        // The y position needs to go down with every x step
        var yPos = (tileCoordinate.x + tileCoordinate.y) * halfTileHeight;
        return (0, __1.vec)(xPos, yPos).add(this.transform.pos);
    };
    /**
     * Returns the [[IsometricTile]] by its x and y coordinates
     */
    IsometricMap.prototype.getTile = function (x, y) {
        if (x < 0 || y < 0 || x >= this.columns || y >= this.rows) {
            return null;
        }
        return this.tiles[x + y * this.columns];
    };
    /**
     * Returns the [[IsometricTile]] by testing a point in world coordinates,
     * returns `null` if no Tile was found.
     */
    IsometricMap.prototype.getTileByPoint = function (point) {
        var tileCoord = this.worldToTile(point);
        var tile = this.getTile(tileCoord.x, tileCoord.y);
        return tile;
    };
    IsometricMap.prototype._getMaxZIndex = function () {
        var maxZ = Number.NEGATIVE_INFINITY;
        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            var currentZ = tile.get(TransformComponent_1.TransformComponent).z;
            if (currentZ > maxZ) {
                maxZ = currentZ;
            }
        }
        return maxZ;
    };
    /**
     * Debug draw for IsometricMap, called internally by excalibur when debug mode is toggled on
     * @param gfx
     */
    IsometricMap.prototype.debug = function (gfx) {
        gfx.save();
        gfx.z = this._getMaxZIndex() + 0.5;
        for (var y = 0; y < this.rows + 1; y++) {
            var left = this.tileToWorld((0, __1.vec)(0, y));
            var right = this.tileToWorld((0, __1.vec)(this.columns, y));
            gfx.drawLine(left, right, __1.Color.Red, 2);
        }
        for (var x = 0; x < this.columns + 1; x++) {
            var top_1 = this.tileToWorld((0, __1.vec)(x, 0));
            var bottom = this.tileToWorld((0, __1.vec)(x, this.rows));
            gfx.drawLine(top_1, bottom, __1.Color.Red, 2);
        }
        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            gfx.drawCircle(this.tileToWorld((0, __1.vec)(tile.x, tile.y)), 3, __1.Color.Yellow);
        }
        gfx.restore();
    };
    return IsometricMap;
}(Entity_1.Entity));
exports.IsometricMap = IsometricMap;
