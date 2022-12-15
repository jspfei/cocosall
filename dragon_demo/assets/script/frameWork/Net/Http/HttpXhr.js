
var Handler = require("Handler");

var HttpXhr = cc.Class({
        name: "HttpXhr",

        properties:()=>({
                timeOutWait: 6500,
                reTryCount:2,

                _xhr:null,
                _timeOutHandler:Handler,
                _currTimeCount:0,

                _url:"",
                _type:0,
                _params:null,
                _complete:Handler,
                _ioError:Handler,
                _progress:Handler,
                _token:""

        }),

        requireHttp(url, type, params, complete, ioError, progress, token ,timeOut = 0, Provisional = true, setHeadBln = true, retryTime = 2) {
                let self = this;
                self._url = url;
                self._params = params;
                self._complete = complete;
                self._ioError = ioError;
                self._progress = progress;
                self._token = token;
                self._type = type;
                self._timeOut  = timeOut;
                self._provisional = Provisional;
                self._setHeadBln = setHeadBln;
                self._retryTime = retryTime;

                self.reTryCount = retryTime;
                if(self.reTryCount == 0) {
                        self.reTryCount = 2;
                }

                if(timeOut > 0) {
                        self.timeOutWait = timeOut;
                }

                let postType = ""
                switch (type) {
                        case 0:
                                postType = "GET"
                                break;
                        case 1:
                                postType = "POST"
                                break;
                        default:
                                break;
                }

                if(postType == ""){
                        self.disposeXhr();
                        return;
                }

                self._xhr = cc.loader.getXMLHttpRequest();
                self._xhr.open(postType, url, true)
                if(setHeadBln) {
                        if(Provisional) {
                                self._xhr.setRequestHeader("Authorization","Bearer "+token)
                        } else {
                                self._xhr.setRequestHeader('content-type','application/json')
                        }
                }

                if(self._timeOutHandler !=null)      {
                        self._timeOutHandler.recover();
                        self._timeOutHandler = null;
                }
                self._timeOutHandler = Handler.create(self, self.ontimeOutHandler,null, false)

                self._xhr.onreadystatechange = self.onReadyStateChangeHandler.bind(self)
                self._xhr.onerror = self.onErrorHandler.bind(self)
                self._xhr.onprogress = self.onPostProgressHandler.bind(self)


                jf.log("[网络请求http] url > " + url);

                try {
                        switch(type) {
                                case 0:
                                        self._xhr.send();
                                        break;
                                case 1:
                                        self._xhr.send(params)
                                        break;
                                default:
                                        break;
                        }
                } catch (error) {
                        self.onErrorHandler(error);       
                }
        },
        ontimeOutHandler() {
                let self = this;
                self._currTimeCount += 1
                if(self._currTimeCount >= self.reTryCount) {
                        jf.log("[请求超时] > url > " + self._url)
                        if(self._ioError != null) {
                                self._ioError.run();
                        }
                        self.disposeXhr();
                } else {
                        setTimeout(() => {
                                self.requireHttp(self._url,self._type, self._params, self._complete, self._ioError, self._progress, self._token, self._timeOut, self._provisional, self._setHeadBln, self._retryTime)
                        },100)
                }


        },

     
        onErrorHandler(event){
                let self = this;
                try {
                      if(event != null)  {
                            jf.log("[网络连接异常 http ] > url > " + self._url + " error > " + event.detail);
                      }

                      if(self._ioError != null) {
                           self._ioError.runWith([event])
                      }
                      if(self._timeOutHandler != null) {
                          self._timeOutHandler.recover();
                          self._timeOutHandler = null;
                      }
                } catch (error) {
                        jf.log("[error: 网络连接异常 catch -> 处理函数 -> onErrorHandler 出错]");
                }
        },
        onPostProgressHandler(event){
                let self = this;
                try {
                        if(self._progress != null) {
                                self._progress.runWith([100 * event.loaded / event.total])
                        }
                } catch (error) {
                        jf.log("[error: 网络连接异常 catch -> 处理函数 -> onPostProgressHandler 出错]")
                }
        },

        onReadyStateChangeHandler(){
                let self = this;
                try {
                        if(self._xhr != null && self._xhr.readyState == 4 && self._xhr.status >= 200) {
                                
                                if(self._xhr.status < 400 ){
                                        let response = self._xhr.responseText;
                                        if(response && response.length > 3000) {
                                                jf.log('[http]:' + self._url + '=>' + ' to long ...');
                                        } else {
                                                jf.log('[http]:' + self._url + '=>' + response);
                                        }
                                        self.onPostComplete(response)
                                }
                        } else if(self._xhr != null && self._xhr.status == 401){
                                //重新登录吧!
                        }

                        
                } catch (error) {
                        jf.log("[error: 网络连接异常 catch -> 处理函数 -> onReadyStateChangeHandler 出错]");
                }  
        },

        onPostComplete(response) {
                let self = this;
                let data = response
                try {
                        if (self._complete != null) {
                                self._complete.runWith([data]);
                        }  
                } catch (error) {
                        
                }
                self.disposeXhr();
        },
        disposeXhr(){
                let self = this;
                try {
                        if(self._xhr){
                                self._xhr.abor()
                                self._xhr = null;
                        }
                        if(self._timeOutHandler != null) {

                        }

                        self._url = ""
                        self._params = null;
                        self._complete = null;
                        self._ioError = null;
                        self._progress = null;
                        self._token = ""
                        self._type = 0;
                } catch (error) {
                        
                }
        }

})