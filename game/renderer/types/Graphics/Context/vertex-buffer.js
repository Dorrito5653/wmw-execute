"use strict";
exports.__esModule = true;
exports.VertexBuffer = void 0;
var webgl_adapter_1 = require("./webgl-adapter");
/**
 * Helper around vertex buffer to simplify creating and uploading geometry
 *
 * Under the hood uses Float32Array
 */
var VertexBuffer = /** @class */ (function () {
    function VertexBuffer(options) {
        this._gl = webgl_adapter_1.ExcaliburWebGLContextAccessor.gl;
        /**
         * If the vertices never change switching 'static' can be more efficient on the gpu
         *
         * Default is 'dynamic'
         */
        this.type = 'dynamic';
        var size = options.size, type = options.type, data = options.data;
        this.buffer = this._gl.createBuffer();
        if (!data && !size) {
            throw Error('Must either provide data or a size to the VertexBuffer');
        }
        if (!data) {
            this.bufferData = new Float32Array(size);
        }
        else {
            this.bufferData = data;
        }
        this.type = type !== null && type !== void 0 ? type : this.type;
        // Allocate buffer
        var gl = this._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.bufferData, this.type === 'static' ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    }
    /**
     * Bind this vertex buffer
     */
    VertexBuffer.prototype.bind = function () {
        var gl = this._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    };
    /**
     * Upload vertex buffer geometry to the GPU
     */
    VertexBuffer.prototype.upload = function (count) {
        var gl = this._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        if (count) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bufferData, 0, count);
        }
        else {
            // TODO always use bufferSubData? need to perf test it
            gl.bufferData(gl.ARRAY_BUFFER, this.bufferData, this.type === 'static' ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
        }
    };
    return VertexBuffer;
}());
exports.VertexBuffer = VertexBuffer;
