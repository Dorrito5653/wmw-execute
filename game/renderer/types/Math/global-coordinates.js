"use strict";
exports.__esModule = true;
exports.GlobalCoordinates = void 0;
var vector_1 = require("./vector");
var GlobalCoordinates = /** @class */ (function () {
    function GlobalCoordinates(worldPos, pagePos, screenPos) {
        this.worldPos = worldPos;
        this.pagePos = pagePos;
        this.screenPos = screenPos;
    }
    GlobalCoordinates.fromPagePosition = function (xOrPos, yOrEngine, engineOrUndefined) {
        var pageX;
        var pageY;
        var pagePos;
        var engine;
        if (arguments.length === 3) {
            pageX = xOrPos;
            pageY = yOrEngine;
            pagePos = new vector_1.Vector(pageX, pageY);
            engine = engineOrUndefined;
        }
        else {
            pagePos = xOrPos;
            pageX = pagePos.x;
            pageY = pagePos.y;
            engine = yOrEngine;
        }
        var screenPos = engine.screen.pageToScreenCoordinates(pagePos);
        var worldPos = engine.screen.screenToWorldCoordinates(screenPos);
        return new GlobalCoordinates(worldPos, pagePos, screenPos);
    };
    return GlobalCoordinates;
}());
exports.GlobalCoordinates = GlobalCoordinates;
