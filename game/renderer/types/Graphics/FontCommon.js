"use strict";
exports.__esModule = true;
exports.Direction = exports.FontStyle = exports.BaseAlign = exports.TextAlign = exports.FontUnit = void 0;
/**
 * Enum representing the different font size units
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
 */
var FontUnit;
(function (FontUnit) {
    /**
     * Em is a scalable unit, 1 em is equal to the current font size of the current element, parent elements can effect em values
     */
    FontUnit["Em"] = "em";
    /**
     * Rem is similar to the Em, it is a scalable unit. 1 rem is equal to the font size of the root element
     */
    FontUnit["Rem"] = "rem";
    /**
     * Pixel is a unit of length in screen pixels
     */
    FontUnit["Px"] = "px";
    /**
     * Point is a physical unit length (1/72 of an inch)
     */
    FontUnit["Pt"] = "pt";
    /**
     * Percent is a scalable unit similar to Em, the only difference is the Em units scale faster when Text-Size stuff
     */
    FontUnit["Percent"] = "%";
})(FontUnit = exports.FontUnit || (exports.FontUnit = {}));
/**
 * Enum representing the different horizontal text alignments
 */
var TextAlign;
(function (TextAlign) {
    /**
     * The text is left-aligned.
     */
    TextAlign["Left"] = "left";
    /**
     * The text is right-aligned.
     */
    TextAlign["Right"] = "right";
    /**
     * The text is centered.
     */
    TextAlign["Center"] = "center";
    /**
     * The text is aligned at the normal start of the line (left-aligned for left-to-right locales,
     * right-aligned for right-to-left locales).
     */
    TextAlign["Start"] = "start";
    /**
     * The text is aligned at the normal end of the line (right-aligned for left-to-right locales,
     * left-aligned for right-to-left locales).
     */
    TextAlign["End"] = "end";
})(TextAlign = exports.TextAlign || (exports.TextAlign = {}));
/**
 * Enum representing the different baseline text alignments
 */
var BaseAlign;
(function (BaseAlign) {
    /**
     * The text baseline is the top of the em square.
     */
    BaseAlign["Top"] = "top";
    /**
     * The text baseline is the hanging baseline.  Currently unsupported; this will act like
     * alphabetic.
     */
    BaseAlign["Hanging"] = "hanging";
    /**
     * The text baseline is the middle of the em square.
     */
    BaseAlign["Middle"] = "middle";
    /**
     * The text baseline is the normal alphabetic baseline.
     */
    BaseAlign["Alphabetic"] = "alphabetic";
    /**
     * The text baseline is the ideographic baseline; this is the bottom of
     * the body of the characters, if the main body of characters protrudes
     * beneath the alphabetic baseline.  Currently unsupported; this will
     * act like alphabetic.
     */
    BaseAlign["Ideographic"] = "ideographic";
    /**
     * The text baseline is the bottom of the bounding box.  This differs
     * from the ideographic baseline in that the ideographic baseline
     * doesn't consider descenders.
     */
    BaseAlign["Bottom"] = "bottom";
})(BaseAlign = exports.BaseAlign || (exports.BaseAlign = {}));
/**
 * Enum representing the different possible font styles
 */
var FontStyle;
(function (FontStyle) {
    FontStyle["Normal"] = "normal";
    FontStyle["Italic"] = "italic";
    FontStyle["Oblique"] = "oblique";
})(FontStyle = exports.FontStyle || (exports.FontStyle = {}));
/**
 * Enum representing the text direction, useful for other languages, or writing text in reverse
 */
var Direction;
(function (Direction) {
    Direction["LeftToRight"] = "ltr";
    Direction["RightToLeft"] = "rtl";
})(Direction = exports.Direction || (exports.Direction = {}));
