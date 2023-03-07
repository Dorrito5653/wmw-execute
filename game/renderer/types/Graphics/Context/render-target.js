"use strict";
exports.__esModule = true;
exports.RenderTarget = void 0;
var render_source_1 = require("./render-source");
var RenderTarget = /** @class */ (function () {
    function RenderTarget(options) {
        this.width = options.width;
        this.height = options.height;
        this._gl = options.gl;
        this._setupFramebuffer();
    }
    RenderTarget.prototype.setResolution = function (width, height) {
        var gl = this._gl;
        this.width = width;
        this.height = height;
        gl.bindTexture(gl.TEXTURE_2D, this._frameTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    };
    Object.defineProperty(RenderTarget.prototype, "frameBuffer", {
        get: function () {
            return this._frameBuffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderTarget.prototype, "frameTexture", {
        get: function () {
            return this._frameTexture;
        },
        enumerable: false,
        configurable: true
    });
    RenderTarget.prototype._setupFramebuffer = function () {
        // Allocates frame buffer
        var gl = this._gl;
        this._frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._frameTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // attach the texture as the first color attachment
        var attachmentPoint = gl.COLOR_ATTACHMENT0;
        // After this bind all draw calls will draw to this framebuffer texture
        this._frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this._frameTexture, 0);
        // Reset after initialized
        this.disable();
    };
    RenderTarget.prototype.toRenderSource = function () {
        var source = new render_source_1.RenderSource(this._gl, this._frameTexture);
        return source;
    };
    /**
     * When called, all drawing gets redirected to this render target
     */
    RenderTarget.prototype.use = function () {
        var gl = this._gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
        // very important to set the viewport to the size of the framebuffer texture
        gl.viewport(0, 0, this.width, this.height);
    };
    /**
     * When called, all drawing is sent back to the canvas
     */
    RenderTarget.prototype.disable = function () {
        var gl = this._gl;
        // passing null switches rendering back to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    return RenderTarget;
}());
exports.RenderTarget = RenderTarget;
