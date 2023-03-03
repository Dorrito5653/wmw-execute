"use strict";
exports.__esModule = true;
exports.ExcaliburGraphicsContext2DCanvas = void 0;
var Color_1 = require("../../Color");
var state_stack_1 = require("./state-stack");
var GraphicsDiagnostics_1 = require("../GraphicsDiagnostics");
var debug_text_1 = require("./debug-text");
var pixelSnapEpsilon = 0.0001;
var ExcaliburGraphicsContext2DCanvasDebug = /** @class */ (function () {
    function ExcaliburGraphicsContext2DCanvasDebug(_ex) {
        this._ex = _ex;
        this._debugText = new debug_text_1.DebugText();
    }
    /**
     * Draw a debug rectangle to the context
     * @param x
     * @param y
     * @param width
     * @param height
     */
    ExcaliburGraphicsContext2DCanvasDebug.prototype.drawRect = function (x, y, width, height) {
        this._ex.__ctx.save();
        this._ex.__ctx.strokeStyle = 'red';
        this._ex.__ctx.strokeRect(this._ex.snapToPixel ? ~~(x + pixelSnapEpsilon) : x, this._ex.snapToPixel ? ~~(y + pixelSnapEpsilon) : y, this._ex.snapToPixel ? ~~(width + pixelSnapEpsilon) : width, this._ex.snapToPixel ? ~~(height + pixelSnapEpsilon) : height);
        this._ex.__ctx.restore();
    };
    ExcaliburGraphicsContext2DCanvasDebug.prototype.drawLine = function (start, end, lineOptions) {
        if (lineOptions === void 0) { lineOptions = { color: Color_1.Color.Black }; }
        this._ex.__ctx.save();
        this._ex.__ctx.beginPath();
        this._ex.__ctx.strokeStyle = lineOptions.color.toString();
        this._ex.__ctx.moveTo(this._ex.snapToPixel ? ~~(start.x + pixelSnapEpsilon) : start.x, this._ex.snapToPixel ? ~~(start.y + pixelSnapEpsilon) : start.y);
        this._ex.__ctx.lineTo(this._ex.snapToPixel ? ~~(end.x + pixelSnapEpsilon) : end.x, this._ex.snapToPixel ? ~~(end.y + pixelSnapEpsilon) : end.y);
        this._ex.__ctx.lineWidth = 2;
        this._ex.__ctx.stroke();
        this._ex.__ctx.closePath();
        this._ex.__ctx.restore();
    };
    ExcaliburGraphicsContext2DCanvasDebug.prototype.drawPoint = function (point, pointOptions) {
        if (pointOptions === void 0) { pointOptions = { color: Color_1.Color.Black, size: 5 }; }
        this._ex.__ctx.save();
        this._ex.__ctx.beginPath();
        this._ex.__ctx.fillStyle = pointOptions.color.toString();
        this._ex.__ctx.arc(this._ex.snapToPixel ? ~~(point.x + pixelSnapEpsilon) : point.x, this._ex.snapToPixel ? ~~(point.y + pixelSnapEpsilon) : point.y, pointOptions.size, 0, Math.PI * 2);
        this._ex.__ctx.fill();
        this._ex.__ctx.closePath();
        this._ex.__ctx.restore();
    };
    ExcaliburGraphicsContext2DCanvasDebug.prototype.drawText = function (text, pos) {
        this._debugText.write(this._ex, text, pos);
    };
    return ExcaliburGraphicsContext2DCanvasDebug;
}());
var ExcaliburGraphicsContext2DCanvas = /** @class */ (function () {
    function ExcaliburGraphicsContext2DCanvas(options) {
        /**
         * Unused in Canvas implementation
         */
        this.useDrawSorting = false;
        /**
         * Unused in Canvas implementation
         */
        this.z = 0;
        this.backgroundColor = Color_1.Color.ExcaliburBlue;
        this._state = new state_stack_1.StateStack();
        this.snapToPixel = false;
        this.debug = new ExcaliburGraphicsContext2DCanvasDebug(this);
        var canvasElement = options.canvasElement, enableTransparency = options.enableTransparency, snapToPixel = options.snapToPixel, smoothing = options.smoothing, backgroundColor = options.backgroundColor;
        this.__ctx = canvasElement.getContext('2d', {
            alpha: enableTransparency !== null && enableTransparency !== void 0 ? enableTransparency : true
        });
        this.backgroundColor = backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : this.backgroundColor;
        this.snapToPixel = snapToPixel !== null && snapToPixel !== void 0 ? snapToPixel : this.snapToPixel;
        this.smoothing = smoothing !== null && smoothing !== void 0 ? smoothing : this.smoothing;
    }
    Object.defineProperty(ExcaliburGraphicsContext2DCanvas.prototype, "width", {
        get: function () {
            return this.__ctx.canvas.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContext2DCanvas.prototype, "height", {
        get: function () {
            return this.__ctx.canvas.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContext2DCanvas.prototype, "opacity", {
        get: function () {
            return this._state.current.opacity;
        },
        set: function (value) {
            this._state.current.opacity = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContext2DCanvas.prototype, "tint", {
        get: function () {
            return this._state.current.tint;
        },
        set: function (color) {
            this._state.current.tint = color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContext2DCanvas.prototype, "smoothing", {
        get: function () {
            return this.__ctx.imageSmoothingEnabled;
        },
        set: function (value) {
            this.__ctx.imageSmoothingEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    ExcaliburGraphicsContext2DCanvas.prototype.resetTransform = function () {
        this.__ctx.resetTransform();
    };
    ExcaliburGraphicsContext2DCanvas.prototype.updateViewport = function (_resolution) {
        // pass
    };
    ExcaliburGraphicsContext2DCanvas.prototype.drawImage = function (image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        var _this = this;
        if (swidth === 0 || sheight === 0) {
            return; // zero dimension dest exit early
        }
        else if (dwidth === 0 || dheight === 0) {
            return; // zero dimension dest exit early
        }
        else if (image.width === 0 || image.height === 0) {
            return; // zero dimension source exit early
        }
        this.__ctx.globalAlpha = this.opacity;
        var args = [image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight]
            .filter(function (a) { return a !== undefined; })
            .map(function (a) { return (typeof a === 'number' && _this.snapToPixel ? ~~a : a); });
        this.__ctx.drawImage.apply(this.__ctx, args);
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawCallCount++;
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawnImagesCount = 1;
    };
    ExcaliburGraphicsContext2DCanvas.prototype.drawLine = function (start, end, color, thickness) {
        if (thickness === void 0) { thickness = 1; }
        this.__ctx.save();
        this.__ctx.beginPath();
        this.__ctx.strokeStyle = color.toString();
        this.__ctx.moveTo(this.snapToPixel ? ~~(start.x + pixelSnapEpsilon) : start.x, this.snapToPixel ? ~~(start.y + pixelSnapEpsilon) : start.y);
        this.__ctx.lineTo(this.snapToPixel ? ~~(end.x + pixelSnapEpsilon) : end.x, this.snapToPixel ? ~~(end.y + pixelSnapEpsilon) : end.y);
        this.__ctx.lineWidth = thickness;
        this.__ctx.stroke();
        this.__ctx.closePath();
        this.__ctx.restore();
    };
    ExcaliburGraphicsContext2DCanvas.prototype.drawRectangle = function (pos, width, height, color) {
        this.__ctx.save();
        this.__ctx.fillStyle = color.toString();
        this.__ctx.fillRect(this.snapToPixel ? ~~(pos.x + pixelSnapEpsilon) : pos.x, this.snapToPixel ? ~~(pos.y + pixelSnapEpsilon) : pos.y, this.snapToPixel ? ~~(width + pixelSnapEpsilon) : width, this.snapToPixel ? ~~(height + pixelSnapEpsilon) : height);
        this.__ctx.restore();
    };
    ExcaliburGraphicsContext2DCanvas.prototype.drawCircle = function (pos, radius, color, stroke, thickness) {
        this.__ctx.save();
        this.__ctx.beginPath();
        if (stroke) {
            this.__ctx.strokeStyle = stroke.toString();
        }
        if (thickness) {
            this.__ctx.lineWidth = thickness;
        }
        this.__ctx.fillStyle = color.toString();
        this.__ctx.arc(this.snapToPixel ? ~~(pos.x + pixelSnapEpsilon) : pos.x, this.snapToPixel ? ~~(pos.y + pixelSnapEpsilon) : pos.y, radius, 0, Math.PI * 2);
        this.__ctx.fill();
        if (stroke) {
            this.__ctx.stroke();
        }
        this.__ctx.closePath();
        this.__ctx.restore();
    };
    /**
     * Save the current state of the canvas to the stack (transforms and opacity)
     */
    ExcaliburGraphicsContext2DCanvas.prototype.save = function () {
        this.__ctx.save();
    };
    /**
     * Restore the state of the canvas from the stack
     */
    ExcaliburGraphicsContext2DCanvas.prototype.restore = function () {
        this.__ctx.restore();
    };
    /**
     * Translate the origin of the context by an x and y
     * @param x
     * @param y
     */
    ExcaliburGraphicsContext2DCanvas.prototype.translate = function (x, y) {
        this.__ctx.translate(this.snapToPixel ? ~~(x + pixelSnapEpsilon) : x, this.snapToPixel ? ~~(y + pixelSnapEpsilon) : y);
    };
    /**
     * Rotate the context about the current origin
     */
    ExcaliburGraphicsContext2DCanvas.prototype.rotate = function (angle) {
        this.__ctx.rotate(angle);
    };
    /**
     * Scale the context by an x and y factor
     * @param x
     * @param y
     */
    ExcaliburGraphicsContext2DCanvas.prototype.scale = function (x, y) {
        this.__ctx.scale(x, y);
    };
    ExcaliburGraphicsContext2DCanvas.prototype.getTransform = function () {
        throw new Error('Not implemented');
    };
    ExcaliburGraphicsContext2DCanvas.prototype.multiply = function (_m) {
        this.__ctx.setTransform(this.__ctx.getTransform().multiply(_m.toDOMMatrix()));
    };
    ExcaliburGraphicsContext2DCanvas.prototype.addPostProcessor = function (_postprocessor) {
        // pass
    };
    ExcaliburGraphicsContext2DCanvas.prototype.removePostProcessor = function (_postprocessor) {
        // pass
    };
    ExcaliburGraphicsContext2DCanvas.prototype.clearPostProcessors = function () {
        // pass
    };
    ExcaliburGraphicsContext2DCanvas.prototype.beginDrawLifecycle = function () {
        // pass
    };
    ExcaliburGraphicsContext2DCanvas.prototype.endDrawLifecycle = function () {
        // pass
    };
    ExcaliburGraphicsContext2DCanvas.prototype.clear = function () {
        // Clear frame
        this.__ctx.clearRect(0, 0, this.width, this.height);
        this.__ctx.fillStyle = this.backgroundColor.toString();
        this.__ctx.fillRect(0, 0, this.width, this.height);
        GraphicsDiagnostics_1.GraphicsDiagnostics.clear();
    };
    /**
     * Flushes the batched draw calls to the screen
     */
    ExcaliburGraphicsContext2DCanvas.prototype.flush = function () {
        // pass
    };
    return ExcaliburGraphicsContext2DCanvas;
}());
exports.ExcaliburGraphicsContext2DCanvas = ExcaliburGraphicsContext2DCanvas;
