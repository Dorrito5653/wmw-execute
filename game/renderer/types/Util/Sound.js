"use strict";
exports.__esModule = true;
exports.canPlayFile = void 0;
var Log_1 = require("./Log");
/**
 * Whether or not the browser can play this file as HTML5 Audio
 */
function canPlayFile(file) {
    try {
        var a = new Audio();
        var filetype = /.*\.([A-Za-z0-9]+)$/;
        var type = file.match(filetype)[1];
        if (a.canPlayType('audio/' + type)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        Log_1.Logger.getInstance().warn('Cannot determine audio support, assuming no support for the Audio Tag', e);
        return false;
    }
}
exports.canPlayFile = canPlayFile;
