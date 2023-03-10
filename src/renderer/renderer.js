
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

if(typeof incognito == 'undefined')
    browserTabManager.addTab("New Tab", "", "browser",false);
else
    browserTabManager.addTab("New Tab", "", "browser",incognito);


$('#add-tab').on('click', function () {
    browserTabManager.addTab("New Tab", "", "browser");
});

$('#mainSearch').on('keydown', function (event) {
    if (event.key === "Enter") {
        searchURL(this.value);
    }
});

function searchURL(url) {
    activeWebView = helper.getActiveWebView();
    if (helper.validURL(url)) {
        var correctURL = helper.correctURL(url);
        activeWebView.loadURL(correctURL);
        loading(activeWebView);
    }
    else {
        activeWebView.loadURL(`https://search.wanroi.com/web?q=${url}`);
        loading(activeWebView);
    }
}

function openCustomTab(tabName) {
    browserTabManager.addTab(tabName, "", tabName);
}
function loading(activeWebView) {
    if(activeWebView.isLoading())
    { mainReload.innerHTML =  '<i class="fa-solid fa-xmark"></i>';
    setTimeout(function(){
        loading(activeWebView)
    }, 500); 
    }
    else
    {
        mainPrevious.innerHTML =  '<i class="fa-solid fa-arrow-left"  style="color: #333;"></i>';
        mainReload.innerHTML =  '<i class="fa-solid fa-rotate-right"></i>';
    } 
}
function reloadAndRefreshSearch(activeWebView) {
   
   loading(activeWebView);
   mainSearch.value = activeWebView.getURL();
   if(mainSearch.value == "https://search.wanroi.com/")
   {
        mainSearch.value = "";
   }
   fadeForwardBackward(activeWebView);
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
    //  console.log(helper.getActiveWebView().getURL());
});

mainReload.addEventListener("click", e => {
   activeWebView = helper.getActiveWebView();
   activeWebView.reload();
   reloadAndRefreshSearch(activeWebView)
});

mainPrevious.addEventListener("click", e => {

    activeWebView = helper.getActiveWebView();
    if(activeWebView.canGoBack())
    {
        activeWebView.goBack();
        loading(activeWebView);
        setTimeout(async () => {
            reloadAndRefreshSearch(activeWebView)
           }, 2000);
        
        mainFarward.innerHTML =  '<i class="fa-solid fa-arrow-right"  style="color: #333;"></i>';
        if(activeWebView.canGoBack())
        {
            mainPrevious.innerHTML =  '<i class="fa-solid fa-arrow-left"  style="color: #9ea3ab;"></i>';
        }
    }
    else{
        mainPrevious.innerHTML =  '<i class="fa-solid fa-arrow-left"  style="color: #9ea3ab;"></i>';
    }
    
});

mainFarward.addEventListener("click", e => {
   activeWebView = helper.getActiveWebView();
    if(activeWebView.canGoForward())
    {
        activeWebView.goForward();
        loading(activeWebView);
        setTimeout(async () => {
            reloadAndRefreshSearch(activeWebView)
           }, 2000);

    }
    
});

function fadeForwardBackward(activeWebView) {
    if(!(activeWebView.canGoForward()))
    {
        mainFarward.innerHTML =  '<i class="fa-solid fa-arrow-right" style="color: #9ea3ab;"></i>';
    }
    if(!(activeWebView.canGoBack()))
    {
        mainPrevious.innerHTML =  '<i class="fa-solid fa-arrow-left" style="color: #9ea3ab;"></i>';
    }
}
function changeUrlOnActiveWebViewChange() { 
   
    activeWebView =  helper.getActiveWebView();
    reloadAndRefreshSearch(activeWebView);
}