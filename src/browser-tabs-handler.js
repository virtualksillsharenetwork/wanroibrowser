const { app, BrowserWindow, BrowserView } = require('@electron/remote')
const { ipcRenderer } = require('electron');
var history_file = path.join(__dirname, "/history.json");

var webviewHandler = new WebViewHandler();
var chromeTabs = new ChromeTabs();

let i = 2;
var activeWebView = document.querySelector('#webview_1');
var allTabs = document.querySelector('.chrome-tabs');

webviewHandler.changeWebView(activeWebView);

chromeTabs.init(allTabs);
allTabs.addEventListener('activeTabChange', ({ detail }) => {
})
allTabs.addEventListener('tabAdd', ({ detail }) => {
})
allTabs.addEventListener('tabRemove', ({ detail }) => {

    var tabID = $(detail.tabEl).children(".chrome-tab-content").data('tab-value');
    var content_index = tabID.split("_");
    $(detail.tabEl).remove();
    $(`#tab_content_${content_index[1]}`).remove();
    if ((content_index[1] - 1) > 0) {
        $($(`#tab_${content_index[1] - 1}`).parent(".chrome-tab")[0]).addClass('active');
        $($(`#tab_content_${content_index[1] - 1}`)[0]).addClass('active');
    }
});

$(document).on("click", ".chrome-tab-content", function (e) {

    $('.tab-content div.active').removeClass('active');
    $(this).addClass('active');
    var content_index = $(this).data('tab-value').split("_")
    $(`#tab_content_${content_index[1]}`).addClass('active');
    if (!$(`#tab_content_${content_index[1]}`).children('#history')) {
        //selected webview
        webviewHandler.changeWebView($('#webview_' + content_index[1]));
    }

});


$(document).on("click", "#add-tab", function () {
    let tab_number = i++;
    chromeTabs.addTab({
        title: 'New Tab',
        favicon: false,
        tab_no: tab_number,
    });
    $('.tab-content div.active').removeClass('active');
    $('.tab-content').append(`
    <div class="tabs__tab active" id="tab_content_${tab_number}" data-tab-info>
        <webview nodeintegration nodeintegrationinsubframes id="webview_${tab_number}" src="https://search.wanroi.com" style="display:inline-flex;width:100%; height:100vh"></webview>
    </div>`);
    webviewHandler.changeWebView($('#webview_'+tab_number)[0]);
});

// document.querySelector('button[data-add-background-tab]').addEventListener('click', _ => {
//     chromeTabs.addTab({
//         title: 'New Tab',
//         favicon: false
//     }, {
//         background: true
//     })
// })

// document.querySelector('button[data-remove-tab]').addEventListener('click', _ => {
//     chromeTabs.removeTab(chromeTabs.activeTabEl)
// })

document.querySelector('button[data-theme-toggle]').addEventListener('click', _ => {
    if (el.classList.contains('chrome-tabs-dark-theme')) {
        document.documentElement.classList.remove('dark-theme')
        el.classList.remove('chrome-tabs-dark-theme')
    } else {
        document.documentElement.classList.add('dark-theme')
        el.classList.add('chrome-tabs-dark-theme')
    }
})

window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 't') {
        chromeTabs.addTab({
            title: 'New Tab',
            favicon: false
        })
    }
});
ipcRenderer.on(`history-clicked`, function (e, args) {
    openTab('history');
});

function openTab(tabName) {

    if (fs.existsSync(history_file)) {
        fs.readFile(history_file, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(JSON.parse(data))
                JSON.parse(data).table.forEach(element => {
                    $('#history ul').append(
                        `<li>${element.url}</li>`
                    )
                });
            }
        });
    }
    console.log(history)
    let tab_number = i++;
    chromeTabs.addTab({
        title: 'History',
        favicon: false,
        tab_no: tab_number,
    });
    $('.tab-content div.active').removeClass('active');
    $('.tab-content').append(`
    <div class="tabs__tab active" id="tab_content_${tab_number}" data-tab-info>
        <div id="${tabName}">
            <ul>
            </ul>
        </div>
    </div>`);
}

$('#mainSearch').on('keydown', function (event) {
    if (event.key === "Enter") {
        if (validURL(this.value)) {
            activeWebView.loadURL(this.value);
            this.value = activeWebView.getURL();
        }
        else {
            activeWebView.loadURL(`https://search.wanroi.com/web?q=${this.value}`);
            this.value = activeWebView.getURL();
        }
        //activeWebView.loadURL(this.value);
    }
});

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}