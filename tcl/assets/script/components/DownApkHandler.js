cc.Class({
    extends: cc.Component,

    properties: {
        updateUI: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        if(this.updateUIs !=null){
            this.updateUIs.destroy();
            this.updateUIs = null;
        }
        this.updateUIs = cc.instantiate(this.updateUI);
        this.updateUIs.parent = cc.find("Canvas");
        this.panel = this.updateUIs.getComponent("UpdatePanel"); 
        this.panel.byteProgress.node.active = true; 
        this.panel.byteLabel.node.active = true; 


        //网络请求（url，超时限制，请求成功回调，请求失败回调，发送数据）
        var url = "https://dn-sao-ipa.qbox.me/479.hzjcbz.apk"
        this.downApk(url);
    },

    /**
     * url 下载地址
     */
    downApk:function(url){
        var self = this;
        var xhr = new XMLHttpRequest();

        xhr.onprogress = function (event) {
            if(event.lengthComputable){
                
              }
              self.panel.byteProgress.progress = event.loaded/event.total;
              self.panel.byteLabel.string =Math.round(100* event.loaded/ event.total) + '%';
            cc.log("xhr.onprogress  event.loaded " + event.loaded);
            cc.log("xhr.onprogress  event.total " + event.total); 
          };
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            cc.log("xhr.readyState  " + xhr.readyState);
            cc.log("xhr.status  " + xhr.status);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                 
                    //saveFile(xhr.response);
                } else {
                    saveFile(null);
                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    },
    XML_HTTP_REQUEST:function(url, timeout, successCallback, failedCallback, sendData){
        //url = encodeURI(url);
        cc.log("url = " + url);
        var request = new XMLHttpRequest();
        var time = false;//是否超时
        var timer = setTimeout(function(){
            time = true;
            request.abort();//请求中止
            if(typeof failedCallback != "undefined"){
                failedCallback("请求超时");
                cc.log("XML_HTTP_REQUEST 请求超时");
            }
        },timeout);
        request.onreadystatechange = function(){
            if(request.readyState == 4) {
                cc.log("XML_HTTP_REQUEST request.readyState == 4");
                if(time) return;//请求已经超时，忽略中止请求
                clearTimeout(timer);//取消等待的超时
                if(request.status == 200){
                    cc.log("XML_HTTP_REQUEST request.status == 200");
                    successCallback(request.responseText);
                }else{
                    if(typeof failedCallback != "undefined"){
                        failedCallback("请求失败");
                    }
                }

            }
        }
        if(typeof sendData == "undefined"){
            request.open("GET",url, true);
            request.send();
            cc.log("XML_HTTP_REQUEST get open");
        }else{
            request.open("POST", url, true);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if(typeof sendData == "string"){
                request.send(sendData);
                cc.log("post send data is " + sendData);
            }else{
                var str = "";
                for (var key in sendData) {
                    if (sendData.hasOwnProperty(key)) {
                        var element = sendData[key];
                        str += key + "=" + element + "&";
                    }
                }
                str.substring(0, str.length -1);
                cc.log("post send data is " + str);
                request.send(str);
            }
            
        }

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
