"use strict";
exports.__esModule = true;
exports.ScreenPassPainter = void 0;
var screen_vertex_glsl_1 = require("./screen-vertex.glsl");
var screen_fragment_glsl_1 = require("./screen-fragment.glsl");
var shader_1 = require("../shader");
var vertex_buffer_1 = require("../vertex-buffer");
var vertex_layout_1 = require("../vertex-layout");
/**
 * This is responsible for painting the entire screen during the render passes
 */
var ScreenPassPainter = /** @class */ (function () {
    function ScreenPassPainter(gl) {
        this._gl = gl;
        this._shader = new shader_1.Shader({
            vertexSource: screen_vertex_glsl_1["default"],
            fragmentSource: screen_fragment_glsl_1["default"]
        });
        this._shader.compile();
        // Setup memory layout
        this._buffer = new vertex_buffer_1.VertexBuffer({
            type: 'static',
            // clip space quad + uv since we don't need a camera
            data: new Float32Array([
                -1, -1, 0, 0,
                -1, 1, 0, 1,
                1, -1, 1, 0,
                1, -1, 1, 0,
                -1, 1, 0, 1,
                1, 1, 1, 1
            ])
        });
        this._layout = new vertex_layout_1.VertexLayout({
            shader: this._shader,
            vertexBuffer: this._buffer,
            attributes: [
                ['a_position', 2],
                ['a_texcoord', 2]
            ]
        });
        this._buffer.upload();
    }
    ScreenPassPainter.prototype.renderWithPostProcessor = function (postprocessor) {
        var gl = this._gl;
        postprocessor.getShader().use();
        postprocessor.getLayout().use();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    ScreenPassPainter.prototype.renderToScreen = function () {
        var gl = this._gl;
        this._shader.use();
        this._layout.use();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    return ScreenPassPainter;
}());
exports.ScreenPassPainter = ScreenPassPainter;
