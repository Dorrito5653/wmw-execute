"use strict";
exports.__esModule = true;
exports.ColorBlindnessPostProcessor = void 0;
var color_blind_fragment_glsl_1 = require("./color-blind-fragment.glsl");
var ColorBlindnessMode_1 = require("./ColorBlindnessMode");
var ScreenShader_1 = require("./ScreenShader");
var ColorBlindnessPostProcessor = /** @class */ (function () {
    function ColorBlindnessPostProcessor(_colorBlindnessMode, simulate) {
        if (simulate === void 0) { simulate = false; }
        this._colorBlindnessMode = _colorBlindnessMode;
        this._simulate = false;
        this._simulate = simulate;
    }
    ColorBlindnessPostProcessor.prototype.initialize = function (_gl) {
        this._shader = new ScreenShader_1.ScreenShader(color_blind_fragment_glsl_1["default"]);
        this.simulate = this._simulate;
        this.colorBlindnessMode = this._colorBlindnessMode;
    };
    ColorBlindnessPostProcessor.prototype.getShader = function () {
        return this._shader.getShader();
    };
    ColorBlindnessPostProcessor.prototype.getLayout = function () {
        return this._shader.getLayout();
    };
    Object.defineProperty(ColorBlindnessPostProcessor.prototype, "colorBlindnessMode", {
        get: function () {
            return this._colorBlindnessMode;
        },
        set: function (colorBlindMode) {
            this._colorBlindnessMode = colorBlindMode;
            if (this._shader) {
                var shader = this._shader.getShader();
                shader.use();
                if (this._colorBlindnessMode === ColorBlindnessMode_1.ColorBlindnessMode.Protanope) {
                    shader.setUniformInt('u_type', 0);
                }
                else if (this._colorBlindnessMode === ColorBlindnessMode_1.ColorBlindnessMode.Deuteranope) {
                    shader.setUniformInt('u_type', 1);
                }
                else if (this._colorBlindnessMode === ColorBlindnessMode_1.ColorBlindnessMode.Tritanope) {
                    shader.setUniformInt('u_type', 2);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorBlindnessPostProcessor.prototype, "simulate", {
        get: function () {
            return this._simulate;
        },
        set: function (value) {
            this._simulate = value;
            if (this._shader) {
                var shader = this._shader.getShader();
                shader.use();
                shader.setUniformBoolean('u_simulate', value);
            }
        },
        enumerable: false,
        configurable: true
    });
    return ColorBlindnessPostProcessor;
}());
exports.ColorBlindnessPostProcessor = ColorBlindnessPostProcessor;
