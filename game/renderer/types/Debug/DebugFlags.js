"use strict";
exports.__esModule = true;
exports.ColorBlindFlags = void 0;
var ColorBlindnessMode_1 = require("../Graphics/PostProcessor/ColorBlindnessMode");
var ColorBlindnessPostProcessor_1 = require("../Graphics/PostProcessor/ColorBlindnessPostProcessor");
var __1 = require("..");
var ColorBlindFlags = /** @class */ (function () {
    function ColorBlindFlags(engine) {
        this._engine = engine;
        this._colorBlindPostProcessor = new ColorBlindnessPostProcessor_1.ColorBlindnessPostProcessor(ColorBlindnessMode_1.ColorBlindnessMode.Protanope);
    }
    /**
     * Correct colors for a specified color blindness
     * @param colorBlindness
     */
    ColorBlindFlags.prototype.correct = function (colorBlindness) {
        if (this._engine.graphicsContext instanceof __1.ExcaliburGraphicsContextWebGL) {
            this.clear();
            this._colorBlindPostProcessor.colorBlindnessMode = colorBlindness;
            this._colorBlindPostProcessor.simulate = false;
            this._engine.graphicsContext.addPostProcessor(this._colorBlindPostProcessor);
        }
    };
    /**
     * Simulate colors for a specified color blindness
     * @param colorBlindness
     */
    ColorBlindFlags.prototype.simulate = function (colorBlindness) {
        if (this._engine.graphicsContext instanceof __1.ExcaliburGraphicsContextWebGL) {
            this.clear();
            this._colorBlindPostProcessor.colorBlindnessMode = colorBlindness;
            this._colorBlindPostProcessor.simulate = true;
            this._engine.graphicsContext.addPostProcessor(this._colorBlindPostProcessor);
        }
    };
    /**
     * Remove color blindness post processor
     */
    ColorBlindFlags.prototype.clear = function () {
        this._engine.graphicsContext.removePostProcessor(this._colorBlindPostProcessor);
    };
    return ColorBlindFlags;
}());
exports.ColorBlindFlags = ColorBlindFlags;
