"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Shader = void 0;
var webgl_adapter_1 = require("./webgl-adapter");
var webgl_util_1 = require("./webgl-util");
var Shader = /** @class */ (function () {
    /**
     * Create a shader program in excalibur
     * @param options specify shader vertex and fragment source
     */
    function Shader(options) {
        this._gl = webgl_adapter_1.ExcaliburWebGLContextAccessor.gl;
        this.uniforms = {};
        this.attributes = {};
        this._compiled = false;
        var vertexSource = options.vertexSource, fragmentSource = options.fragmentSource;
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
    }
    Object.defineProperty(Shader.prototype, "compiled", {
        get: function () {
            return this._compiled;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Binds the shader program
     */
    Shader.prototype.use = function () {
        var gl = this._gl;
        gl.useProgram(this.program);
        Shader._ACTIVE_SHADER_INSTANCE = this;
    };
    Shader.prototype.isCurrentlyBound = function () {
        return Shader._ACTIVE_SHADER_INSTANCE === this;
    };
    /**
     * Compile the current shader against a webgl context
     */
    Shader.prototype.compile = function () {
        var gl = this._gl;
        var vertexShader = this._compileShader(gl, this.vertexSource, gl.VERTEX_SHADER);
        var fragmentShader = this._compileShader(gl, this.fragmentSource, gl.FRAGMENT_SHADER);
        this.program = this._createProgram(gl, vertexShader, fragmentShader);
        var attributes = this.getAttributes();
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            this.attributes[attribute.name] = attribute;
        }
        var uniforms = this.getUniforms();
        for (var _a = 0, uniforms_1 = uniforms; _a < uniforms_1.length; _a++) {
            var uniform = uniforms_1[_a];
            this.uniforms[uniform.name] = uniform;
        }
        this._compiled = true;
        return this.program;
    };
    Shader.prototype.getUniforms = function () {
        var gl = this._gl;
        var uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        var uniforms = [];
        for (var i = 0; i < uniformCount; i++) {
            var uniform = gl.getActiveUniform(this.program, i);
            var uniformLocation = gl.getUniformLocation(this.program, uniform.name);
            uniforms.push({
                name: uniform.name,
                glType: uniform.type,
                location: uniformLocation
            });
        }
        return uniforms;
    };
    Shader.prototype.getAttributes = function () {
        var gl = this._gl;
        var attributeCount = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
        var attributes = [];
        for (var i = 0; i < attributeCount; i++) {
            var attribute = gl.getActiveAttrib(this.program, i);
            var attributeLocation = gl.getAttribLocation(this.program, attribute.name);
            attributes.push({
                name: attribute.name,
                glType: (0, webgl_util_1.getAttributePointerType)(gl, attribute.type),
                size: (0, webgl_util_1.getAttributeComponentSize)(gl, attribute.type),
                location: attributeLocation,
                normalized: false
            });
        }
        return attributes;
    };
    /**
     * Set a texture in a gpu texture slot
     * @param slotNumber
     * @param texture
     */
    Shader.prototype.setTexture = function (slotNumber, texture) {
        var gl = this._gl;
        gl.activeTexture(gl.TEXTURE0 + slotNumber);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    };
    /**
     * Set an integer uniform for the current shader
     *
     * **Important** Must call ex.Shader.use() before setting a uniform!
     *
     * @param name
     * @param value
     */
    Shader.prototype.setUniformInt = function (name, value) {
        this.setUniform('uniform1i', name, ~~value);
    };
    /**
     * Set an integer array uniform for the current shader
     *
     * **Important** Must call ex.Shader.use() before setting a uniform!
     *
     * @param name
     * @param value
     */
    Shader.prototype.setUniformIntArray = function (name, value) {
        this.setUniform('uniform1iv', name, value);
    };
    /**
     * Set a boolean uniform for the current shader
     *
     * **Important** Must call ex.Shader.use() before setting a uniform!
     *
     * @param name
     * @param value
     */
    Shader.prototype.setUniformBoolean = function (name, value) {
        this.setUniform('uniform1i', name, value ? 1 : 0);
    };
    /**
     * Set a float uniform for the current shader
     *
     * **Important** Must call ex.Shader.use() before setting a uniform!
     *
     * @param name
     * @param value
     */
    Shader.prototype.setUniformFloat = function (name, value) {
        this.setUniform('uniform1f', name, value);
    };
    /**
     * Set a float array uniform for the current shader
     *
     * **Important** Must call ex.Shader.use() before setting a uniform!
     *
     * @param name
     * @param value
     */
    Shader.prototype.setUniformFloatArray = function (name, value) {
        this.setUniform('uniform1fv', name, value);
    };
    /**
     * Set a [[Vector]] uniform for the current shader
     *
     * **Important** Must call ex.Shader.use() before setting a uniform!
     *
     * @param name
     * @param value
     */
    Shader.prototype.setUniformFloatVector = function (name, value) {
        this.setUniform('uniform2f', name, value.x, value.y);
    };
    /**
     * Set an [[Matrix]] uniform for the current shader
     *
     * **Important** Must call ex.Shader.use() before setting a uniform!
     *
     * @param name
     * @param value
     */
    Shader.prototype.setUniformMatrix = function (name, value) {
        this.setUniform('uniformMatrix4fv', name, false, value.data);
    };
    /**
     * Set any available uniform type in webgl
     *
     * For example setUniform('uniformMatrix2fv', 'u_my2x2_mat`, ...);
     */
    Shader.prototype.setUniform = function (uniformType, name) {
        var value = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            value[_i - 2] = arguments[_i];
        }
        if (!this._compiled) {
            throw Error("Must compile shader before setting a uniform ".concat(uniformType, ":").concat(name));
        }
        if (!this.isCurrentlyBound()) {
            throw Error('Currently accessed shader instance is not the current active shader in WebGL,' +
                ' must call `shader.use()` before setting uniforms');
        }
        var gl = this._gl;
        var location = gl.getUniformLocation(this.program, name);
        if (location) {
            var args = __spreadArray([location], value, true);
            this._gl[uniformType].apply(this._gl, args);
        }
        else {
            throw Error("Uniform ".concat(uniformType, ":").concat(name, " doesn't exist or is not used in the shader source code,") +
                ' unused uniforms are optimized away by most browsers');
        }
    };
    Shader.prototype._createProgram = function (gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        if (program === null) {
            throw Error('Could not create graphics shader program');
        }
        // attach the shaders.
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // link the program.
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            throw Error("Could not link the program: [".concat(gl.getProgramInfoLog(program), "]"));
        }
        return program;
    };
    Shader.prototype._compileShader = function (gl, source, type) {
        var typeName = gl.VERTEX_SHADER === type ? 'vertex' : 'fragment';
        var shader = gl.createShader(type);
        if (shader === null) {
            throw Error("Could not build shader: [".concat(source, "]"));
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            var errorInfo = gl.getShaderInfoLog(shader);
            throw Error("Could not compile ".concat(typeName, " shader:\n\n").concat(errorInfo).concat(this._processSourceForError(source, errorInfo)));
        }
        return shader;
    };
    Shader.prototype._processSourceForError = function (source, errorInfo) {
        var lines = source.split('\n');
        var errorLineStart = errorInfo.search(/\d:\d/);
        var errorLineEnd = errorInfo.indexOf(' ', errorLineStart);
        var _a = errorInfo.slice(errorLineStart, errorLineEnd).split(':').map(function (v) { return Number(v); }), _ = _a[0], error2 = _a[1];
        for (var i = 0; i < lines.length; i++) {
            lines[i] = "".concat(i + 1, ": ").concat(lines[i]).concat(error2 === (i + 1) ? ' <----- ERROR!' : '');
        }
        return '\n\nSource:\n' + lines.join('\n');
    };
    Shader._ACTIVE_SHADER_INSTANCE = null;
    return Shader;
}());
exports.Shader = Shader;
