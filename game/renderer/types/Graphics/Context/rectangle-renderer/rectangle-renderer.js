"use strict";
exports.__esModule = true;
exports.RectangleRenderer = void 0;
var Color_1 = require("../../../Color");
var vector_1 = require("../../../Math/vector");
var GraphicsDiagnostics_1 = require("../../GraphicsDiagnostics");
var ExcaliburGraphicsContextWebGL_1 = require("../ExcaliburGraphicsContextWebGL");
var quad_index_buffer_1 = require("../quad-index-buffer");
var shader_1 = require("../shader");
var vertex_buffer_1 = require("../vertex-buffer");
var vertex_layout_1 = require("../vertex-layout");
var rectangle_renderer_frag_glsl_1 = require("./rectangle-renderer.frag.glsl");
var rectangle_renderer_vert_glsl_1 = require("./rectangle-renderer.vert.glsl");
var RectangleRenderer = /** @class */ (function () {
    function RectangleRenderer() {
        this.type = 'ex.rectangle';
        this.priority = 0;
        this._maxRectangles = 10922; // max(uint16) / 6 verts
        this._rectangleCount = 0;
        this._vertexIndex = 0;
    }
    RectangleRenderer.prototype.initialize = function (gl, context) {
        this._gl = gl;
        this._context = context;
        // https://stackoverflow.com/questions/59197671/glsl-rounded-rectangle-with-variable-border
        this._shader = new shader_1.Shader({
            fragmentSource: rectangle_renderer_frag_glsl_1["default"],
            vertexSource: rectangle_renderer_vert_glsl_1["default"]
        });
        this._shader.compile();
        // setup uniforms
        this._shader.use();
        this._shader.setUniformMatrix('u_matrix', context.ortho);
        this._buffer = new vertex_buffer_1.VertexBuffer({
            size: 16 * 4 * this._maxRectangles,
            type: 'dynamic'
        });
        this._layout = new vertex_layout_1.VertexLayout({
            shader: this._shader,
            vertexBuffer: this._buffer,
            attributes: [
                ['a_position', 2],
                ['a_uv', 2],
                ['a_size', 2],
                ['a_opacity', 1],
                ['a_color', 4],
                ['a_strokeColor', 4],
                ['a_strokeThickness', 1]
            ]
        });
        this._quads = new quad_index_buffer_1.QuadIndexBuffer(this._maxRectangles, true);
    };
    RectangleRenderer.prototype._isFull = function () {
        if (this._rectangleCount >= this._maxRectangles) {
            return true;
        }
        return false;
    };
    RectangleRenderer.prototype.draw = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof vector_1.Vector && args[1] instanceof vector_1.Vector) {
            this.drawLine.apply(this, args);
        }
        else {
            this.drawRectangle.apply(this, args);
        }
    };
    RectangleRenderer.prototype.drawLine = function (start, end, color, thickness) {
        if (thickness === void 0) { thickness = 1; }
        if (this._isFull()) {
            this.flush();
        }
        this._rectangleCount++;
        // transform based on current context
        var transform = this._context.getTransform();
        var opacity = this._context.opacity;
        var snapToPixel = this._context.snapToPixel;
        var dir = end.sub(start);
        var length = dir.size;
        var normal = dir.normalize().perpendicular();
        var halfThick = thickness / 2;
        /**
         *    +---------------------^----------------------+
         *    |                     | (normal)             |
         *   (startx, starty)------------------>(endx, endy)
         *    |                                            |
         *    + -------------------------------------------+
         */
        var startTop = transform.multiply(normal.scale(halfThick).add(start));
        var startBottom = transform.multiply(normal.scale(-halfThick).add(start));
        var endTop = transform.multiply(normal.scale(halfThick).add(end));
        var endBottom = transform.multiply(normal.scale(-halfThick).add(end));
        if (snapToPixel) {
            startTop.x = ~~(startTop.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            startTop.y = ~~(startTop.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            endTop.x = ~~(endTop.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            endTop.y = ~~(endTop.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            startBottom.x = ~~(startBottom.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            startBottom.y = ~~(startBottom.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            endBottom.x = ~~(endBottom.x + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
            endBottom.y = ~~(endBottom.y + ExcaliburGraphicsContextWebGL_1.pixelSnapEpsilon);
        }
        // TODO uv could be static vertex buffer
        var uvx0 = 0;
        var uvy0 = 0;
        var uvx1 = 1;
        var uvy1 = 1;
        var stroke = Color_1.Color.Transparent;
        var strokeThickness = 0;
        var width = 1;
        // update data
        var vertexBuffer = this._layout.vertexBuffer.bufferData;
        // (0, 0) - 0
        vertexBuffer[this._vertexIndex++] = startTop.x;
        vertexBuffer[this._vertexIndex++] = startTop.y;
        vertexBuffer[this._vertexIndex++] = uvx0;
        vertexBuffer[this._vertexIndex++] = uvy0;
        vertexBuffer[this._vertexIndex++] = length;
        vertexBuffer[this._vertexIndex++] = thickness;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / width;
        // (0, 1) - 1
        vertexBuffer[this._vertexIndex++] = startBottom.x;
        vertexBuffer[this._vertexIndex++] = startBottom.y;
        vertexBuffer[this._vertexIndex++] = uvx0;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = length;
        vertexBuffer[this._vertexIndex++] = thickness;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / width;
        // (1, 0) - 2
        vertexBuffer[this._vertexIndex++] = endTop.x;
        vertexBuffer[this._vertexIndex++] = endTop.y;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy0;
        vertexBuffer[this._vertexIndex++] = length;
        vertexBuffer[this._vertexIndex++] = thickness;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / width;
        // (1, 1) - 3
        vertexBuffer[this._vertexIndex++] = endBottom.x;
        vertexBuffer[this._vertexIndex++] = endBottom.y;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = length;
        vertexBuffer[this._vertexIndex++] = thickness;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness / width;
    };
    RectangleRenderer.prototype.drawRectangle = function (pos, width, height, color, stroke, strokeThickness) {
        if (stroke === void 0) { stroke = Color_1.Color.Transparent; }
        if (strokeThickness === void 0) { strokeThickness = 0; }
        if (this._isFull()) {
            this.flush();
        }
        this._rectangleCount++;
        // transform based on current context
        var transform = this._context.getTransform();
        var opacity = this._context.opacity;
        var snapToPixel = this._context.snapToPixel;
        var topLeft = transform.multiply(pos.add((0, vector_1.vec)(0, 0)));
        var topRight = transform.multiply(pos.add((0, vector_1.vec)(width, 0)));
        var bottomRight = transform.multiply(pos.add((0, vector_1.vec)(width, height)));
        var bottomLeft = transform.multiply(pos.add((0, vector_1.vec)(0, height)));
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
        // TODO uv could be static vertex buffer
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
        vertexBuffer[this._vertexIndex++] = width;
        vertexBuffer[this._vertexIndex++] = height;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness;
        // (0, 1) - 1
        vertexBuffer[this._vertexIndex++] = bottomLeft.x;
        vertexBuffer[this._vertexIndex++] = bottomLeft.y;
        vertexBuffer[this._vertexIndex++] = uvx0;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = width;
        vertexBuffer[this._vertexIndex++] = height;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness;
        // (1, 0) - 2
        vertexBuffer[this._vertexIndex++] = topRight.x;
        vertexBuffer[this._vertexIndex++] = topRight.y;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy0;
        vertexBuffer[this._vertexIndex++] = width;
        vertexBuffer[this._vertexIndex++] = height;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness;
        // (1, 1) - 3
        vertexBuffer[this._vertexIndex++] = bottomRight.x;
        vertexBuffer[this._vertexIndex++] = bottomRight.y;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = width;
        vertexBuffer[this._vertexIndex++] = height;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        vertexBuffer[this._vertexIndex++] = stroke.r / 255;
        vertexBuffer[this._vertexIndex++] = stroke.g / 255;
        vertexBuffer[this._vertexIndex++] = stroke.b / 255;
        vertexBuffer[this._vertexIndex++] = stroke.a;
        vertexBuffer[this._vertexIndex++] = strokeThickness;
    };
    RectangleRenderer.prototype.hasPendingDraws = function () {
        return this._rectangleCount !== 0;
    };
    RectangleRenderer.prototype.flush = function () {
        // nothing to draw early exit
        if (this._rectangleCount === 0) {
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
        gl.drawElements(gl.TRIANGLES, this._rectangleCount * 6, this._quads.bufferGlType, 0);
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawnImagesCount += this._rectangleCount;
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawCallCount++;
        // Reset
        this._rectangleCount = 0;
        this._vertexIndex = 0;
    };
    return RectangleRenderer;
}());
exports.RectangleRenderer = RectangleRenderer;
