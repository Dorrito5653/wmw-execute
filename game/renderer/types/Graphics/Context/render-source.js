"use strict";
exports.__esModule = true;
exports.RenderSource = void 0;
var RenderSource = /** @class */ (function () {
    function RenderSource(_gl, _texture) {
        this._gl = _gl;
        this._texture = _texture;
    }
    RenderSource.prototype.use = function () {
        var gl = this._gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    };
    RenderSource.prototype.disable = function () {
        var gl = this._gl;
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    return RenderSource;
}());
exports.RenderSource = RenderSource;
