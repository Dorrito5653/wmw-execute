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
exports.GraphicsComponent = exports.GraphicsLayers = exports.GraphicsLayer = exports.hasGraphicsTick = void 0;
var vector_1 = require("../Math/vector");
var Graphic_1 = require("./Graphic");
var Log_1 = require("../Util/Log");
var Index_1 = require("../Collision/Index");
var Component_1 = require("../EntityComponentSystem/Component");
/**
 * Type guard for checking if a Graphic HasTick (used for graphics that change over time like animations)
 * @param graphic
 */
function hasGraphicsTick(graphic) {
    return !!graphic.tick;
}
exports.hasGraphicsTick = hasGraphicsTick;
var GraphicsLayer = /** @class */ (function () {
    function GraphicsLayer(_options, _graphics) {
        this._options = _options;
        this._graphics = _graphics;
        this.graphics = [];
    }
    Object.defineProperty(GraphicsLayer.prototype, "name", {
        get: function () {
            return this._options.name;
        },
        enumerable: false,
        configurable: true
    });
    GraphicsLayer.prototype.hide = function (nameOrGraphic) {
        if (!nameOrGraphic) {
            this.graphics.length = 0;
        }
        else {
            var gfx_1 = null;
            if (nameOrGraphic instanceof Graphic_1.Graphic) {
                gfx_1 = nameOrGraphic;
            }
            else {
                gfx_1 = this._graphics.getGraphic(nameOrGraphic);
            }
            this.graphics = this.graphics.filter(function (g) { return g.graphic !== gfx_1; });
            this._graphics.recalculateBounds();
        }
    };
    /**
     * Show a graphic by name or instance at an offset, graphics are shown in the order in which `show()` is called.
     *
     * If `show()` is called multiple times for the same graphic it will be shown multiple times.
     * @param nameOrGraphic
     * @param options
     */
    GraphicsLayer.prototype.show = function (nameOrGraphic, options) {
        options = __assign({}, options);
        var gfx;
        if (nameOrGraphic instanceof Graphic_1.Graphic) {
            gfx = this._graphics.copyGraphics ? nameOrGraphic.clone() : nameOrGraphic;
        }
        else {
            gfx = this._graphics.getGraphic(nameOrGraphic);
            if (!gfx) {
                Log_1.Logger.getInstance().error("No such graphic added to component named ".concat(nameOrGraphic, ". These named graphics are available: "), this._graphics.getNames());
            }
        }
        if (gfx) {
            this.graphics.push({ graphic: gfx, options: options });
            this._graphics.recalculateBounds();
            return gfx;
        }
        else {
            return null;
        }
    };
    /**
     * Use a specific graphic, swap out any current graphics being shown
     * @param nameOrGraphic
     * @param options
     */
    GraphicsLayer.prototype.use = function (nameOrGraphic, options) {
        options = __assign({}, options);
        this.hide();
        return this.show(nameOrGraphic, options);
    };
    Object.defineProperty(GraphicsLayer.prototype, "order", {
        /**
         * Current order of the layer, higher numbers are on top, lower numbers are on the bottom.
         *
         * For example a layer with `order = -1` would be under a layer of `order = 1`
         */
        get: function () {
            return this._options.order;
        },
        /**
         * Set the order of the layer, higher numbers are on top, lower numbers are on the bottom.
         *
         * For example a layer with `order = -1` would be under a layer of `order = 1`
         */
        set: function (order) {
            this._options.order = order;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphicsLayer.prototype, "offset", {
        /**
         * Get or set the pixel offset from the layer anchor for all graphics in the layer
         */
        get: function () {
            var _a;
            return (_a = this._options.offset) !== null && _a !== void 0 ? _a : vector_1.Vector.Zero;
        },
        set: function (value) {
            this._options.offset = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphicsLayer.prototype, "currentKeys", {
        get: function () {
            var _a;
            return (_a = this.name) !== null && _a !== void 0 ? _a : 'anonymous';
        },
        enumerable: false,
        configurable: true
    });
    return GraphicsLayer;
}());
exports.GraphicsLayer = GraphicsLayer;
var GraphicsLayers = /** @class */ (function () {
    function GraphicsLayers(_component) {
        this._component = _component;
        this._layers = [];
        this._layerMap = {};
        this["default"] = new GraphicsLayer({ name: 'default', order: 0 }, _component);
        this._maybeAddLayer(this["default"]);
    }
    GraphicsLayers.prototype.create = function (options) {
        var layer = new GraphicsLayer(options, this._component);
        return this._maybeAddLayer(layer);
    };
    GraphicsLayers.prototype.get = function (name) {
        if (name) {
            return this._getLayer(name);
        }
        return this._layers;
    };
    GraphicsLayers.prototype.currentKeys = function () {
        var graphicsLayerKeys = [];
        for (var _i = 0, _a = this._layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            graphicsLayerKeys.push(layer.currentKeys);
        }
        return graphicsLayerKeys;
    };
    GraphicsLayers.prototype.has = function (name) {
        return name in this._layerMap;
    };
    GraphicsLayers.prototype._maybeAddLayer = function (layer) {
        if (this._layerMap[layer.name]) {
            // todo log warning
            return this._layerMap[layer.name];
        }
        this._layerMap[layer.name] = layer;
        this._layers.push(layer);
        this._layers.sort(function (a, b) { return a.order - b.order; });
        return layer;
    };
    GraphicsLayers.prototype._getLayer = function (name) {
        return this._layerMap[name];
    };
    return GraphicsLayers;
}());
exports.GraphicsLayers = GraphicsLayers;
/**
 * Component to manage drawings, using with the position component
 */
var GraphicsComponent = /** @class */ (function (_super) {
    __extends(GraphicsComponent, _super);
    function GraphicsComponent(options) {
        var _this = _super.call(this) || this;
        _this.type = 'ex.graphics';
        _this._graphics = {};
        /**
         * Sets or gets wether any drawing should be visible in this component
         */
        _this.visible = true;
        /**
         * Sets or gets wither all drawings should have an opacity applied
         */
        _this.opacity = 1;
        /**
         * Offset to apply to graphics by default
         */
        _this.offset = vector_1.Vector.Zero;
        /**
         * Anchor to apply to graphics by default
         */
        _this.anchor = vector_1.Vector.Half;
        /**
         * If set to true graphics added to the component will be copied. This can affect performance
         */
        _this.copyGraphics = false;
        _this._localBounds = null;
        // Defaults
        options = __assign({ visible: _this.visible }, options);
        var current = options.current, anchor = options.anchor, opacity = options.opacity, visible = options.visible, graphics = options.graphics, offset = options.offset, copyGraphics = options.copyGraphics, onPreDraw = options.onPreDraw, onPostDraw = options.onPostDraw;
        _this._graphics = graphics || {};
        _this.offset = offset !== null && offset !== void 0 ? offset : _this.offset;
        _this.opacity = opacity !== null && opacity !== void 0 ? opacity : _this.opacity;
        _this.anchor = anchor !== null && anchor !== void 0 ? anchor : _this.anchor;
        _this.copyGraphics = copyGraphics !== null && copyGraphics !== void 0 ? copyGraphics : _this.copyGraphics;
        _this.onPreDraw = onPreDraw !== null && onPreDraw !== void 0 ? onPreDraw : _this.onPreDraw;
        _this.onPostDraw = onPostDraw !== null && onPostDraw !== void 0 ? onPostDraw : _this.onPostDraw;
        _this.visible = !!visible;
        _this.layers = new GraphicsLayers(_this);
        if (current && _this._graphics[current]) {
            _this.show(_this._graphics[current]);
        }
        return _this;
    }
    GraphicsComponent.prototype.getGraphic = function (name) {
        return this._graphics[name];
    };
    /**
     * Get registered graphics names
     */
    GraphicsComponent.prototype.getNames = function () {
        return Object.keys(this._graphics);
    };
    Object.defineProperty(GraphicsComponent.prototype, "current", {
        /**
         * Returns the currently displayed graphics and their offsets, empty array if hidden
         */
        get: function () {
            return this.layers["default"].graphics;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphicsComponent.prototype, "graphics", {
        /**
         * Returns all graphics associated with this component
         */
        get: function () {
            return this._graphics;
        },
        enumerable: false,
        configurable: true
    });
    GraphicsComponent.prototype.add = function (nameOrGraphic, graphic) {
        var name = 'default';
        var graphicToSet = null;
        if (typeof nameOrGraphic === 'string') {
            name = nameOrGraphic;
            graphicToSet = graphic;
        }
        else {
            graphicToSet = nameOrGraphic;
        }
        this._graphics[name] = this.copyGraphics ? graphicToSet.clone() : graphicToSet;
        if (name === 'default') {
            this.show('default');
        }
        return graphicToSet;
    };
    /**
     * Show a graphic by name on the **default** layer, returns the new [[Graphic]]
     */
    GraphicsComponent.prototype.show = function (nameOrGraphic, options) {
        var result = this.layers["default"].show(nameOrGraphic, options);
        this.recalculateBounds();
        return result;
    };
    /**
     * Use a graphic only, swap out any graphics on the **default** layer, returns the new [[Graphic]]
     * @param nameOrGraphic
     * @param options
     */
    GraphicsComponent.prototype.use = function (nameOrGraphic, options) {
        var result = this.layers["default"].use(nameOrGraphic, options);
        this.recalculateBounds();
        return result;
    };
    GraphicsComponent.prototype.hide = function (nameOrGraphic) {
        this.layers["default"].hide(nameOrGraphic);
    };
    Object.defineProperty(GraphicsComponent.prototype, "localBounds", {
        get: function () {
            if (!this._localBounds || this._localBounds.hasZeroDimensions()) {
                this.recalculateBounds();
            }
            return this._localBounds;
        },
        set: function (bounds) {
            this._localBounds = bounds;
        },
        enumerable: false,
        configurable: true
    });
    GraphicsComponent.prototype.recalculateBounds = function () {
        var bb = new Index_1.BoundingBox();
        for (var _i = 0, _a = this.layers.get(); _i < _a.length; _i++) {
            var layer = _a[_i];
            for (var _b = 0, _c = layer.graphics; _b < _c.length; _b++) {
                var _d = _c[_b], graphic = _d.graphic, options = _d.options;
                var anchor = this.anchor;
                var offset = this.offset;
                if (options === null || options === void 0 ? void 0 : options.anchor) {
                    anchor = options.anchor;
                }
                if (options === null || options === void 0 ? void 0 : options.offset) {
                    offset = options.offset;
                }
                var bounds = graphic.localBounds;
                var offsetX = -bounds.width * anchor.x + offset.x;
                var offsetY = -bounds.height * anchor.y + offset.y;
                bb = graphic === null || graphic === void 0 ? void 0 : graphic.localBounds.translate((0, vector_1.vec)(offsetX + layer.offset.x, offsetY + layer.offset.y)).combine(bb);
            }
        }
        this._localBounds = bb;
    };
    /**
     * Update underlying graphics if necesary, called internally
     * @param elapsed
     * @internal
     */
    GraphicsComponent.prototype.update = function (elapsed, idempotencyToken) {
        if (idempotencyToken === void 0) { idempotencyToken = 0; }
        for (var _i = 0, _a = this.layers.get(); _i < _a.length; _i++) {
            var layer = _a[_i];
            for (var _b = 0, _c = layer.graphics; _b < _c.length; _b++) {
                var graphic = _c[_b].graphic;
                if (hasGraphicsTick(graphic)) {
                    graphic === null || graphic === void 0 ? void 0 : graphic.tick(elapsed, idempotencyToken);
                }
            }
        }
    };
    return GraphicsComponent;
}(Component_1.Component));
exports.GraphicsComponent = GraphicsComponent;
