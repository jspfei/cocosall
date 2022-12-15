var HttpXhr = require("HttpXhr");

var HttpManager = cc.Class({
        name:"HttpManager",
        statics:{
                instance:null,

                GET:0,
                POST:1
        },
        properties: () => ({
                _token:""
        }),

        load(url, params, type, complete, ioError, progress, force = false, timeOut = 0 , Provisional = true, setHeadBln = true, retryTime = 2) {
             let contactStr = "&v="     
             if(url.indexOf("?") > -1) {
                contactStr = "&v="
             } else {
                 contactStr = "?v="
             }
             force = false;
             url = url + contactStr + new Date().getTime().toString();
             jf.log("[进入  HttpManager > load > url > ] " +url);
             let httpXhr = new HttpXhr()
             httpXhr.requireHttp(url, type, params, complete, ioError, progress, this._token, timeOut, Provisional, setHeadBln, retryTime)
        },

        loadOnce(url, params, type, complete, ioError, timeOut, Provisional = true, setHeadBln = true) {
                const retryTime = 1;
                this.load(url, params, type, complete, ioError, null,false,timeOut,Provisional, setHeadBln, retryTime)
        }


})

HttpManager.instance = new HttpManager()
module.exports = HttpManager;