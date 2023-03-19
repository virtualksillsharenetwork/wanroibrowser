const remote = require('@electron/remote/main')
remote.initialize()
const { app, ipcMain,Menu, BrowserWindow } = require('electron')
const {getMenuTemplate} = require('./src/menus/menu-templates')
const path = require('path');
require('./env');
const fs = require('fs');

let allWindows = new Set();


function checkJsonFiles(){
    if (!fs.existsSync(path.join(__dirname, 'history.json'))) {
        try {
            const content = '{"table":[]}';
            fs.writeFileSync('history.json', content);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
    }
    if (!fs.existsSync(path.join(__dirname, 'bookmark.json'))) {
        try {
            const content = '{"table":[{"url": "https://search.wanroi.com/"}]}';
            fs.writeFileSync('bookmark.json', content);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
    }
}
checkJsonFiles();
function createWindow(winTit,loadFile) {
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        webviewTag: true,
        frame: false,
        icon: path.join(__dirname, "/assets/icons/wanroi512Round.png"),
        center: true,
        minHeight: 600,
        minWidth: 800,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    window.name = winTit;
    window.maximize()
    remote.enable(window.webContents)
    window.removeMenu(true);
    window.loadFile(loadFile);
    window.webContents.openDevTools();
    window.webContents.session.clearCache(() => {
        window.webContents.session.clearStorageData()
        alert('cache is cleared')
       })
    let menu = null;
    if(window.name == 'main'){
        menu = Menu.buildFromTemplate(getMenuTemplate('mainMenu',window.webContents));
    }
    if(window.name == 'incognito'){
        menu = Menu.buildFromTemplate(getMenuTemplate('incognitoMenu',window.webContents));
    }
    window.setMenu(menu);
    allWindows.add(window);
}

app.whenReady().then(() => {
    createWindow('main','index.html')
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow('main','index.html')
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


ipcMain.on(`display-app-menu`, function (e, args) {
    const window = BrowserWindow.fromWebContents(e.sender);
    let menu = null;
    if(window.name == 'main'){
        menu = Menu.buildFromTemplate(getMenuTemplate('mainMenu',window.webContents));
    }
    if(window.name == 'incognito'){
        menu = Menu.buildFromTemplate(getMenuTemplate('incognitoMenu',window.webContents));
    }
    menu.popup({
        window: window,
        x: args.x,
        y: args.y
    });
});
//window controls
ipcMain.on(`minimize-window`, function (e, args) {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window.minimizable) {
        window.minimize();
    }
});
ipcMain.on(`maximize-window`, function (e, args) {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window.maximizable) {
        window.maximize();
    }
});
ipcMain.on(`unmaximize-window`, function (e, args) {
    const window = BrowserWindow.fromWebContents(e.sender);
    window.unmaximize();
});
ipcMain.on(`max-unmax-window`, function (e, args) {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
});
ipcMain.on(`close-window`, function (e, args) {
    const window = BrowserWindow.fromWebContents(e.sender);
    window.close();
});
ipcMain.on(`is-window-maximized`, function (e, args) {
    const window = BrowserWindow.fromWebContents(e.sender);
    return window.isMaximized();
});
ipcMain.on(`open-incognito-window`, function (e, args) {
    createWindow('incognito',path.join(__dirname, "/src/pages/index-incognito.html"));
});
