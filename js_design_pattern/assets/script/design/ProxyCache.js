//乘法
var mult = function(){
    var a = 1;
    for(var i = 0, ilen = arguments.length;i<ilen; i+=1){
        a = a * arguments[i];
    }
    return a;
};
//加法
var plus = function(){
    var a = 0;
    for(var i = 0, ilen = arguments.length; i < ilen ; i+=1){
        a += arguments[i];
    }
    return a;
};
//代理
var proxyFunc = function(fn){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call(arguments,',');
        if(args in cache){
            return cache[args]
        }
        return cache[args] = fn.apply(this,arguments);
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
        var proxyMult = proxyFunc(mult);
        lbl = "------mult--------";
        lbl = lbl + "\n" +proxyMult(1,2,3,4) + "\n" +proxyMult(1,2,3,4) 
        var proxyPlus = proxyFunc(plus);
        lbl = lbl +"\n"+"------plus--------";
        lbl = lbl + "\n" +proxyPlus(1,2,3,4) + "\n" +proxyPlus(1,2,3,4)
        if(fun)
            fun(lbl)
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
