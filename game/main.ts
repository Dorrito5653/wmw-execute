import * as path from 'path';
import { app, BrowserWindow } from 'electron';

const isDev = process.env.NODE_ENV !== 'development'

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "World Map Warfare",
        icon: "assets/icons/",
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    //open dev tools if in developer mode   
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
                                   
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
    mainWindow.setMenuBarVisibility(false)
}; 

app.whenReady().then(() => {
    createMainWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform == 'darwin') {
        app.quit()
    } else if (process.platform == 'win32') {
        app.quit()
    }
});
