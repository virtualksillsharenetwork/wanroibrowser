ipcRenderer.on(`history-clicked`, function (e, args) {
    browserTabManager.addTab("History", "", "history");
});
ipcRenderer.on(`new-tab`, function (e, args) {
    browserTabManager.addTab("New Tab", "", "browser");
});
ipcRenderer.on(`incognito-window`, function (e, args) {
    ipcRenderer.send(`open-incognito-window`);    
});