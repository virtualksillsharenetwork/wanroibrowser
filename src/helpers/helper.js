
class Helper {
    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
    correctURL(str) {
        if(str.startsWith('http://') || str.startsWith('https://'))
        {
            return str;
        }
        var urlPreString = ``;
        if (!/^https?:\/\//i.test(str)) {
            urlPreString = `http://` + str;
        }
        return urlPreString;
    }
    getActiveWebView() {
        var activeWebView = $('.tab-content .selected webview')[0].id;
        return window[activeWebView];
    }

    getDomain(url, subdomain) {
        subdomain = subdomain || false;
    
        url = url.replace(/(https?:\/\/)?(www.)?/i, '');
    
        if (!subdomain) {
            url = url.split('.');
    
            url = url.slice(url.length - 2).join('.');
        }
    
        if (url.indexOf('/') !== -1) {
            return url.split('/')[0];
        }
    
        return url;
    }
    
}

module.exports = new Helper();