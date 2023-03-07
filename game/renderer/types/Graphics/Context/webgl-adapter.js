"use strict";
exports.__esModule = true;
exports.ExcaliburWebGLContextAccessor = void 0;
/**
 * Must be accessed after Engine construction time to ensure the context has been created
 */
var ExcaliburWebGLContextAccessor = /** @class */ (function () {
    function ExcaliburWebGLContextAccessor() {
    }
    ExcaliburWebGLContextAccessor.clear = function () {
        ExcaliburWebGLContextAccessor._GL = null;
    };
    ExcaliburWebGLContextAccessor.register = function (gl) {
        ExcaliburWebGLContextAccessor._GL = gl;
    };
    Object.defineProperty(ExcaliburWebGLContextAccessor, "gl", {
        // current webgl context
        get: function () {
            if (!ExcaliburWebGLContextAccessor._GL) {
                throw Error('Attempted gl access before init');
            }
            return ExcaliburWebGLContextAccessor._GL;
        },
        enumerable: false,
        configurable: true
    });
    return ExcaliburWebGLContextAccessor;
}());
exports.ExcaliburWebGLContextAccessor = ExcaliburWebGLContextAccessor;
