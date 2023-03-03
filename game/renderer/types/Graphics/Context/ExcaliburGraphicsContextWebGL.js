"use strict";
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
exports.ExcaliburGraphicsContextWebGL = exports.pixelSnapEpsilon = void 0;
var matrix_1 = require("../../Math/matrix");
var transform_stack_1 = require("./transform-stack");
var vector_1 = require("../../Math/vector");
var Color_1 = require("../../Color");
var state_stack_1 = require("./state-stack");
var Log_1 = require("../../Util/Log");
var debug_text_1 = require("./debug-text");
var render_target_1 = require("./render-target");
var webgl_adapter_1 = require("./webgl-adapter");
var texture_loader_1 = require("./texture-loader");
// renderers
var line_renderer_1 = require("./line-renderer/line-renderer");
var point_renderer_1 = require("./point-renderer/point-renderer");
var screen_pass_painter_1 = require("./screen-pass-painter/screen-pass-painter");
var image_renderer_1 = require("./image-renderer/image-renderer");
var rectangle_renderer_1 = require("./rectangle-renderer/rectangle-renderer");
var circle_renderer_1 = require("./circle-renderer/circle-renderer");
var Pool_1 = require("../../Util/Pool");
var draw_call_1 = require("./draw-call");
var affine_matrix_1 = require("../../Math/affine-matrix");
exports.pixelSnapEpsilon = 0.0001;
var ExcaliburGraphicsContextWebGLDebug = /** @class */ (function () {
    function ExcaliburGraphicsContextWebGLDebug(_webglCtx) {
        this._webglCtx = _webglCtx;
        this._debugText = new debug_text_1.DebugText();
    }
    /**
     * Draw a debugging rectangle to the context
     * @param x
     * @param y
     * @param width
     * @param height
     */
    ExcaliburGraphicsContextWebGLDebug.prototype.drawRect = function (x, y, width, height, rectOptions) {
        if (rectOptions === void 0) { rectOptions = { color: Color_1.Color.Black }; }
        this.drawLine((0, vector_1.vec)(x, y), (0, vector_1.vec)(x + width, y), __assign({}, rectOptions));
        this.drawLine((0, vector_1.vec)(x + width, y), (0, vector_1.vec)(x + width, y + height), __assign({}, rectOptions));
        this.drawLine((0, vector_1.vec)(x + width, y + height), (0, vector_1.vec)(x, y + height), __assign({}, rectOptions));
        this.drawLine((0, vector_1.vec)(x, y + height), (0, vector_1.vec)(x, y), __assign({}, rectOptions));
    };
    /**
     * Draw a debugging line to the context
     * @param start
     * @param end
     * @param lineOptions
     */
    ExcaliburGraphicsContextWebGLDebug.prototype.drawLine = function (start, end, lineOptions) {
        if (lineOptions === void 0) { lineOptions = { color: Color_1.Color.Black }; }
        this._webglCtx.draw('ex.line', start, end, lineOptions.color);
    };
    /**
     * Draw a debugging point to the context
     * @param point
     * @param pointOptions
     */
    ExcaliburGraphicsContextWebGLDebug.prototype.drawPoint = function (point, pointOptions) {
        if (pointOptions === void 0) { pointOptions = { color: Color_1.Color.Black, size: 5 }; }
        this._webglCtx.draw('ex.point', point, pointOptions.color, pointOptions.size);
    };
    ExcaliburGraphicsContextWebGLDebug.prototype.drawText = function (text, pos) {
        this._debugText.write(this._webglCtx, text, pos);
    };
    return ExcaliburGraphicsContextWebGLDebug;
}());
var ExcaliburGraphicsContextWebGL = /** @class */ (function () {
    function ExcaliburGraphicsContextWebGL(options) {
        this._logger = Log_1.Logger.getInstance();
        this._renderers = new Map();
        this._isDrawLifecycle = false;
        this.useDrawSorting = true;
        this._drawCallPool = new Pool_1.Pool(function () { return new draw_call_1.DrawCall(); }, function (instance) {
            instance.priority = 0;
            instance.z = 0;
            instance.renderer = undefined;
            instance.args = undefined;
            return instance;
        }, 4000);
        this._drawCalls = [];
        // Postprocessing is a tuple with 2 render targets, these are flip-flopped during the postprocessing process
        this._postProcessTargets = [];
        this._postprocessors = [];
        this._transform = new transform_stack_1.TransformStack();
        this._state = new state_stack_1.StateStack();
        this.snapToPixel = false;
        this.smoothing = false;
        this.backgroundColor = Color_1.Color.ExcaliburBlue;
        this._alreadyWarnedDrawLifecycle = false;
        this.debug = new ExcaliburGraphicsContextWebGLDebug(this);
        var canvasElement = options.canvasElement, enableTransparency = options.enableTransparency, smoothing = options.smoothing, snapToPixel = options.snapToPixel, backgroundColor = options.backgroundColor, useDrawSorting = options.useDrawSorting;
        this.__gl = canvasElement.getContext('webgl2', {
            antialias: smoothing !== null && smoothing !== void 0 ? smoothing : this.smoothing,
            premultipliedAlpha: false,
            alpha: enableTransparency !== null && enableTransparency !== void 0 ? enableTransparency : true,
            depth: true,
            powerPreference: 'high-performance'
            // TODO Chromium fixed the bug where this didn't work now it breaks CI :(
            // failIfMajorPerformanceCaveat: true
        });
        if (!this.__gl) {
            throw Error('Failed to retrieve webgl context from browser');
        }
        webgl_adapter_1.ExcaliburWebGLContextAccessor.register(this.__gl);
        texture_loader_1.TextureLoader.register(this.__gl);
        this.snapToPixel = snapToPixel !== null && snapToPixel !== void 0 ? snapToPixel : this.snapToPixel;
        this.smoothing = smoothing !== null && smoothing !== void 0 ? smoothing : this.smoothing;
        this.backgroundColor = backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : this.backgroundColor;
        this.useDrawSorting = useDrawSorting !== null && useDrawSorting !== void 0 ? useDrawSorting : this.useDrawSorting;
        this._drawCallPool.disableWarnings = true;
        this._drawCallPool.preallocate();
        this._init();
    }
    Object.defineProperty(ExcaliburGraphicsContextWebGL.prototype, "z", {
        get: function () {
            return this._state.current.z;
        },
        set: function (value) {
            this._state.current.z = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContextWebGL.prototype, "opacity", {
        get: function () {
            return this._state.current.opacity;
        },
        set: function (value) {
            this._state.current.opacity = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContextWebGL.prototype, "tint", {
        get: function () {
            return this._state.current.tint;
        },
        set: function (color) {
            this._state.current.tint = color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContextWebGL.prototype, "width", {
        get: function () {
            return this.__gl.canvas.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContextWebGL.prototype, "height", {
        get: function () {
            return this.__gl.canvas.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExcaliburGraphicsContextWebGL.prototype, "ortho", {
        get: function () {
            return this._ortho;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Checks the underlying webgl implementation if the requested internal resolution is supported
     * @param dim
     */
    ExcaliburGraphicsContextWebGL.prototype.checkIfResolutionSupported = function (dim) {
        // Slight hack based on this thread https://groups.google.com/g/webgl-dev-list/c/AHONvz3oQTo
        var supported = true;
        if (dim.width > 4096 || dim.height > 4096) {
            supported = false;
        }
        return supported;
    };
    ExcaliburGraphicsContextWebGL.prototype._init = function () {
        var gl = this.__gl;
        // Setup viewport and view matrix
        this._ortho = matrix_1.Matrix.ortho(0, gl.canvas.width, gl.canvas.height, 0, 400, -400);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // Clear background
        gl.clearColor(this.backgroundColor.r / 255, this.backgroundColor.g / 255, this.backgroundColor.b / 255, this.backgroundColor.a);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Enable alpha blending
        // https://www.realtimerendering.com/blog/gpus-prefer-premultiplication/
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        // Setup builtin renderers
        this.register(new image_renderer_1.ImageRenderer());
        this.register(new rectangle_renderer_1.RectangleRenderer());
        this.register(new circle_renderer_1.CircleRenderer());
        this.register(new point_renderer_1.PointRenderer());
        this.register(new line_renderer_1.LineRenderer());
        this._screenRenderer = new screen_pass_painter_1.ScreenPassPainter(gl);
        this._renderTarget = new render_target_1.RenderTarget({
            gl: gl,
            width: gl.canvas.width,
            height: gl.canvas.height
        });
        this._postProcessTargets = [
            new render_target_1.RenderTarget({
                gl: gl,
                width: gl.canvas.width,
                height: gl.canvas.height
            }),
            new render_target_1.RenderTarget({
                gl: gl,
                width: gl.canvas.width,
                height: gl.canvas.height
            })
        ];
    };
    ExcaliburGraphicsContextWebGL.prototype.register = function (renderer) {
        this._renderers.set(renderer.type, renderer);
        renderer.initialize(this.__gl, this);
    };
    ExcaliburGraphicsContextWebGL.prototype.get = function (rendererName) {
        return this._renderers.get(rendererName);
    };
    ExcaliburGraphicsContextWebGL.prototype._isCurrentRenderer = function (renderer) {
        if (!this._currentRenderer || this._currentRenderer === renderer) {
            return true;
        }
        return false;
    };
    ExcaliburGraphicsContextWebGL.prototype.beginDrawLifecycle = function () {
        this._isDrawLifecycle = true;
    };
    ExcaliburGraphicsContextWebGL.prototype.endDrawLifecycle = function () {
        this._isDrawLifecycle = false;
    };
    ExcaliburGraphicsContextWebGL.prototype.draw = function (rendererName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this._isDrawLifecycle && !this._alreadyWarnedDrawLifecycle) {
            this._logger.warn("Attempting to draw outside the the drawing lifecycle (preDraw/postDraw) is not supported and is a source of bugs/errors.\n" +
                "If you want to do custom drawing, use Actor.graphics, or any onPreDraw or onPostDraw handler.");
            this._alreadyWarnedDrawLifecycle = true;
        }
        var renderer = this._renderers.get(rendererName);
        if (renderer) {
            if (this.useDrawSorting) {
                var drawCall = this._drawCallPool.get();
                drawCall.z = this._state.current.z;
                drawCall.priority = renderer.priority;
                drawCall.renderer = rendererName;
                this.getTransform().clone(drawCall.transform);
                drawCall.state.z = this._state.current.z;
                drawCall.state.opacity = this._state.current.opacity;
                drawCall.state.tint = this._state.current.tint;
                drawCall.args = args;
                this._drawCalls.push(drawCall);
            }
            else {
                // Set the current renderer if not defined
                if (!this._currentRenderer) {
                    this._currentRenderer = renderer;
                }
                if (!this._isCurrentRenderer(renderer)) {
                    // switching graphics means we must flush the previous
                    this._currentRenderer.flush();
                }
                // If we are still using the same renderer we can add to the current batch
                renderer.draw.apply(renderer, args);
                this._currentRenderer = renderer;
            }
        }
        else {
            throw Error("No renderer with name ".concat(rendererName, " has been registered"));
        }
    };
    ExcaliburGraphicsContextWebGL.prototype.resetTransform = function () {
        this._transform.current = affine_matrix_1.AffineMatrix.identity();
    };
    ExcaliburGraphicsContextWebGL.prototype.updateViewport = function (resolution) {
        var gl = this.__gl;
        this._ortho = this._ortho = matrix_1.Matrix.ortho(0, resolution.width, resolution.height, 0, 400, -400);
        this._renderTarget.setResolution(gl.canvas.width, gl.canvas.height);
        this._postProcessTargets[0].setResolution(gl.canvas.width, gl.canvas.height);
        this._postProcessTargets[1].setResolution(gl.canvas.width, gl.canvas.height);
    };
    ExcaliburGraphicsContextWebGL.prototype.drawImage = function (image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        if (swidth === 0 || sheight === 0) {
            return; // zero dimension dest exit early
        }
        else if (dwidth === 0 || dheight === 0) {
            return; // zero dimension dest exit early
        }
        else if (image.width === 0 || image.height === 0) {
            return; // zero dimension source exit early
        }
        if (!image) {
            Log_1.Logger.getInstance().warn('Cannot draw a null or undefined image');
            // tslint:disable-next-line: no-console
            if (console.trace) {
                // tslint:disable-next-line: no-console
                console.trace();
            }
            return;
        }
        this.draw('ex.image', image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);
    };
    ExcaliburGraphicsContextWebGL.prototype.drawLine = function (start, end, color, thickness) {
        if (thickness === void 0) { thickness = 1; }
        this.draw('ex.rectangle', start, end, color, thickness);
    };
    ExcaliburGraphicsContextWebGL.prototype.drawRectangle = function (pos, width, height, color, stroke, strokeThickness) {
        this.draw('ex.rectangle', pos, width, height, color, stroke, strokeThickness);
    };
    ExcaliburGraphicsContextWebGL.prototype.drawCircle = function (pos, radius, color, stroke, thickness) {
        this.draw('ex.circle', pos, radius, color, stroke, thickness);
    };
    ExcaliburGraphicsContextWebGL.prototype.save = function () {
        this._transform.save();
        this._state.save();
    };
    ExcaliburGraphicsContextWebGL.prototype.restore = function () {
        this._transform.restore();
        this._state.restore();
    };
    ExcaliburGraphicsContextWebGL.prototype.translate = function (x, y) {
        this._transform.translate(this.snapToPixel ? ~~(x + exports.pixelSnapEpsilon) : x, this.snapToPixel ? ~~(y + exports.pixelSnapEpsilon) : y);
    };
    ExcaliburGraphicsContextWebGL.prototype.rotate = function (angle) {
        this._transform.rotate(angle);
    };
    ExcaliburGraphicsContextWebGL.prototype.scale = function (x, y) {
        this._transform.scale(x, y);
    };
    ExcaliburGraphicsContextWebGL.prototype.transform = function (matrix) {
        this._transform.current = matrix;
    };
    ExcaliburGraphicsContextWebGL.prototype.getTransform = function () {
        return this._transform.current;
    };
    ExcaliburGraphicsContextWebGL.prototype.multiply = function (m) {
        this._transform.current.multiply(m, this._transform.current);
    };
    ExcaliburGraphicsContextWebGL.prototype.addPostProcessor = function (postprocessor) {
        this._postprocessors.push(postprocessor);
        postprocessor.initialize(this.__gl);
    };
    ExcaliburGraphicsContextWebGL.prototype.removePostProcessor = function (postprocessor) {
        var index = this._postprocessors.indexOf(postprocessor);
        if (index !== -1) {
            this._postprocessors.splice(index, 1);
        }
    };
    ExcaliburGraphicsContextWebGL.prototype.clearPostProcessors = function () {
        this._postprocessors.length = 0;
    };
    ExcaliburGraphicsContextWebGL.prototype.clear = function () {
        var gl = this.__gl;
        this._renderTarget.use();
        gl.clearColor(this.backgroundColor.r / 255, this.backgroundColor.g / 255, this.backgroundColor.b / 255, this.backgroundColor.a);
        // Clear the context with the newly set color. This is
        // the function call that actually does the drawing.
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    /**
     * Flushes all batched rendering to the screen
     */
    ExcaliburGraphicsContextWebGL.prototype.flush = function () {
        var gl = this.__gl;
        // render target captures all draws and redirects to the render target
        this._renderTarget.use();
        if (this.useDrawSorting) {
            // sort draw calls
            // Find the original order of the first instance of the draw call
            var originalSort_1 = new Map();
            var _loop_1 = function (name_1) {
                var firstIndex = this_1._drawCalls.findIndex(function (dc) { return dc.renderer === name_1; });
                originalSort_1.set(name_1, firstIndex);
            };
            var this_1 = this;
            for (var _i = 0, _a = this._renderers; _i < _a.length; _i++) {
                var name_1 = _a[_i][0];
                _loop_1(name_1);
            }
            this._drawCalls.sort(function (a, b) {
                var zIndex = a.z - b.z;
                var originalSortOrder = originalSort_1.get(a.renderer) - originalSort_1.get(b.renderer);
                var priority = a.priority - b.priority;
                if (zIndex === 0) { // sort by z first
                    if (priority === 0) { // sort by priority
                        return originalSortOrder; // use the original order to inform draw call packing to maximally preserve painter order
                    }
                    return priority;
                }
                return zIndex;
            });
            var oldTransform = this._transform.current;
            var oldState = this._state.current;
            if (this._drawCalls.length) {
                var currentRendererName = this._drawCalls[0].renderer;
                var currentRenderer = this._renderers.get(currentRendererName);
                for (var i = 0; i < this._drawCalls.length; i++) {
                    // hydrate the state for renderers
                    this._transform.current = this._drawCalls[i].transform;
                    this._state.current = this._drawCalls[i].state;
                    if (this._drawCalls[i].renderer !== currentRendererName) {
                        // switching graphics renderer means we must flush the previous
                        currentRenderer.flush();
                        currentRendererName = this._drawCalls[i].renderer;
                        currentRenderer = this._renderers.get(currentRendererName);
                    }
                    // If we are still using the same renderer we can add to the current batch
                    currentRenderer.draw.apply(currentRenderer, this._drawCalls[i].args);
                }
                if (currentRenderer.hasPendingDraws()) {
                    currentRenderer.flush();
                }
            }
            // reset state
            this._transform.current = oldTransform;
            this._state.current = oldState;
            // reclaim draw calls
            this._drawCallPool.done();
            this._drawCalls.length = 0;
        }
        else {
            // This is the final flush at the moment to draw any leftover pending draw
            for (var _b = 0, _c = this._renderers.values(); _b < _c.length; _b++) {
                var renderer = _c[_b];
                if (renderer.hasPendingDraws()) {
                    renderer.flush();
                }
            }
        }
        this._renderTarget.disable();
        // post process step
        var source = this._renderTarget.toRenderSource();
        source.use();
        // flip flop render targets
        for (var i = 0; i < this._postprocessors.length; i++) {
            this._postProcessTargets[i % 2].use();
            this._screenRenderer.renderWithPostProcessor(this._postprocessors[i]);
            this._postProcessTargets[i % 2].toRenderSource().use();
        }
        // passing null switches rendering back to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this._screenRenderer.renderToScreen();
    };
    return ExcaliburGraphicsContextWebGL;
}());
exports.ExcaliburGraphicsContextWebGL = ExcaliburGraphicsContextWebGL;
