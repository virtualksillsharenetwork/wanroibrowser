window['webview{HEROID}'] = document.getElementById('webview{HEROID}')
window['webview{HEROID}'].addEventListener('did-start-loading', loadstart);
window['webview{HEROID}'].addEventListener('did-start-load', loadstop);
window['webview{HEROID}'].addEventListener('did-finish-load', did_finish_load);
window['webview{HEROID}'].addEventListener('page-favicon-updated', page_favicon_updated);
