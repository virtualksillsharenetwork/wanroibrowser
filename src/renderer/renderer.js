
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
        var d = new Date();
       // console.log(addHistoryJson(correctURL,d));
        loading(activeWebView);

        bookmarkCheck(activeWebView)
    }
    else {
        activeWebView.loadURL(`https://search.wanroi.com/web?q=${url}`);
        //console.log(addHistoryJson(correctURL,d));
        loading(activeWebView);

        bookmarkCheck(activeWebView)
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

mainBookmark.addEventListener("click", e => {
    activeBookmarkPopup();
    mainBookmark.innerHTML =  '<i class="fa-solid fa-star" style="color: #1A73E8;"></i>';
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


function addBookMarkJson(url)
{
    //read File
let dataFromFile = fs.readFileSync('bookmark.json');
//var jsonData = JSON.parse(dataFromFile);
//console.log(jsonData);
// json data
//var jsonData = '{"table": [{"url": "https://search.wanroi2.com/"},{"url": "https://search.wanroi3.com/web?q=fb"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://search.wanroi.com/"},{"url": "https://www.facebook.com/"}]}';
 
// parse json
//var jsonObj = JSON.parse(jsonData);
var jsonObj = JSON.parse(dataFromFile);
var obj = {"url":url};


var existUrl = false;
for (let i = 0; i < jsonObj.table.length; i++) {
    if(url == jsonObj.table[i].url)
    {
        existUrl = true;
    }
  }
  if(existUrl)
  {return "This url already exists in bookmark.";}
  
  jsonObj.table.push(obj);
// console.log(x);
 
//stringify JSON Object
var jsonContent = JSON.stringify(jsonObj);
//console.log(jsonContent);
 
fs.writeFile("bookmark.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return "An error occured while writing JSON Object to File.";
    }
    return "Bookmark URL has been added.";
});
return "Bookmark URL has been added.";
}

function removeBookMarkJson(url)
{
   
    let dataFromFile = fs.readFileSync('bookmark.json');
    var jsonObj = JSON.parse(dataFromFile);
    var obj = {"url":url};
    var existUrl = false;
    for (let i = 0; i < jsonObj.table.length; i++) {
        if(url == jsonObj.table[i].url)
        {
            existUrl = true;
        }
    }
    if(existUrl)
    {
        jsonObj.table = jsonObj.table.filter(obj => obj.url != url);
    }
    else
    { return "Bookmark Not Found"}
   
    var jsonContent = JSON.stringify(jsonObj);
    //console.log(jsonContent);
    
    fs.writeFile("bookmark.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return "An error occured while writing JSON Object to File.";
        }
        mainBookmark.innerHTML =  '<i class="fa-sharp fa-regular fa-star"></i>';
        return "Removed Bookmark successfully";
    });
    mainBookmark.innerHTML =  '<i class="fa-sharp fa-regular fa-star"></i>';
    return "Removed Bookmark successfully";
}



function getBookMarkJsonArray()
{
    let dataFromFile = fs.readFileSync('bookmark.json');
    var jsonObj = JSON.parse(dataFromFile);
    return jsonObj
}

function refreshBookMarkSection()
{
    let dataFromFile = fs.readFileSync('bookmark.json');
    var jsonObj = JSON.parse(dataFromFile);
    divBookmarkSection.innerHTML = '';
    for (let i = 0; i < jsonObj.table.length; i++) {
        divBookmarkSection.append(''+jsonObj.table[i].url); 
    }
}


function addHistoryJson(url,time)
{
let dataFromFile = fs.readFileSync('history.json');

var jsonObj = JSON.parse(dataFromFile);
var obj = {"url":url,"time":time};


var existUrl = false;
for (let i = 0; i < jsonObj.table.length; i++) {
    var seconds = (time.getTime() - jsonObj.table[i].time.getTime()) / 1000;
    if(!(url == jsonObj.table[i].url && seconds <= 1000))
    {
        existUrl = true;
    }
  }
  if(existUrl)
  {return "This url already exists in history.";}
  
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

function activeBookmarkPopup(){
    $(".sharenbookmark").toggleClass("active-bookmark-popup");
    if($(".active-share-popup")){
        $(".sharenbookmark").removeClass("active-share-popup")
    }
}

function changeUrlFromSearchToBookMarkInput() {
   if(mainSearch.value == "")
    {
        inputBookmarkWindow.value = "https://search.wanroi.com/";
    }
    else 
    {
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
        let dataFromFile = fs.readFileSync('bookmark.json');
        var jsonObj = JSON.parse(dataFromFile);
       
        var existUrl = false;
        for (let i = 0; i < jsonObj.table.length; i++) {
            if(url == jsonObj.table[i].url)
            {
                existUrl = true;
            }
        }
        if(existUrl)
        {
            mainBookmark.innerHTML =  '<i class="fa-solid fa-star" style="color: #1A73E8;"></i>';
        }
        else{
            mainBookmark.innerHTML =  '<i class="fa-sharp fa-regular fa-star"></i>';
        }
        changeUrlFromSearchToBookMarkInput();
        changeSharePopupData();
        
  }
   function changeSharePopupData() {
    sharePopupUrl.innerHTML = inputBookmarkWindow.value;
    sharePopupImg.src = 'https://s2.googleusercontent.com/s2/favicons?domain_url='+inputBookmarkWindow.value;
    // letdomain = inputBookmarkWindow.value.replace('www.','');
    // const myArray = domain.split(".");
    // let word = myArray[0];
    // sharePopupName.innerHTML = word.toUpperCase();
    // add code here for the title

 }
 