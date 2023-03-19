let activeWebView = undefined;

loadstart = () => {
    console.log('loading...');
}
loadstop = () => {
    console.log('done');
}
did_finish_load = () => {
    if (typeof activeWebView === 'undefined')
        return;
    else
        $('#mainSearch').val(activeWebView.getURL());

    browserTabManager.updateTab(browserTabManager.getCurrent().activeTab, { favicon: "https://s2.googleusercontent.com/s2/favicons?domain_url=" + activeWebView.getURL() + "" });
}
page_favicon_updated = (res) => {
    console.log(res.favicons)
}


document.addEventListener("DOMContentLoaded", () => {
    refreshBookMarkSection();
});

if (typeof incognito == 'undefined') {
    browserTabManager.addTab("New Tab", "./assets/icons/venroi.png", "browser", false);
    $('.chrome-tab-favicon').attr('hidden', false);
}
else {
    browserTabManager.addTab("New Tab", "../../assets/icons/venroi.png", "browser", incognito);
    $('.chrome-tab-favicon').attr('hidden', false);
}



$('#add-tab').on('click', function () {
    if (typeof incognito == 'undefined') {
        browserTabManager.addTab("New Tab", "./assets/icons/tab-favicon.png", "browser", false);
        //$('.chrome-tab-favicon').attr('hidden',false);
    }
    else {
        browserTabManager.addTab("New Tab", "../../assets/icons/tab-favicon.png", "browser", incognito);
        //$('.chrome-tab-favicon').attr('hidden',false);
    }
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
        var d = new Date();
        console.log(addHistoryJson(correctURL, d));
        loading(activeWebView);
        bookmarkCheck(activeWebView)
    }
    else {
        activeWebView.loadURL(`https://search.wanroi.com/web?q=${url}`);
        console.log(addHistoryJson(correctURL, d));
        loading(activeWebView);
        bookmarkCheck(activeWebView)
    }
}

function openCustomTab(tabName) {
    browserTabManager.addTab(tabName, "", tabName);
}
function loading(activeWebView) {
    if (activeWebView.isLoading()) {
        mainReload.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        setTimeout(function () {
            loading(activeWebView)
        }, 500);
    }
    else {
        mainPrevious.innerHTML = '<i class="fa-solid fa-arrow-left"  style="color: #333;"></i>';
        mainReload.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
    }
}
function reloadAndRefreshSearch(activeWebView) {

    loading(activeWebView);
    mainSearch.value = activeWebView.getURL();
    if (mainSearch.value == "https://search.wanroi.com/") {
        mainSearch.value = "";
    }
    fadeForwardBackward(activeWebView);
    bookmarkCheck(activeWebView);

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
    if (activeWebView.canGoBack()) {
        activeWebView.goBack();
        loading(activeWebView);
        setTimeout(async () => {
            reloadAndRefreshSearch(activeWebView)
        }, 2000);

        mainFarward.innerHTML = '<i class="fa-solid fa-arrow-right"  style="color: #333;"></i>';
        if (activeWebView.canGoBack()) {
            mainPrevious.innerHTML = '<i class="fa-solid fa-arrow-left"  style="color: #9ea3ab;"></i>';
        }
    }
    else {
        mainPrevious.innerHTML = '<i class="fa-solid fa-arrow-left"  style="color: #9ea3ab;"></i>';
    }

});

mainFarward.addEventListener("click", e => {
    activeWebView = helper.getActiveWebView();
    if (activeWebView.canGoForward()) {
        activeWebView.goForward();
        loading(activeWebView);
        setTimeout(async () => {
            reloadAndRefreshSearch(activeWebView)
        }, 2000);

    }

});

