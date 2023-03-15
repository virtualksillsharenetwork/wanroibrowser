ipcRenderer.on(`history-clicked`, function (e, args) {
    browserTabManager.addTab("History", "", "history");
});
ipcRenderer.on(`bookmark-clicked`, function (e, args) {
    browserTabManager.addTab("Bookmakrs", "", "bookmark");
});
ipcRenderer.on(`new-tab`, function (e, args) {
    if(args.incognito){
        browserTabManager.addTab("New Tab", "../../assets/icons/tab-favicon.png", "browser",true);
    }
    else{
        browserTabManager.addTab("New Tab", "./assets/icons/tab-favicon.png", "browser",false);
    }
});
ipcRenderer.on(`incognito-window`, function (e, args) {
    ipcRenderer.send(`open-incognito-window`);    
});