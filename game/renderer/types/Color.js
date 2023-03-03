"use strict";
exports.__esModule = true;
exports.Color = void 0;
/**
 * Provides standard colors (e.g. [[Color.Black]])
 * but you can also create custom colors using RGB, HSL, or Hex. Also provides
 * useful color operations like [[Color.lighten]], [[Color.darken]], and more.
 */
var Color = /** @class */ (function () {
    /**
     * Creates a new instance of Color from an r, g, b, a
     *
     * @param r  The red component of color (0-255)
     * @param g  The green component of color (0-255)
     * @param b  The blue component of color (0-255)
     * @param a  The alpha component of color (0-1.0)
     */
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a != null ? a : 1;
    }
    /**
     * Creates a new instance of Color from an r, g, b, a
     *
     * @param r  The red component of color (0-255)
     * @param g  The green component of color (0-255)
     * @param b  The blue component of color (0-255)
     * @param a  The alpha component of color (0-1.0)
     */
    Color.fromRGB = function (r, g, b, a) {
        return new Color(r, g, b, a);
    };
    /**
     * Creates a new instance of Color from a rgb string
     *
     * @param string  CSS color string of the form rgba(255, 255, 255, 1) or rgb(255, 255, 255)
     */
    Color.fromRGBString = function (string) {
        var rgbaRegEx = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/i;
        var match = null;
        if ((match = string.match(rgbaRegEx))) {
            var r = parseInt(match[1], 10);
            var g = parseInt(match[2], 10);
            var b = parseInt(match[3], 10);
            var a = 1;
            if (match[4]) {
                a = parseFloat(match[4]);
            }
            return new Color(r, g, b, a);
        }
        else {
            throw new Error('Invalid rgb/a string: ' + string);
        }
    };
    /**
     * Creates a new instance of Color from a hex string
     *
     * @param hex  CSS color string of the form #ffffff, the alpha component is optional
     */
    Color.fromHex = function (hex) {
        var hexRegEx = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
        var match = null;
        if ((match = hex.match(hexRegEx))) {
            var r = parseInt(match[1], 16);
            var g = parseInt(match[2], 16);
            var b = parseInt(match[3], 16);
            var a = 1;
            if (match[4]) {
                a = parseInt(match[4], 16) / 255;
            }
            return new Color(r, g, b, a);
        }
        else {
            throw new Error('Invalid hex string: ' + hex);
        }
    };
    /**
     * Creates a new instance of Color from hsla values
     *
     * @param h  Hue is represented [0-1]
     * @param s  Saturation is represented [0-1]
     * @param l  Luminance is represented [0-1]
     * @param a  Alpha is represented [0-1]
     */
    Color.fromHSL = function (h, s, l, a) {
        if (a === void 0) { a = 1.0; }
        var temp = new HSLColor(h, s, l, a);
        return temp.toRGBA();
    };
    /**
     * Lightens the current color by a specified amount
     *
     * @param factor  The amount to lighten by [0-1]
     */
    Color.prototype.lighten = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        var temp = HSLColor.fromRGBA(this.r, this.g, this.b, this.a);
        temp.l += (1 - temp.l) * factor;
        return temp.toRGBA();
    };
    /**
     * Darkens the current color by a specified amount
     *
     * @param factor  The amount to darken by [0-1]
     */
    Color.prototype.darken = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        var temp = HSLColor.fromRGBA(this.r, this.g, this.b, this.a);
        temp.l -= temp.l * factor;
        return temp.toRGBA();
    };
    /**
     * Saturates the current color by a specified amount
     *
     * @param factor  The amount to saturate by [0-1]
     */
    Color.prototype.saturate = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        var temp = HSLColor.fromRGBA(this.r, this.g, this.b, this.a);
        temp.s += temp.s * factor;
        return temp.toRGBA();
    };
    /**
     * Desaturates the current color by a specified amount
     *
     * @param factor  The amount to desaturate by [0-1]
     */
    Color.prototype.desaturate = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        var temp = HSLColor.fromRGBA(this.r, this.g, this.b, this.a);
        temp.s -= temp.s * factor;
        return temp.toRGBA();
    };
    /**
     * Multiplies a color by another, results in a darker color
     *
     * @param color  The other color
     */
    Color.prototype.multiply = function (color) {
        var newR = (((color.r / 255) * this.r) / 255) * 255;
        var newG = (((color.g / 255) * this.g) / 255) * 255;
        var newB = (((color.b / 255) * this.b) / 255) * 255;
        var newA = color.a * this.a;
        return new Color(newR, newG, newB, newA);
    };
    /**
     * Screens a color by another, results in a lighter color
     *
     * @param color  The other color
     */
    Color.prototype.screen = function (color) {
        var color1 = color.invert();
        var color2 = color.invert();
        return color1.multiply(color2).invert();
    };
    /**
     * Inverts the current color
     */
    Color.prototype.invert = function () {
        return new Color(255 - this.r, 255 - this.g, 255 - this.b, 1.0 - this.a);
    };
    /**
     * Averages the current color with another
     *
     * @param color  The other color
     */
    Color.prototype.average = function (color) {
        var newR = (color.r + this.r) / 2;
        var newG = (color.g + this.g) / 2;
        var newB = (color.b + this.b) / 2;
        var newA = (color.a + this.a) / 2;
        return new Color(newR, newG, newB, newA);
    };
    Color.prototype.equal = function (color) {
        return this.toString() === color.toString();
    };
    /**
     * Returns a CSS string representation of a color.
     *
     * @param format Color representation, accepts: rgb, hsl, or hex
     */
    Color.prototype.toString = function (format) {
        if (format === void 0) { format = 'rgb'; }
        switch (format) {
            case 'rgb':
                return this.toRGBA();
            case 'hsl':
                return this.toHSLA();
            case 'hex':
                return this.toHex();
            default:
                throw new Error('Invalid Color format');
        }
    };
    /**
     * Returns Hex Value of a color component
     * @param c color component
     * @see https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     */
    Color.prototype._componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    /**
     * Return Hex representation of a color.
     */
    Color.prototype.toHex = function () {
        return '#' + this._componentToHex(this.r) + this._componentToHex(this.g) + this._componentToHex(this.b);
    };
    /**
     * Return RGBA representation of a color.
     */
    Color.prototype.toRGBA = function () {
        var result = String(this.r.toFixed(0)) + ', ' + String(this.g.toFixed(0)) + ', ' + String(this.b.toFixed(0));
        if (this.a !== undefined || this.a !== null) {
            return 'rgba(' + result + ', ' + String(this.a) + ')';
        }
        return 'rgb(' + result + ')';
    };
    /**
     * Return HSLA representation of a color.
     */
    Color.prototype.toHSLA = function () {
        return HSLColor.fromRGBA(this.r, this.g, this.b, this.a).toString();
    };
    /**
     * Returns a CSS string representation of a color.
     */
    Color.prototype.fillStyle = function () {
        return this.toString();
    };
    /**
     * Returns a clone of the current color.
     */
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b, this.a);
    };
    Object.defineProperty(Color, "Black", {
        /**
         * Black (#000000)
         */
        get: function () {
            return Color.fromHex('#000000');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "White", {
        /**
         * White (#FFFFFF)
         */
        get: function () {
            return Color.fromHex('#FFFFFF');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Gray", {
        /**
         * Gray (#808080)
         */
        get: function () {
            return Color.fromHex('#808080');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "LightGray", {
        /**
         * Light gray (#D3D3D3)
         */
        get: function () {
            return Color.fromHex('#D3D3D3');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "DarkGray", {
        /**
         * Dark gray (#A9A9A9)
         */
        get: function () {
            return Color.fromHex('#A9A9A9');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Yellow", {
        /**
         * Yellow (#FFFF00)
         */
        get: function () {
            return Color.fromHex('#FFFF00');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Orange", {
        /**
         * Orange (#FFA500)
         */
        get: function () {
            return Color.fromHex('#FFA500');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Red", {
        /**
         * Red (#FF0000)
         */
        get: function () {
            return Color.fromHex('#FF0000');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Vermilion", {
        /**
         * Vermilion (#FF5B31)
         */
        get: function () {
            return Color.fromHex('#FF5B31');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Rose", {
        /**
         * Rose (#FF007F)
         */
        get: function () {
            return Color.fromHex('#FF007F');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Magenta", {
        /**
         * Magenta (#FF00FF)
         */
        get: function () {
            return Color.fromHex('#FF00FF');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Violet", {
        /**
         * Violet (#7F00FF)
         */
        get: function () {
            return Color.fromHex('#7F00FF');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Blue", {
        /**
         * Blue (#0000FF)
         */
        get: function () {
            return Color.fromHex('#0000FF');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Azure", {
        /**
         * Azure (#007FFF)
         */
        get: function () {
            return Color.fromHex('#007FFF');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Cyan", {
        /**
         * Cyan (#00FFFF)
         */
        get: function () {
            return Color.fromHex('#00FFFF');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Viridian", {
        /**
         * Viridian (#59978F)
         */
        get: function () {
            return Color.fromHex('#59978F');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Green", {
        /**
         * Green (#00FF00)
         */
        get: function () {
            return Color.fromHex('#00FF00');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Chartreuse", {
        /**
         * Chartreuse (#7FFF00)
         */
        get: function () {
            return Color.fromHex('#7FFF00');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "Transparent", {
        /**
         * Transparent (#FFFFFF00)
         */
        get: function () {
            return Color.fromHex('#FFFFFF00');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "ExcaliburBlue", {
        /**
         * ExcaliburBlue (#176BAA)
         */
        get: function () {
            return Color.fromHex('#176BAA');
        },
        enumerable: false,
        configurable: true
    });
    return Color;
}());
exports.Color = Color;
/**
 * Internal HSL Color representation
 *
 * http://en.wikipedia.org/wiki/HSL_and_HSV
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 */
var HSLColor = /** @class */ (function () {
    function HSLColor(h, s, l, a) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }
    HSLColor.hue2rgb = function (p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    };
    HSLColor.fromRGBA = function (r, g, b, a) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s;
        var l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return new HSLColor(h, s, l, a);
    };
    HSLColor.prototype.toRGBA = function () {
        var r, g, b;
        if (this.s === 0) {
            r = g = b = this.l; // achromatic
        }
        else {
            var q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s;
            var p = 2 * this.l - q;
            r = HSLColor.hue2rgb(p, q, this.h + 1 / 3);
            g = HSLColor.hue2rgb(p, q, this.h);
            b = HSLColor.hue2rgb(p, q, this.h - 1 / 3);
        }
        return new Color(r * 255, g * 255, b * 255, this.a);
    };
    HSLColor.prototype.toString = function () {
        var h = this.h.toFixed(0), s = this.s.toFixed(0), l = this.l.toFixed(0), a = this.a.toFixed(0);
        return "hsla(".concat(h, ", ").concat(s, ", ").concat(l, ", ").concat(a, ")");
    };
    return HSLColor;
}());
