let activeWebView = undefined;

loadstart = () => {
    console.log('loading...');
}
loadstop = () => {
    console.log('done');
}
did_finish_load = () => {
    if (typeof window.activeWebView === 'undefined')
        return;
    else
        $('#mainSearch').val(window.activeWebView.getURL());
}

browserTabManager.addTab("New Tab", "", "browser");

$('#add-tab').on('click', function () {
    browserTabManager.addTab("New Tab", "", "browser");
});

$('#mainSearch').on('keydown', function (event) {
    if (event.key === "Enter") {
        activeWebView = helper.getActiveWebView();
        if (helper.validURL(this.value)) {
            activeWebView.loadURL(this.value);
        }
        else {
            activeWebView.loadURL(`https://search.wanroi.com/web?q=${this.value}`);
        }
    }
});

function openCustomTab(tabName) {
    browserTabManager.addTab(tabName, "", tabName);
}

// document.querySelector('button[data-theme-toggle]').addEventListener('click', _ => {
//     if (el.classList.contains('chrome-tabs-dark-theme')) {
//         el.classList.remove('chrome-tabs-dark-theme')
//     } else {
//         el.classList.add('chrome-tabs-dark-theme')
//     }
// });

menuButton.addEventListener("click", e => {
    window.openMenu(e.x, e.y);
});

minimizeButton.addEventListener("click", e => {
    window.minimizeWindow();
});

maxUnmaxButton.addEventListener("click", e => {
    const icon = maxUnmaxButton.querySelector("i.far");

    window.maxUnmaxWindow();

    // Change the middle maximize-unmaximize icons.
    if (window.isWindowMaximized()) {
        icon.classList.remove("fa-square");
        icon.classList.add("fa-clone");
    } else {
        icon.classList.add("fa-square");
        icon.classList.remove("fa-clone");
    }
});

closeButton.addEventListener("click", e => {
    window.closeWindow();
});