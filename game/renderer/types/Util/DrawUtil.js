"use strict";
exports.__esModule = true;
exports.circle = exports.roundRect = exports.vector = exports.point = exports.line = void 0;
var Color_1 = require("../Color");
/* istanbul ignore next */
/**
 * Draw a line on canvas context
 *
 * @param ctx The canvas context
 * @param color The color of the line
 * @param x1 The start x coordinate
 * @param y1 The start y coordinate
 * @param x2 The ending x coordinate
 * @param y2 The ending y coordinate
 * @param thickness The line thickness
 * @param cap The [[LineCapStyle]] (butt, round, or square)
 */
function line(ctx, color, x1, y1, x2, y2, thickness, cap) {
    if (color === void 0) { color = Color_1.Color.Red; }
    if (thickness === void 0) { thickness = 1; }
    if (cap === void 0) { cap = 'butt'; }
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = cap;
    ctx.strokeStyle = color.toString();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}
exports.line = line;
/* istanbul ignore next */
/**
 * Draw the vector as a point onto the canvas.
 */
function point(ctx, color, point) {
    if (color === void 0) { color = Color_1.Color.Red; }
    ctx.beginPath();
    ctx.strokeStyle = color.toString();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
}
exports.point = point;
/**
 * Draw the vector as a line onto the canvas starting a origin point.
 */
/* istanbul ignore next */
/**
 *
 */
function vector(ctx, color, origin, vector, scale) {
    if (scale === void 0) { scale = 1.0; }
    var c = color ? color.toString() : 'blue';
    var v = vector.scale(scale);
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + v.x, origin.y + v.y);
    ctx.closePath();
    ctx.stroke();
}
exports.vector = vector;
/**
 * Draw a round rectangle on a canvas context
 *
 * @param ctx The canvas context
 * @param x The top-left x coordinate
 * @param y The top-left y coordinate
 * @param width The width of the rectangle
 * @param height The height of the rectangle
 * @param radius The border radius of the rectangle
 * @param stroke The [[Color]] to stroke rectangle with
 * @param fill The [[Color]] to fill rectangle with
 */
function roundRect(ctx, x, y, width, height, radius, stroke, fill) {
    if (radius === void 0) { radius = 5; }
    if (stroke === void 0) { stroke = Color_1.Color.White; }
    if (fill === void 0) { fill = null; }
    var br;
    if (typeof radius === 'number') {
        br = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var prop in defaultRadius) {
            if (defaultRadius.hasOwnProperty(prop)) {
                var side = prop;
                br[side] = radius[side] || defaultRadius[side];
            }
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + br.tl, y);
    ctx.lineTo(x + width - br.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + br.tr);
    ctx.lineTo(x + width, y + height - br.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - br.br, y + height);
    ctx.lineTo(x + br.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - br.bl);
    ctx.lineTo(x, y + br.tl);
    ctx.quadraticCurveTo(x, y, x + br.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill.toString();
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = stroke.toString();
        ctx.stroke();
    }
}
exports.roundRect = roundRect;
/**
 *
 */
function circle(ctx, x, y, radius, stroke, fill) {
    if (stroke === void 0) { stroke = Color_1.Color.White; }
    if (fill === void 0) { fill = null; }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill.toString();
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = stroke.toString();
        ctx.stroke();
    }
}
exports.circle = circle;
