"use strict";
exports.__esModule = true;
exports.ScreenShader = void 0;
var shader_1 = require("../Context/shader");
var vertex_buffer_1 = require("../Context/vertex-buffer");
var vertex_layout_1 = require("../Context/vertex-layout");
/**
 * Helper that defines a whole screen renderer, just provide a fragment source!
 *
 * Currently supports 1 varying
 * - vec2 a_texcoord between 0-1 which corresponds to screen position
 */
var ScreenShader = /** @class */ (function () {
    function ScreenShader(fragmentSource) {
        this._shader = new shader_1.Shader({
            vertexSource: "#version 300 es\n      in vec2 a_position;\n      in vec2 a_texcoord;\n      out vec2 v_texcoord;\n\n      void main() {\n        gl_Position = vec4(a_position, 0.0, 1.0);\n        // Pass the texcoord to the fragment shader.\n        v_texcoord = a_texcoord;\n      }",
            fragmentSource: fragmentSource
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
    ScreenShader.prototype.getShader = function () {
        return this._shader;
    };
    ScreenShader.prototype.getLayout = function () {
        return this._layout;
    };
    return ScreenShader;
}());
exports.ScreenShader = ScreenShader;
