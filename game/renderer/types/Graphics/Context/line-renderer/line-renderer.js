"use strict";
exports.__esModule = true;
exports.LineRenderer = void 0;
var line_vertex_glsl_1 = require("./line-vertex.glsl");
var line_fragment_glsl_1 = require("./line-fragment.glsl");
var __1 = require("../..");
var GraphicsDiagnostics_1 = require("../../GraphicsDiagnostics");
var LineRenderer = /** @class */ (function () {
    function LineRenderer() {
        this.type = 'ex.line';
        this.priority = 0;
        this._maxLines = 10922;
        this._vertexIndex = 0;
        this._lineCount = 0;
    }
    LineRenderer.prototype.initialize = function (gl, context) {
        this._gl = gl;
        this._context = context;
        this._shader = new __1.Shader({
            vertexSource: line_vertex_glsl_1["default"],
            fragmentSource: line_fragment_glsl_1["default"]
        });
        this._shader.compile();
        this._shader.use();
        this._shader.setUniformMatrix('u_matrix', this._context.ortho);
        this._vertexBuffer = new __1.VertexBuffer({
            size: 6 * 2 * this._maxLines,
            type: 'dynamic'
        });
        this._layout = new __1.VertexLayout({
            vertexBuffer: this._vertexBuffer,
            shader: this._shader,
            attributes: [
                ['a_position', 2],
                ['a_color', 4]
            ]
        });
    };
    LineRenderer.prototype.draw = function (start, end, color) {
        // Force a render if the batch is full
        if (this._isFull()) {
            this.flush();
        }
        this._lineCount++;
        var transform = this._context.getTransform();
        var finalStart = transform.multiply(start);
        var finalEnd = transform.multiply(end);
        var vertexBuffer = this._vertexBuffer.bufferData;
        // Start
        vertexBuffer[this._vertexIndex++] = finalStart.x;
        vertexBuffer[this._vertexIndex++] = finalStart.y;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
        // End
        vertexBuffer[this._vertexIndex++] = finalEnd.x;
        vertexBuffer[this._vertexIndex++] = finalEnd.y;
        vertexBuffer[this._vertexIndex++] = color.r / 255;
        vertexBuffer[this._vertexIndex++] = color.g / 255;
        vertexBuffer[this._vertexIndex++] = color.b / 255;
        vertexBuffer[this._vertexIndex++] = color.a;
    };
    LineRenderer.prototype._isFull = function () {
        if (this._lineCount >= this._maxLines) {
            return true;
        }
        return false;
    };
    LineRenderer.prototype.hasPendingDraws = function () {
        return this._lineCount !== 0;
    };
    LineRenderer.prototype.flush = function () {
        // nothing to draw early exit
        if (this._lineCount === 0) {
            return;
        }
        var gl = this._gl;
        this._shader.use();
        this._layout.use(true);
        this._shader.setUniformMatrix('u_matrix', this._context.ortho);
        gl.drawArrays(gl.LINES, 0, this._lineCount * 2); // 2 verts per line
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawnImagesCount += this._lineCount;
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawCallCount++;
        // reset
        this._vertexIndex = 0;
        this._lineCount = 0;
    };
    return LineRenderer;
}());
exports.LineRenderer = LineRenderer;
