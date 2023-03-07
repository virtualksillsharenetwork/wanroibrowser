var fs = require('fs');
const path = require('path');
var history_file = path.join(__dirname, "/history.json");
var obj = {
    table: []
};

class WebViewHandler {
    constructor() {

    }
    changeWebView(webview) {
        this.webview = webview;
        this.setupEvents();
    }
    setupEvents() {
        this.webview.addEventListener('did-finish-load', (e) => {
              console.log(this.webview)
        });
        this.webview.addEventListener('page-title-updated', (e) => {
            var webview = this.webview;
            const callbackEvent = this.writeCallback;
            obj.table.push({url:webview.getURL()});
            var json = JSON.stringify(obj);
            if(!fs.existsSync(history_file)){
                fs.writeFile(history_file, json, 'utf8', callbackEvent);  
            }
            else{
                fs.readFile(history_file, 'utf8', function readFileCallback(err, data){
                    if (err){
                        console.log(err);
                    } else {
                    obj = JSON.parse(data); //now it an object
                    obj.table.push({url:webview.getURL()}); //add some data
                    json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile(history_file, json, 'utf8', callbackEvent); // write it back 
                }});
            }
              
        });
    }
    getTitle() {
        return this.webview.getTitle();
    }
    writeCallback(err,res){
        if(err)
            console.error(err)
        else
            console.log(res)
    }
}