function fadeForwardBackward(activeWebView) {
    if (!(activeWebView.canGoForward())) {
        mainFarward.innerHTML = '<i class="fa-solid fa-arrow-right" style="color: #9ea3ab;"></i>';
    }
    if (!(activeWebView.canGoBack())) {
        mainPrevious.innerHTML = '<i class="fa-solid fa-arrow-left" style="color: #9ea3ab;"></i>';
    }
}
function changeUrlOnActiveWebViewChange() {

    try {
        activeWebView = helper.getActiveWebView();
        reloadAndRefreshSearch(activeWebView);
    }
    catch (e) {
    }
    try {
        callingRendererFunctionForHistory();
    }
    catch (e) {
    }
    try {
        callingRendererFunctionForBookmarks();
    }
    catch (e) {
    }

}

mainBookmark.addEventListener("click", e => {
    activeBookmarkPopup();
    mainBookmark.innerHTML = '<i class="fa-solid fa-star" style="color: #1A73E8;"></i>';
    console.log(addBookMarkJson(changeUrlFromSearchToBookMarkInput()))
    //saveBookMarkJson(); getBookMarkJsonArray()
    // console.log(getBookMarkJsonArray());
    // console.log(addBookMarkJson("https://search.hahahahahahahah.com/"));
});
removeBookmarkButton.addEventListener("click", e => {
    console.log(removeBookMarkJson(inputBookmarkWindow.value));
});

// function saveBookMarkJson()
// {
// // json data
// var jsonData = '{"table": [{"url": "https://search.wanroi2.com/"},{"url": "https://search.wanroi3.com/web?q=fb"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://www.facebook.com/"}]}';

// // parse json
// var jsonObj = JSON.parse(jsonData);
// console.log(jsonObj);

// // stringify JSON Object
// var jsonContent = JSON.stringify(jsonObj);
// console.log(jsonContent);

// fs.writeFile("bookmark.json", jsonContent, 'utf8', function (err) {
//     if (err) {
//         console.log("An error occured while writing JSON Object to File.");
//         return console.log(err);
//     }

//     console.log("JSON file has been saved.");
// });

// }


function addBookMarkJson(url) {
    //read File
    let dataFromFile = fs.readFileSync('bookmark.json');
    //var jsonData = JSON.parse(dataFromFile);
    //console.log(jsonData);
    // json data
    //var jsonData = '{"table": [{"url": "https://search.wanroi2.com/"},{"url": "https://search.wanroi3.com/web?q=fb"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://www.facebook.com/"}]}';

    // parse json
    //var jsonObj = JSON.parse(jsonData);
    var jsonObj = JSON.parse(dataFromFile);
    var obj = { "url": url };


    var existUrl = false;
    for (let i = 0; i < jsonObj.table.length; i++) {
        if (url == jsonObj.table[i].url) {
            existUrl = true;
        }
    }
    if (existUrl) { return "This url already exists in bookmark."; }

    jsonObj.table.push(obj);
    // console.log(x);

    //stringify JSON Object
    var jsonContent = JSON.stringify(jsonObj);
    //console.log(jsonContent);

    fs.writeFile("bookmark.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return "An error occured while writing JSON Object to File.";
        }
        refreshBookMarkSection()
        return "Bookmark URL has been added.";
    });
    refreshBookMarkSection()
    return "Bookmark URL has been added.";

}

function removeBookMarkJson(url) {

    let dataFromFile = fs.readFileSync('bookmark.json');
    var jsonObj = JSON.parse(dataFromFile);
    var obj = { "url": url };
    var existUrl = false;
    for (let i = 0; i < jsonObj.table.length; i++) {
        if (url == jsonObj.table[i].url) {
            existUrl = true;
        }
    }
    if (existUrl) {
        jsonObj.table = jsonObj.table.filter(obj => obj.url != url);
    }
    else { return "Bookmark Not Found" }

    var jsonContent = JSON.stringify(jsonObj);
    //console.log(jsonContent);

    fs.writeFile("bookmark.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return "An error occured while writing JSON Object to File.";
        }
        mainBookmark.innerHTML = '<i class="fa-sharp fa-regular fa-star"></i>';
        return "Removed Bookmark successfully";
    });
    mainBookmark.innerHTML = '<i class="fa-sharp fa-regular fa-star"></i>';
    return "Removed Bookmark successfully";
}



