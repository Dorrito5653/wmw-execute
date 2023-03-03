"use strict";
exports.__esModule = true;
exports.QuadIndexBuffer = void 0;
var __1 = require("../..");
var webgl_adapter_1 = require("./webgl-adapter");
/**
 * Helper that defines and index buffer for quad geometry
 *
 * Index buffers allow you to save space in vertex buffers when you share vertices in geometry
 * it is almost always worth it in terms of performance to use an index buffer.
 */
var QuadIndexBuffer = /** @class */ (function () {
    /**
     * @param numberOfQuads Specify the max number of quads you want to draw
     * @param useUint16 Optionally force a uint16 buffer
     */
    function QuadIndexBuffer(numberOfQuads, useUint16) {
        this._gl = webgl_adapter_1.ExcaliburWebGLContextAccessor.gl;
        this._logger = __1.Logger.getInstance();
        var gl = this._gl;
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        var totalVertices = numberOfQuads * 6;
        if (!useUint16) {
            this.bufferData = new Uint32Array(totalVertices);
        }
        else {
            // fall back to using gl.UNSIGNED_SHORT or tell the user they are out of luck
            var maxUint16 = 65535;
            var maxUint16Index = Math.floor((maxUint16 - 1) / 4); // max quads
            this.bufferGlType = gl.UNSIGNED_SHORT;
            this.bufferData = new Uint16Array(totalVertices);
            // TODO Should we error if this happens?? maybe not might crash mid game
            if (numberOfQuads > maxUint16Index) {
                this._logger.warn("Total quads exceeds hardware index buffer limit (uint16), max(".concat(maxUint16Index, ") requested quads(").concat(numberOfQuads, ")"));
            }
        }
        var currentQuad = 0;
        for (var i = 0; i < totalVertices; i += 6) {
            // first triangle
            this.bufferData[i + 0] = currentQuad + 0;
            this.bufferData[i + 1] = currentQuad + 1;
            this.bufferData[i + 2] = currentQuad + 2;
            // second triangle
            this.bufferData[i + 3] = currentQuad + 2;
            this.bufferData[i + 4] = currentQuad + 1;
            this.bufferData[i + 5] = currentQuad + 3;
            currentQuad += 4;
        }
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.bufferData, gl.STATIC_DRAW);
    }
    Object.defineProperty(QuadIndexBuffer.prototype, "size", {
        get: function () {
            return this.bufferData.length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Upload data to the GPU
     */
    QuadIndexBuffer.prototype.upload = function () {
        var gl = this._gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.bufferData, gl.STATIC_DRAW);
    };
    /**
     * Bind this index buffer
     */
    QuadIndexBuffer.prototype.bind = function () {
        var gl = this._gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    };
    return QuadIndexBuffer;
}());
exports.QuadIndexBuffer = QuadIndexBuffer;
