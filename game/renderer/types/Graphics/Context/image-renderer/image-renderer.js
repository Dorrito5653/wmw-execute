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
exports.ImageRenderer = void 0;
var vector_1 = require("../../../Math/vector");
var GraphicsDiagnostics_1 = require("../../GraphicsDiagnostics");
var ExcaliburGraphicsContextWebGL_1 = require("../ExcaliburGraphicsContextWebGL");
var quad_index_buffer_1 = require("../quad-index-buffer");
var shader_1 = require("../shader");
var texture_loader_1 = require("../texture-loader");
var vertex_buffer_1 = require("../vertex-buffer");
var vertex_layout_1 = require("../vertex-layout");
var image_renderer_frag_glsl_1 = require("./image-renderer.frag.glsl");
var image_renderer_vert_glsl_1 = require("./image-renderer.vert.glsl");
var ImageRenderer = /** @class */ (function () {
    function ImageRenderer() {
        this.type = 'ex.image';
        this.priority = 0;
        this._maxImages = 10922; // max(uint16) / 6 verts
        this._maxTextures = 0;
        // Per flush vars
        this._imageCount = 0;
        this._textures = [];
        this._vertexIndex = 0;
    }
    ImageRenderer.prototype.initialize = function (gl, context) {
        this._gl = gl;
        this._context = context;
        // Transform shader source
        // FIXME: PIXEL 6 complains `ERROR: Expression too complex.` if we use it's reported max texture units, 125 seems to work for now...
        this._maxTextures = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), 125);
        var transformedFrag = this._transformFragmentSource(image_renderer_frag_glsl_1["default"], this._maxTextures);
        // Compile shader
        this._shader = new shader_1.Shader({
            fragmentSource: transformedFrag,
            vertexSource: image_renderer_vert_glsl_1["default"]
        });
        this._shader.compile();
        // setup uniforms
        this._shader.use();
        this._shader.setUniformMatrix('u_matrix', context.ortho);
        // Initialize texture slots to [0, 1, 2, 3, 4, .... maxGPUTextures]
        this._shader.setUniformIntArray('u_textures', __spreadArray([], Array(this._maxTextures), true).map(function (_, i) { return i; }));
        // Setup memory layout
        this._buffer = new vertex_buffer_1.VertexBuffer({
            size: 10 * 4 * this._maxImages,
            type: 'dynamic'
        });
        this._layout = new vertex_layout_1.VertexLayout({
            shader: this._shader,
            vertexBuffer: this._buffer,
            attributes: [
                ['a_position', 2],
                ['a_opacity', 1],
                ['a_texcoord', 2],
                ['a_textureIndex', 1],
                ['a_tint', 4]
            ]
        });
        // Setup index buffer
        this._quads = new quad_index_buffer_1.QuadIndexBuffer(this._maxImages, true);
    };
    ImageRenderer.prototype._transformFragmentSource = function (source, maxTextures) {
        var newSource = source.replace('%%count%%', maxTextures.toString());
        var texturePickerBuilder = '';
        for (var i = 0; i < maxTextures; i++) {
            if (i === 0) {
                texturePickerBuilder += "if (v_textureIndex <= ".concat(i, ".5) {\n");
            }
            else {
                texturePickerBuilder += "   else if (v_textureIndex <= ".concat(i, ".5) {\n");
            }
            texturePickerBuilder += "      color = texture(u_textures[".concat(i, "], v_texcoord);\n");
            texturePickerBuilder += "   }\n";
        }
        newSource = newSource.replace('%%texture_picker%%', texturePickerBuilder);
        return newSource;
    };
    ImageRenderer.prototype._addImageAsTexture = function (image) {
        var texture = texture_loader_1.TextureLoader.load(image);
        if (this._textures.indexOf(texture) === -1) {
            this._textures.push(texture);
        }
    };
    ImageRenderer.prototype._bindTextures = function (gl) {
        // Bind textures in the correct order
        for (var i = 0; i < this._maxTextures; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this._textures[i] || this._textures[0]);
        }
    };
    ImageRenderer.prototype._getTextureIdForImage = function (image) {
        if (image) {
            return this._textures.indexOf(texture_loader_1.TextureLoader.get(image));
        }
        return -1;
    };
    ImageRenderer.prototype._isFull = function () {
        if (this._imageCount >= this._maxImages) {
            return true;
        }
        if (this._textures.length >= this._maxTextures) {
            return true;
        }
        return false;
    };
    ImageRenderer.prototype.draw = function (image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        var _a, _b, _c, _d;
        // Force a render if the batch is full
        if (this._isFull()) {
            this.flush();
        }
        this._imageCount++;
        this._addImageAsTexture(image);
        var width = (image === null || image === void 0 ? void 0 : image.width) || swidth || 0;
        var height = (image === null || image === void 0 ? void 0 : image.height) || sheight || 0;
        var view = [0, 0, (_a = swidth !== null && swidth !== void 0 ? swidth : image === null || image === void 0 ? void 0 : image.width) !== null && _a !== void 0 ? _a : 0, (_b = sheight !== null && sheight !== void 0 ? sheight : image === null || image === void 0 ? void 0 : image.height) !== null && _b !== void 0 ? _b : 0];
        var dest = [sx !== null && sx !== void 0 ? sx : 1, sy !== null && sy !== void 0 ? sy : 1];
        // If destination is specified, update view and dest
        if (dx !== undefined && dy !== undefined && dwidth !== undefined && dheight !== undefined) {
            view = [sx !== null && sx !== void 0 ? sx : 1, sy !== null && sy !== void 0 ? sy : 1, (_c = swidth !== null && swidth !== void 0 ? swidth : image === null || image === void 0 ? void 0 : image.width) !== null && _c !== void 0 ? _c : 0, (_d = sheight !== null && sheight !== void 0 ? sheight : image === null || image === void 0 ? void 0 : image.height) !== null && _d !== void 0 ? _d : 0];
            dest = [dx, dy];
            width = dwidth;
            height = dheight;
        }
        sx = view[0];
        sy = view[1];
        var sw = view[2];
        var sh = view[3];
        // transform based on current context
        var transform = this._context.getTransform();
        var opacity = this._context.opacity;
        var snapToPixel = this._context.snapToPixel;
        var topLeft = (0, vector_1.vec)(dest[0], dest[1]);
        var topRight = (0, vector_1.vec)(dest[0] + width, dest[1]);
        var bottomLeft = (0, vector_1.vec)(dest[0], dest[1] + height);
        var bottomRight = (0, vector_1.vec)(dest[0] + width, dest[1] + height);
        topLeft = transform.multiply(topLeft);
        topRight = transform.multiply(topRight);
        bottomLeft = transform.multiply(bottomLeft);
        bottomRight = transform.multiply(bottomRight);
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
        var tint = this._context.tint;
        var textureId = this._getTextureIdForImage(image);
        var imageWidth = image.width || width;
        var imageHeight = image.height || height;
        var uvx0 = (sx) / imageWidth;
        var uvy0 = (sy) / imageHeight;
        var uvx1 = (sx + sw - 0.01) / imageWidth;
        var uvy1 = (sy + sh - 0.01) / imageHeight;
        // update data
        var vertexBuffer = this._layout.vertexBuffer.bufferData;
        // (0, 0) - 0
        vertexBuffer[this._vertexIndex++] = topLeft.x;
        vertexBuffer[this._vertexIndex++] = topLeft.y;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = uvx0;
        vertexBuffer[this._vertexIndex++] = uvy0;
        vertexBuffer[this._vertexIndex++] = textureId;
        vertexBuffer[this._vertexIndex++] = tint.r / 255;
        vertexBuffer[this._vertexIndex++] = tint.g / 255;
        vertexBuffer[this._vertexIndex++] = tint.b / 255;
        vertexBuffer[this._vertexIndex++] = tint.a;
        // (0, 1) - 1
        vertexBuffer[this._vertexIndex++] = bottomLeft.x;
        vertexBuffer[this._vertexIndex++] = bottomLeft.y;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = uvx0;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = textureId;
        vertexBuffer[this._vertexIndex++] = tint.r / 255;
        vertexBuffer[this._vertexIndex++] = tint.g / 255;
        vertexBuffer[this._vertexIndex++] = tint.b / 255;
        vertexBuffer[this._vertexIndex++] = tint.a;
        // (1, 0) - 2
        vertexBuffer[this._vertexIndex++] = topRight.x;
        vertexBuffer[this._vertexIndex++] = topRight.y;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy0;
        vertexBuffer[this._vertexIndex++] = textureId;
        vertexBuffer[this._vertexIndex++] = tint.r / 255;
        vertexBuffer[this._vertexIndex++] = tint.g / 255;
        vertexBuffer[this._vertexIndex++] = tint.b / 255;
        vertexBuffer[this._vertexIndex++] = tint.a;
        // (1, 1) - 3
        vertexBuffer[this._vertexIndex++] = bottomRight.x;
        vertexBuffer[this._vertexIndex++] = bottomRight.y;
        vertexBuffer[this._vertexIndex++] = opacity;
        vertexBuffer[this._vertexIndex++] = uvx1;
        vertexBuffer[this._vertexIndex++] = uvy1;
        vertexBuffer[this._vertexIndex++] = textureId;
        vertexBuffer[this._vertexIndex++] = tint.r / 255;
        vertexBuffer[this._vertexIndex++] = tint.g / 255;
        vertexBuffer[this._vertexIndex++] = tint.b / 255;
        vertexBuffer[this._vertexIndex++] = tint.a;
    };
    ImageRenderer.prototype.hasPendingDraws = function () {
        return this._imageCount !== 0;
    };
    ImageRenderer.prototype.flush = function () {
        // nothing to draw early exit
        if (this._imageCount === 0) {
            return;
        }
        var gl = this._gl;
        // Bind the shader
        this._shader.use();
        // Bind the memory layout and upload data
        this._layout.use(true, 4 * 10 * this._imageCount);
        // Update ortho matrix uniform
        this._shader.setUniformMatrix('u_matrix', this._context.ortho);
        // Bind textures to
        this._bindTextures(gl);
        // Bind index buffer
        this._quads.bind();
        // Draw all the quads
        gl.drawElements(gl.TRIANGLES, this._imageCount * 6, this._quads.bufferGlType, 0);
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawnImagesCount += this._imageCount;
        GraphicsDiagnostics_1.GraphicsDiagnostics.DrawCallCount++;
        // Reset
        this._imageCount = 0;
        this._vertexIndex = 0;
        this._textures.length = 0;
    };
    return ImageRenderer;
}());
exports.ImageRenderer = ImageRenderer;
