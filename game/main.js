"use strict";
exports.__esModule = true;
var path = require("path");
var electron_1 = require("electron");
var isDev = process.env.NODE_ENV !== 'development';
function createMainWindow() {
    var mainWindow = new electron_1.BrowserWindow({
        title: "World Map Warfare",
        fullscreen: true
    });
    //open dev tools if in developer mode
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
    mainWindow.setMenuBarVisibility(false);
}
;
electron_1.app.whenReady().then(function () {
    createMainWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform == 'darwin') {
        electron_1.app.quit();
    }
    else if (process.platform == 'win32') {
        electron_1.app.quit();
    }
});
