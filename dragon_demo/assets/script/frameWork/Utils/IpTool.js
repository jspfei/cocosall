var Handler = require("Handler")
var HttpManager = require("HttpManager")

const ONEDAY = 24 * 3600 * 1000;
const K_CHECK_DELAY = ONEDAY * 5;

var IpTool = cc.Class({
        name :"IpTool",
        statics: {
                checkIPLoc(callBack) {
                        let self = this;
                        let todayCache = self.getTodayCache();
                        if (todayCache) {
                                self._parse(todayCache, callBack)
                                return;
                        }

                        let checkUrl = "http://ip-api.com/json/"
                        HttpManager.instance.load(checkUrl, null, HttpManager.GET,
                        Handler.create(self, function(params) {
                                if(params) {
                                        self.storeIPCache(params)
                                }
                                self._parse(params, callBack)

                        }), Handler.create(self, function(params) {
                                let cache = self.getIPCache();
                                self._parse(cache, callBack)

                        }),null, false, 0, false, false)
                },

                _parse(params, callBack) {
                        let data = null
                        if(params != null) {
                                try {
                                        data = JSON.parse(params)
                                } catch (err) {
                                        console.log(err)
                                        data = null;
                                }
                        }

                        if(callBack != null) {
                                callBack.runWith([data])
                        }
                },

                getTodayCache(){
                        let self = this;
                        let todayDate = new Date().getTime()
                        var LocalStorageManager = require("LocalStorageManager")
                        let _lastDate = LocalStorageManager.instance.readData(LocalStorageManager.IPCHECK_DATE);
                        if (_lastDate && todayDate - _lastDate < K_CHECK_DELAY) {
                                let _cache = this.getIPCache()
                                if (_cache) {
                                        return _cache;


                                }
                        }
                        return null;

                },

                getIPCache(){
                        let self = this;
                        var LocalStorageManager = require("LocalStorageManager")
                        let _cache = LocalStorageManager.instance.readData(LocalStorageManager.IPCHECK_RET);
                        if(_cache) {
                                return _cache;
                        }
                        return null;
                },

                storeIPCache(data){
                        let todayDate = new Date().getTime()
                        var LocalStorageManager = require('LocalStorageManager')
                        LocalStorageManager.instance.saveData(LocalStorageManager.IPCHECK_DATE,todayDate)
                        LocalStorageManager.instance.saveData(LocalStorageManager.IPCHECK_RET,data);
                }
        }
})