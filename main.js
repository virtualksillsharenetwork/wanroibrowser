const remote = require('@electron/remote/main')
remote.initialize()
const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path');
const { getMenu } = require('./src/menu');
let menu = null;
require('./env');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webviewTag: true,
        frame: false,
        icon: path.join(__dirname, "/assets/icons/venroi.png"),
        center:true,
        minHeight:600,
        minWidth:800,
        webPreferences: {
            preload: path.join(__dirname, "/src/preload.js"),
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    remote.enable(mainWindow.webContents)
    //mainWindow.removeMenu(true);
    mainWindow.loadFile('index.html');
    //mainWindow.webContents.openDevTools();
    // menu = getMenu(mainWindow.webContents);
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

ipcMain.on(`display-app-menu`, function (e, args) {
    if (mainWindow) {
        // menu.popup({
        //     window: mainWindow,
        //     x: args.x,
        //     y: args.y
        // });
    }
});
//window controls
ipcMain.on(`minimize-window`, function (e, args) {
    if (mainWindow.minimizable) {
        mainWindow.minimize();
    }
});
ipcMain.on(`maximize-window`, function (e, args) {
    if (mainWindow.maximizable) {
        mainWindow.maximize();
    }
});
ipcMain.on(`unmaximize-window`, function (e, args) {
    mainWindow.unmaximize();
});
ipcMain.on(`max-unmax-window`, function (e, args) {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});
ipcMain.on(`close-window`, function (e, args) {
    mainWindow.close();
});
ipcMain.on(`is-window-maximized`, function (e, args) {
    return mainWindow.isMaximized();
});