function getBookMarkJsonArray() {
    let dataFromFile = fs.readFileSync('bookmark.json');
    var jsonObj = JSON.parse(dataFromFile);
    return jsonObj
}

function refreshBookMarkSection() {
    let dataFromFile = fs.readFileSync('bookmark.json');
    var jsonObj = JSON.parse(dataFromFile);
    divBookmarkSection.innerHTML = '';
    for (let i = 0; i < jsonObj.table.length; i++) {
        var url = jsonObj.table[i].url;
        var domain = helper.getDomain(url);
        var str = domain;
        var end = str.lastIndexOf('.');

        divBookmarkSection.innerHTML += '<div class="bookmarks-item" data-url="' + url +
            '" onclick="loadURL(this)">' +
            '<img src="https://s2.googleusercontent.com/s2/favicons?domain_url=' + url + '" alt="./assets/icons/bookmarks/page-64.png" />' +
            str.substring(0, end) + '</div>';
    }
}
function callingRendererFunctionForBookmarks(){
    const containerHistoryCard = document.getElementById("tabs-content-container-for-bookmark-items");
    let dataFromFile = fs.readFileSync('bookmark.json');
    var jsonObj = JSON.parse(dataFromFile);
    containerHistoryCard.innerHTML = '';
    for (let i = 0; i < jsonObj.table.length; i++) {
        var url = jsonObj.table[i].url;
        var domain = helper.getDomain(url);
        var str = domain;
        var end = str.lastIndexOf('.');

        containerHistoryCard.innerHTML += '<div class="history-item">'+
        '<div class="fav-title">'+
        '    <span class="favicon"><img src="https://s2.googleusercontent.com/s2/favicons?domain_url='+url+' /></span>'+
        '    <span class="url">' + str.substring(0, end) + '</span>'+
        '</div>'+
        '<div class="options">'+
        '   <span class="options-popup" onclick="showBookmarkOption(this);"><i class="fa-solid fa-ellipsis"></i></span>'+
        '    <div class="history-action-popup">'+
        '        <div class="history-popup-container">'+
        '            <a href="javascript:void(9);" data-url="'+url+'" onclick="deleteBookmarkItem(this);">Delete</a>'+
        '        </div>'+
        '    </div>'+
        '</div>'+
        '</div>';
    }
}
function callingRendererFunctionForHistory() {
    const containerHistoryCard = document.getElementById("tabs-content-container-for-history-card");
    let dataFromFile = fs.readFileSync('history.json');
    var jsonObj = JSON.parse(dataFromFile);
    containerHistoryCard.innerHTML = '';
    for (let i = 0; i < jsonObj.table.length; i++) {
        var url = jsonObj.table[i].url;
        var domain = helper.getDomain(url);
        var str = domain;
        var end = str.lastIndexOf('.');

        containerHistoryCard.innerHTML += '<div class="history-card">' +
            '     <h5>' + jsonObj.table[i].time + '</h5>' +
            '     <div class="history-item">' +
            '         <div class="check-time">' +
            '             <span class="checkbox">' +
            '                 <label class="checkbox-container">' +
            '                     <input type="checkbox" checked="checked">' +
            '                     <span class="checkmark"></span>' +
            '                   </label>' +
            '             </span>' +
            '             <span class="tiem">' + jsonObj.table[i].time + '</span>' +
            '         </div>' +
            '         <div class="fav-title">' +
            '             <span class="favicon"><img src="https://s2.googleusercontent.com/s2/favicons?domain_url=' + url + ' alt="./assets/icons/venroi.png" /></span>' +
            '             <span class="title"><a href="javascript:void(0)">' + str.substring(0, end) + '</a></span>' +
            '             <span class="url">' + url + '</span>' +
            '         </div>' +
            '         <div class="options">' +
            '             <span class="options-popup" onclick="showHistoryOption(this);"><i class="fa-solid fa-ellipsis"></i></span>' +
            '                <div class="history-action-popup">' +
            '                    <div class="history-popup-container">' +
            '                        <a href="javascript:void(9);" data-url="'+url+'" data-time="'+jsonObj.table[i].time+'" onclick="deleteHistoryItem(this);">Delete</a>' +
            '                    </div>' +
            '                </div>' +
            '         </div>' +
            '     </div>' +
            ' </div>';
    }
}

