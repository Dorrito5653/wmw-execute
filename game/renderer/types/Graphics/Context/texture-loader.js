"use strict";
exports.__esModule = true;
exports.TextureLoader = void 0;
var Log_1 = require("../../Util/Log");
var Filtering_1 = require("../Filtering");
/**
 * Manages loading image sources into webgl textures, a unique id is associated with all sources
 */
var TextureLoader = /** @class */ (function () {
    function TextureLoader() {
    }
    TextureLoader.register = function (context) {
        TextureLoader._GL = context;
        TextureLoader._MAX_TEXTURE_SIZE = context.getParameter(context.MAX_TEXTURE_SIZE);
    };
    /**
     * Get the WebGL Texture from a source image
     * @param image
     */
    TextureLoader.get = function (image) {
        return TextureLoader._TEXTURE_MAP.get(image);
    };
    /**
     * Returns whether a source image has been loaded as a texture
     * @param image
     */
    TextureLoader.has = function (image) {
        return TextureLoader._TEXTURE_MAP.has(image);
    };
    /**
     * Loads a graphic into webgl and returns it's texture info, a webgl context must be previously registered
     * @param image Source graphic
     * @param filtering {ImageFiltering} The ImageFiltering mode to apply to the loaded texture
     * @param forceUpdate Optionally force a texture to be reloaded, useful if the source graphic has changed
     */
    TextureLoader.load = function (image, filtering, forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        // Ignore loading if webgl is not registered
        var gl = TextureLoader._GL;
        if (!gl) {
            return null;
        }
        var tex = null;
        // If reuse the texture if it's from the same source
        if (TextureLoader.has(image)) {
            tex = TextureLoader.get(image);
        }
        // Update existing webgl texture and return early
        if (tex) {
            if (forceUpdate) {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            }
            return tex;
        }
        // No texture exists create a new one
        tex = gl.createTexture();
        TextureLoader.checkImageSizeSupportedAndLog(image);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // NEAREST for pixel art, LINEAR for hi-res
        var filterMode = filtering !== null && filtering !== void 0 ? filtering : TextureLoader.filtering;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode === Filtering_1.ImageFiltering.Pixel ? gl.NEAREST : gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode === Filtering_1.ImageFiltering.Pixel ? gl.NEAREST : gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        TextureLoader._TEXTURE_MAP.set(image, tex);
        return tex;
    };
    TextureLoader["delete"] = function (image) {
        // Ignore loading if webgl is not registered
        var gl = TextureLoader._GL;
        if (!gl) {
            return null;
        }
        var tex = null;
        if (TextureLoader.has(image)) {
            tex = TextureLoader.get(image);
            gl.deleteTexture(tex);
        }
    };
    /**
     * Takes an image and returns if it meets size criteria for hardware
     * @param image
     * @returns if the image will be supported at runtime
     */
    TextureLoader.checkImageSizeSupportedAndLog = function (image) {
        var _a;
        var originalSrc = (_a = image.dataset.originalSrc) !== null && _a !== void 0 ? _a : 'internal canvas bitmap';
        if (image.width > TextureLoader._MAX_TEXTURE_SIZE || image.height > TextureLoader._MAX_TEXTURE_SIZE) {
            TextureLoader._LOGGER.error("The image [".concat(originalSrc, "] provided to Excalibur is too large for the device's maximum texture size of ") +
                "(".concat(TextureLoader._MAX_TEXTURE_SIZE, "x").concat(TextureLoader._MAX_TEXTURE_SIZE, ") please resize to an image ")
                + "for excalibur to render properly.\n\nImages will likely render as black rectangles.\n\n" +
                "Read more here: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#understand_system_limits");
            return false;
        }
        else if (image.width > 4096 || image.height > 4096) {
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#understand_system_limits
            TextureLoader._LOGGER.warn("The image [".concat(originalSrc, "] provided to excalibur is too large may not work on all mobile devices, ") +
                "it is recommended you resize images to a maximum (4096x4096).\n\n" +
                "Images will likely render as black rectangles on some mobile platforms.\n\n" +
                "Read more here: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#understand_system_limits");
        }
        return true;
    };
    TextureLoader._LOGGER = Log_1.Logger.getInstance();
    /**
     * Sets the default filtering for the Excalibur texture loader, default [[ImageFiltering.Blended]]
     */
    TextureLoader.filtering = Filtering_1.ImageFiltering.Blended;
    TextureLoader._TEXTURE_MAP = new Map();
    TextureLoader._MAX_TEXTURE_SIZE = 0;
    return TextureLoader;
}());
exports.TextureLoader = TextureLoader;
