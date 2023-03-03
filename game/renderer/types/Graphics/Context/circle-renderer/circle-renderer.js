"use strict";
exports.__esModule = true;
exports.CircleRenderer = void 0;
var Color_1 = require("../../../Color");
var vector_1 = require("../../../Math/vector");
var GraphicsDiagnostics_1 = require("../../GraphicsDiagnostics");
var ExcaliburGraphicsContextWebGL_1 = require("../ExcaliburGraphicsContextWebGL");
var quad_index_buffer_1 = require("../quad-index-buffer");
var shader_1 = require("../shader");
var vertex_buffer_1 = require("../vertex-buffer");
var vertex_layout_1 = require("../vertex-layout");
var circle_renderer_frag_glsl_1 = require("./circle-renderer.frag.glsl");
var circle_renderer_vert_glsl_1 = require("./circle-renderer.vert.glsl");
var CircleRenderer = /** @class */ (function () {
    function CircleRenderer() {
        this.type = 'ex.circle';
        this.priority = 0;
        this._maxCircles = 10922; // max(uint16) / 6 verts
        this._circleCount = 0;
        this._vertexIndex = 0;
    }
    CircleRenderer.prototype.initialize = function (gl, context) {
        this._gl = gl;
        this._context = context;
        this._shader = new shader_1.Shader({
            fragmentSource: circle_renderer_frag_glsl_1["default"],
            vertexSource: circle_renderer_vert_glsl_1["default"]
        });
        this._shader.compile();
        // setup uniforms
        this._shader.use();
        this._shader.setUniformMatrix('u_matrix', context.ortho);
        this._buffer = new vertex_buffer_1.VertexBuffer({
            size: 14 * 4 * this._maxCircles,
            type: 'dynamic'
        });
        this._layout = new vertex_layout_1.VertexLayout({
            shader: this._shader,
            vertexBuffer: this._buffer,
            attributes: [
                ['a_position', 2],
                ['a_uv', 2],
                ['a_opacity', 1],
                ['a_color', 4],
                ['a_strokeColor', 4],
                ['a_strokeThickness', 1]
            ]
        });
        this._quads = new quad_index_buffer_1.QuadIndexBuffer(this._maxCircles, true);
    };
    CircleRenderer.prototype._isFull = function () {
        if (this._circleCount >= this._maxCircles) {
            return true;
        }
        return false;
    };
    CircleRenderer.prototype.draw = function (pos, radius, color, stroke, strokeThickness) {
        if (stroke === void 0) { stroke = Color_1.Color.Transparent; }
        if (strokeThickness === void 0) { strokeThickness = 0; }
        if (this._isFull()) {
            this.flush();
        }
        this._circleCount++;
        // transform based on current context
        var transform = this._context.getTransform();
        var opacity = this._context.opacity;
        var snapToPixel = this._context.snapToPixel;
        var topLeft = transform.multiply(pos.add((0, vector_1.vec)(-radius, -radius)));
        var topRight = transform.multiply(pos.add((0, vector_1.vec)(radius, -radius)));
        var bottomRight = transform.multiply(pos.add((0, vector_1.vec)(radius, radius)));
        var bottomLeft = transform.multiply(pos.add((0, vector_1.vec)(-radius, radius)));
        if (snapToPixel) {
            topLeft.x = ~~(topLeft.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            topLeft.y = ~~(topLeft.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            topRight.x = ~~(topRight.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            topRight.y = ~~(topRight.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            bottomLeft.x = ~~(bottomLeft.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            bottomLeft.y = ~~(bottomLeft.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            bottomRight.x = ~~(bottomRight.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            bottomRight.y = ~~(bottomRight.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
        }
        // TODO UV could be static vertex buffer
        var uvx0 = 0;
        var uvy0 = 0;
        var uvx1 = 1;
        var uvy1 = 1;
        // update data
        var vertexBuffer = this._layout.vertexBuffer.bufferData;
        // (0, 0) - 0
        vertexBuffer[this._vertexIndex++] = topLeft.x;
        vertexBuffer[this._vertexIndex++] = topLeft.y;
        vertexBuffer[this._vertexIndex++] = uvx0;
        vertexBuffer[this._vertexIndex++] = uvy0;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / radius;
        // (0, 1) - 1
        vertexBuffer[this._vertexIndex++] = bottomLeft.x;
        vertexBuffer[this._vertexIndex++] = bottomLeft.y;
        vertexBuffer[this._vertexIndex++] = uvx0;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / radius;
        // (1, 0) - 2
        vertexBuffer[this._vertexIndex++] = topRight.x;
        vertexBuffer[this._vertexIndex++] = topRight.y;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy0;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / radius;
        // (1, 1) - 3
        vertexBuffer[this._vertexIndex++] = bottomRight.x;
        vertexBuffer[this._vertexIndex++] = bottomRight.y;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / radius;
    };
    CircleRenderer.prototype.hasPendingDraws = function () {
        return this._circleCount !== 0;
    };
    CircleRenderer.prototype.flush = function () {
        // nothing to draw early exit
        if (this._circleCount === 0) {
            return;
        }
        var gl = this._gl;
        // Bind the shader
        this._shader.use();
        // Bind the memory layout and upload data
        this._layout.use(true);
        // Update ortho matrix uniform
        this._shader.setUniformMatrix('u_matrix', this._context.ortho);
        // Bind index buffer
        this._quads.bind();
        // Draw all the quads
        gl.drawElements(gl.TRIANGLES, this._circleCount * 6, this._quads.bufferGlType, 0);
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawnImagesCount += this._circleCount;
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawCallCount++;
        // Reset
        this._circleCount = 0;
        this._vertexIndex = 0;
    };
    return CircleRenderer;
}());
exports.CircleRenderer = CircleRenderer;