function addHistoryJson(url, time) {

    let dataFromFile = fs.readFileSync(path.join(__dirname, '/../../history.json'));

    var jsonObj = JSON.parse(dataFromFile);
    var obj = { "url": url, "time": time };


    var existUrl = false;
    for (let i = 0; i < jsonObj.table.length; i++) {
        if (url == jsonObj.table[i].url && jsonObj.table[i].time == time) {
            existUrl = true;
        }
    }
    if (existUrl) { return "This url already exists in history."; }

    jsonObj.table.push(obj);

    var jsonContent = JSON.stringify(jsonObj);

    fs.writeFile("history.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return "An error occured while writing JSON Object to File.";
        }
        return "History URL has been added.";
    });
    return "History URL has been added.";
}

function activeBookmarkPopup() {
    $(".sharenbookmark").toggleClass("active-bookmark-popup");
    if ($(".active-share-popup")) {
        $(".sharenbookmark").removeClass("active-share-popup")
    }
}

function changeUrlFromSearchToBookMarkInput() {
    if (mainSearch.value == "") {
        inputBookmarkWindow.value = "https://search.wanroi.com/";
    }
    else {
        if (helper.validURL(mainSearch.value)) {
            inputBookmarkWindow.value = mainSearch.value;
        }
        else {
            inputBookmarkWindow.value = `https://search.wanroi.com/web?q=${mainSearch.value}`;
        }
    }
    return inputBookmarkWindow.value;
}

function bookmarkCheck(activeWebView) {
    var url = activeWebView.getURL();
    let dataFromFile = fs.readFileSync(path.join(__dirname, '/../../bookmark.json'));
    var jsonObj = JSON.parse(dataFromFile);

    var existUrl = false;
    for (let i = 0; i < jsonObj.table.length; i++) {
        if (url == jsonObj.table[i].url) {
            existUrl = true;
        }
    }
    if (existUrl) {
        mainBookmark.innerHTML = '<i class="fa-solid fa-star" style="color: #1A73E8;"></i>';
    }
    else {
        mainBookmark.innerHTML = '<i class="fa-sharp fa-regular fa-star"></i>';
    }
    changeUrlFromSearchToBookMarkInput();
    changeSharePopupData();

}
function changeSharePopupData() {
    sharePopupUrl.innerHTML = inputBookmarkWindow.value;
    sharePopupImg.src = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + inputBookmarkWindow.value;
    var domain = helper.getDomain(inputBookmarkWindow.value);
    var str = domain;
    var end = str.lastIndexOf('.');
    sharePopupName.innerHTML = str.substring(0, end).toUpperCase();
    // letdomain = inputBookmarkWindow.value.replace('www.','');
    // const myArray = domain.split(".");
    // let word = myArray[0];
    // sharePopupName.innerHTML = word.toUpperCase();
    // add code here for the title

}
function copyToClipboard() {
    navigator.clipboard.writeText(sharePopupUrl.innerHTML);
    activeSharePopup();

}
function activeSharePopup() {
    $(".sharenbookmark").toggleClass("active-share-popup");
    if ($(".active-bookmark-popup")) {
        $(".sharenbookmark").removeClass("active-bookmark-popup")
    }
}

function saveAs() {
    sharePopupBtnSave.href = sharePopupUrl.innerHTML;
    var blob = new Blob([$("html").html()], { type: "text/html;charset=utf-8" });
    saveAs(blob, "page.html");
}

function loadURL(element) {

}