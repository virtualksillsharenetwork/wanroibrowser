const { app, BrowserWindow, BrowserView } = require('@electron/remote')

let i = 2;

const tabs = document.querySelectorAll('[data-tab-value]')


tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.getElementById(tab.dataset.tabValue);
        const webviews = document.querySelectorAll('[data-tab-info]')
        webviews.forEach(tabInfo => {
            tabInfo.classList.remove('active')
        })
        var content_index = tab.dataset.tabValue.split("_");
        const webview = document.getElementById(`tab_content_${content_index[1]}`);
        webview.classList.add('active');
        target.classList.add('active');

    })
})


var allTabs = document.querySelector('.chrome-tabs')
var chromeTabs = new ChromeTabs();

chromeTabs.init(allTabs)

allTabs.addEventListener('activeTabChange', ({ detail }) => { })
allTabs.addEventListener('tabAdd', ({ detail }) => { })
allTabs.addEventListener('tabRemove', ({ detail }) => { })

document.querySelector('button[data-add-tab]').addEventListener('click', _ => {
    let tab_number = i++;
    chromeTabs.addTab({
        title: 'New Tab',
        favicon: false,
        tab_no: tab_number,
    })
    var tabcontent = document.querySelector('.tab-content');
    var tabs = tabcontent.innerHTML;
    tabcontent.innerHTML = tabs + `
        <div class="tabs__tab" id="tab_content_${tab_number}" data-tab-info>
            <webview id="webview_${tab_number}" src="https://wanroi.com" style="display:inline-flex;width:100%; height:600px"></webview>
        </div>`;
    var latestTab = document.getElementById(`tab_${tab_number}`);
    const webviews = document.querySelectorAll('[data-tab-info]')
        webviews.forEach(tabInfo => {
            tabInfo.classList.remove('active')
        })
    const webview = document.getElementById(`tab_content_${tab_number}`);
    webview.classList.add('active');
    latestTab.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        const tabValue = e.target.parentElement.dataset.tabValue;
        const target = document.getElementById(tabValue);
        const webviews = document.querySelectorAll('[data-tab-info]')
        webviews.forEach(tabInfo => {
            tabInfo.classList.remove('active')
        })
        var content_index = tabValue.split("_");
        const webview = document.getElementById(`tab_content_${content_index[1]}`);
        webview.classList.add('active');
        target.classList.add('active');
    })
})

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

// document.querySelector('button[data-theme-toggle]').addEventListener('click', _ => {
//     if (el.classList.contains('chrome-tabs-dark-theme')) {
//         document.documentElement.classList.remove('dark-theme')
//         el.classList.remove('chrome-tabs-dark-theme')
//     } else {
//         document.documentElement.classList.add('dark-theme')
//         el.classList.add('chrome-tabs-dark-theme')
//     }
// })

window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 't') {
        chromeTabs.addTab({
            title: 'New Tab',
            favicon: false
        })
    }
})