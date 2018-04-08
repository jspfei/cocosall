var Interview = function(){};

Interview.prototype.writtenTest = function(){
    console.log("sub writtenTest")
};
Interview.prototype.technicalInterview = function(){
    console.log("sub technicalInterview")
};
Interview.prototype.leader = function(){
    console.log("sub leader")
};
Interview.prototype.waitNotice = function(){
    console.log("sub waitNotice")
};
Interview.prototype.init = function(){
    this.writtenTest();
    this.technicalInterview();
    this.leader();
    this.waitNotice();
};

var BaiDuInterview = function(){};

BaiDuInterview.prototype = new Interview(); 

// 子类重写方法 实现自己的业务逻辑

BaiDuInterview.prototype.writtenTest = function(){

    console.log("我终于看到百度的笔试题了");

}

BaiDuInterview.prototype.technicalInterview = function(){

    console.log("我是百度的技术负责人，想面试找我");

}

BaiDuInterview.prototype.leader = function(){

    console.log("我是百度的leader，不想加班的或者业绩提不上去的给我滚蛋");

}

BaiDuInterview.prototype.waitNotice = function(){

    console.log("百度的人力资源太不给力了，我等的花儿都谢了！！");

} 
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
        var baiDuInterview = new BaiDuInterview();

        baiDuInterview.init();
        if(fun)
            fun("模板模式测试成功")
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
