cc.VERSION = 2017061001;
var HTTP = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    statics: {
        baseURL:"http://8game.lai2ba.com:8085",
        wsURL : "http://8game.lai2ba.com:9081",
        loginURL:"http://8login.lai2ba.com:8088",
        // baseURL:"http://192.168.66.124:8085",
        // wsURL : "http://192.168.66.124:9081",
        // loginURL:"http://192.168.66.252:8088",

        authorization: null,

        httpGet:function(url , success , error , object){
            HTTP.httpGetURL(HTTP.baseURL+url, success, error, object);
        },
        
        httpGetURL: function (url , success , error , object) {
            var xhr = cc.loader.getXMLHttpRequest();
            ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
                xhr["on" + eventname] = function () {
                    cc.info("\nEvent : " + eventname)
                    if(eventname == "error" || eventname =="timeout"){
                        if(error){
                            error(object,eventname);
                        }
                    } 
                };
            });
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if(xhr.status >= 200 && xhr.status < 300){
                        var respone = xhr.responseText;
                        if(success){
                            success(respone , object);
                        }
                    }else{
                        if(error){
                            error(object);
                        }
                    }
                }
            };

            xhr.open("GET", url, true);
            if(HTTP.authorization != null){
                xhr.setRequestHeader("authorization", HTTP.authorization) ;
            }
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
    
            // note: In Internet Explorer, the timeout property may be set only after calling the open()
            // method and before calling the send() method.
            xhr.timeout = 5000;// 5 seconds for timeout

            xhr.send();
        },
        encodeFormData : function(data)  
        {  
            var pairs = [];  
            var regexp = /%20/g;  
          
            for (var name in data){  
                var value = data[name].toString();  
                var pair = encodeURIComponent(name).replace(regexp, "+") + "=" +  
                    encodeURIComponent(value).replace(regexp, "+");  
                pairs.push(pair);  
            }  
            return pairs.join("&");  
        },
        httpPost: function (url, params, success , error , object) {
            this.httpPostURL(HTTP.baseURL+url,params, success, error, object);
        },

        httpPostURL: function (url, params, success , error , object) {
            var xhr = cc.loader.getXMLHttpRequest();
            ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
                xhr["on" + eventname] = function () {
                    // eventLabel.string = eventLabelOrigin + "\nEvent : " + eventname;
                    cc.info("\nEvent : " + eventname)
                    if(eventname == "error" || eventname =="timeout"){
                        if(error){
                            error(object,eventname);
                        }
                    } 
                };
            });
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if(xhr.status >= 200 && xhr.status < 300){
                        var respone = xhr.responseText;
                        if(success){
                            success(respone , object);
                        }
                    }else{
                        if(error){
                            error(object);
                        }
                    }
                }
            };
            xhr.open("POST", url, true);
            if(HTTP.authorization !== null){
                xhr.setRequestHeader("authorization", HTTP.authorization) ;
            }
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    
            // note: In Internet Explorer, the timeout property may be set only after calling the open()
            // method and before calling the send() method.
            xhr.timeout =  5000;// 5 seconds for timeout
            cc.info("params ",params)
            xhr.send( HTTP.encodeFormData(params));
            
        }
    },

    // use this for initialization
    onLoad: function () {
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
    
});