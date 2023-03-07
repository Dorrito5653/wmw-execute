"use strict";
exports.__esModule = true;
exports.VertexLayout = void 0;
var __1 = require("../..");
var webgl_adapter_1 = require("./webgl-adapter");
var webgl_util_1 = require("./webgl-util");
/**
 * Helper around creating vertex attributes in a given [[VertexBuffer]], this is useful for describing
 * the memory layout for your vertices inside a particular buffer
 *
 * Note: This helper assumes interleaved attributes in one [[VertexBuffer]], not many.
 *
 * Working with `gl.vertexAttribPointer` can be tricky, and this attempts to double check you
 */
var VertexLayout = /** @class */ (function () {
    function VertexLayout(options) {
        this._gl = webgl_adapter_1.ExcaliburWebGLContextAccessor.gl;
        this._logger = __1.Logger.getInstance();
        this._layout = [];
        this._attributes = [];
        this._vertexTotalSizeBytes = 0;
        var shader = options.shader, vertexBuffer = options.vertexBuffer, attributes = options.attributes;
        this._vertexBuffer = vertexBuffer;
        this._attributes = attributes;
        this._shader = shader;
        this.initialize();
    }
    Object.defineProperty(VertexLayout.prototype, "vertexBuffer", {
        get: function () {
            return this._vertexBuffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VertexLayout.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VertexLayout.prototype, "totalVertexSizeBytes", {
        /**
         * Total number of bytes that the vertex will take up
         */
        get: function () {
            return this._vertexTotalSizeBytes;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Layouts need shader locations and must be bound to a shader
     */
    VertexLayout.prototype.initialize = function () {
        if (!this._shader.compiled) {
            throw Error('Shader not compiled, shader must be compiled before defining a vertex layout');
        }
        this._layout.length = 0;
        var shaderAttributes = this._shader.attributes;
        for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
            var attribute = _a[_i];
            var attrib = shaderAttributes[attribute[0]];
            if (!attrib) {
                throw Error("The attribute named: ".concat(attribute[0], " size ").concat(attribute[1]) +
                    " not found in the shader source code:\n ".concat(this._shader.vertexSource));
            }
            if (attrib.size !== attribute[1]) {
                throw Error("VertexLayout size definition for attribute: [".concat(attribute[0], ", ").concat(attribute[1], "],")
                    + " doesnt match shader source size ".concat(attrib.size, ":\n ").concat(this._shader.vertexSource));
            }
            this._layout.push(attrib);
        }
        // calc size
        var componentsPerVertex = 0;
        for (var _b = 0, _c = this._layout; _b < _c.length; _b++) {
            var vertAttribute = _c[_b];
            var typeSize = (0, webgl_util_1.getGlTypeSizeBytes)(this._gl, vertAttribute.glType);
            this._vertexTotalSizeBytes += typeSize * vertAttribute.size;
            componentsPerVertex += vertAttribute.size;
        }
        if (this._vertexBuffer.bufferData.length % componentsPerVertex !== 0) {
            this._logger.warn("The vertex component size (".concat(componentsPerVertex, ")  does divide evenly into the specified vertex buffer")
                + " (".concat(this._vertexBuffer.bufferData.length, ")"));
        }
    };
    /**
     * Bind this layout with it's associated vertex buffer
     *
     * @param uploadBuffer Optionally indicate you wish to upload the buffer to the GPU associated with this layout
     */
    VertexLayout.prototype.use = function (uploadBuffer, count) {
        if (uploadBuffer === void 0) { uploadBuffer = false; }
        var gl = this._gl;
        if (!this._shader.isCurrentlyBound()) {
            throw Error('Shader associated with this vertex layout is not active! Call shader.use() before layout.use()');
        }
        this._vertexBuffer.bind();
        if (uploadBuffer) {
            this._vertexBuffer.upload(count);
        }
        var offset = 0;
        // TODO switch to VAOs if the extension is
        for (var _i = 0, _a = this._layout; _i < _a.length; _i++) {
            var vert = _a[_i];
            gl.vertexAttribPointer(vert.location, vert.size, vert.glType, vert.normalized, this.totalVertexSizeBytes, offset);
            gl.enableVertexAttribArray(vert.location);
            offset += (0, webgl_util_1.getGlTypeSizeBytes)(gl, vert.glType) * vert.size;
        }
    };
    return VertexLayout;
}());
exports.VertexLayout = VertexLayout;
