var Singleton = function(name){
    this.name = name;
};
Singleton.prototype.getName = function(){
    return this.name;
}
var getInstance = (function(){
    var instance = null;
    return function(name){
        if(!instance){
            instance = new Singleton(name);
        }
        return instance;
    }
})();

// 创建div
var createWindow = function(){
    var div = document.createElement("div");
    div.innerHTML = "我是弹窗内容";
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};
// 创建iframe
var createIframe = function(){
    var iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    return iframe;
};
// 获取实例的封装代码
var getInstance1 = function(fn) {
    var result;
    return function(){
        return result || (result = fn.call(this,arguments));
    }
};
cc.Class({
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

    // use this for initialization
    onLoad: function () {

    },

    init:function(fun){
        var lbl = ""
        var a = getInstance("aa");
        var b = getInstance("bb");

        lbl = a.getName() +"   "+b.getName();
        if(fun)
            fun(lbl)
    },
    initW:function(){
        // 测试创建div
        var createSingleDiv = getInstance1(createWindow);
        document.getElementById("Id").onclick = function(){
            var win = createSingleDiv();
            win.style.display = "block";
        };
        // 测试创建iframe
        var createSingleIframe = getInstance1(createIframe);
        document.getElementById("Id").onclick = function(){
            var win = createSingleIframe();
            win.src = "http://cnblogs.com";
        };
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
