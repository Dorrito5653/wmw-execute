"use strict";
exports.__esModule = true;
exports.PointRenderer = void 0;
var point_vertex_glsl_1 = require("./point-vertex.glsl");
var point_fragment_glsl_1 = require("./point-fragment.glsl");
var ExcaliburGraphicsContextWebGL_1 = require("../ExcaliburGraphicsContextWebGL");
var shader_1 = require("../shader");
var vertex_buffer_1 = require("../vertex-buffer");
var vertex_layout_1 = require("../vertex-layout");
var GraphicsDiagnostics_1 = require("../../GraphicsDiagnostics");
var PointRenderer = /** @class */ (function () {
    function PointRenderer() {
        this.type = 'ex.point';
        this.priority = 0;
        this._maxPoints = 10922;
        this._pointCount = 0;
        this._vertexIndex = 0;
    }
    PointRenderer.prototype.initialize = function (gl, context) {
        this._gl = gl;
        this._context = context;
        this._shader = new shader_1.Shader({
            vertexSource: point_vertex_glsl_1["default"],
            fragmentSource: point_fragment_glsl_1["default"]
        });
        this._shader.compile();
        this._shader.use();
        this._shader.setUniformMatrix('u_matrix', this._context.ortho);
        this._buffer = new vertex_buffer_1.VertexBuffer({
            size: 7 * this._maxPoints,
            type: 'dynamic'
        });
        this._layout = new vertex_layout_1.VertexLayout({
            shader: this._shader,
            vertexBuffer: this._buffer,
            attributes: [
                ['a_position', 2],
                ['a_color', 4],
                ['a_size', 1]
            ]
        });
    };
    PointRenderer.prototype.draw = function (point, color, size) {
        // Force a render if the batch is full
        if (this._isFull()) {
            this.flush();
        }
        this._pointCount++;
        var transform = this._context.getTransform();
        var opacity = this._context.opacity;
        var snapToPixel = this._context.snapToPixel;
        var finalPoint = transform.multiply(point);
        if (snapToPixel) {
            finalPoint.x = ~~(finalPoint.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            finalPoint.y = ~~(finalPoint.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
        }
        var vertexBuffer = this._buffer.bufferData;
        vertexBuffer[this._vertexIndex++] = finalPoint.x;
        vertexBuffer[this._vertexIndex++] = finalPoint.y;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a * opacity;
        vertexBuffer[this._vertexIndex++] = size * Math.max(transform.getScaleX(), transform.getScaleY());
    };
    PointRenderer.prototype._isFull = function () {
        if (this._pointCount >= this._maxPoints) {
            return true;
        }
        return false;
    };
    PointRenderer.prototype.hasPendingDraws = function () {
        return this._pointCount !== 0;
    };
    PointRenderer.prototype.flush = function () {
        // nothing to draw early exit
        if (this._pointCount === 0) {
            return;
        }
        var gl = this._gl;
        this._shader.use();
        this._layout.use(true);
        this._shader.setUniformMatrix('u_matrix', this._context.ortho);
        gl.drawArrays(gl.POINTS, 0, this._pointCount);
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawnImagesCount += this._pointCount;
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawCallCount++;
        this._pointCount = 0;
        this._vertexIndex = 0;
    };
    return PointRenderer;
}());
exports.PointRenderer = PointRenderer;
