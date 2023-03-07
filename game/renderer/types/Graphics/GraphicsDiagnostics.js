"use strict";
exports.__esModule = true;
exports.GraphicsDiagnostics = void 0;
var GraphicsDiagnostics = /** @class */ (function () {
    function GraphicsDiagnostics() {
    }
    GraphicsDiagnostics.clear = function () {
        GraphicsDiagnostics.DrawCallCount = 0;
        GraphicsDiagnostics.DrawnImagesCount = 0;
    };
    GraphicsDiagnostics.DrawCallCount = 0;
    GraphicsDiagnostics.DrawnImagesCount = 0;
    return GraphicsDiagnostics;
}());
exports.GraphicsDiagnostics = GraphicsDiagnostics;
