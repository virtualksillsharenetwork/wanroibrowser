
const electronTabs = new ElectronChromeTabs()
window.activeWebView = undefined;
window.loadstart = () => {
	console.log('loading...');
}
window.loadstop = () => {
	console.log('done');
}
window.did_finish_load = () => {
	if(typeof window.activeWebView === 'undefined')
	return;
	else
	$('#mainSearch').val(window.activeWebView.getURL());
}

electronTabs.addTab("New Tab", "","browser");

$('#add-tab').on('click', function () {
	electronTabs.addTab("New Tab", "","hero.html");
});

$('#mainSearch').on('keydown', function (event) {
    if (event.key === "Enter") {
		window.activeWebView = getActiveWebView();
        if (validURL(this.value)) {
            window.activeWebView.loadURL(this.value);
        }
        else {
            activeWebView.loadURL(`https://search.wanroi.com/web?q=${this.value}`);
        }
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
function getActiveWebView() {
	var activeWebView = $('.tab-content .selected webview')[0].id;
	return window[activeWebView];
}

function openIncognitoButton() {
            const { ipcRenderer } = require('electron'); 

            ipcRenderer.send('open-incognito-window'); 
}

// document.getElementById('btn-toggle-theme').addEventListener('click', function () {
// 	// Then toggle (add/remove) the .dark-theme class to the body
// 	document.body.classList.toggle('dark-theme');
// });
document.querySelector('button[data-theme-toggle]').addEventListener('click', _ => {
    //alert("Working");
    if (el.classList.contains('chrome-tabs-dark-theme')) {
        // document.documentElement.classList.remove('dark-theme')
        el.classList.remove('chrome-tabs-dark-theme')
    } else {
        // document.documentElement.classList.add('dark-theme')
        el.classList.add('chrome-tabs-dark-theme')
    }
})