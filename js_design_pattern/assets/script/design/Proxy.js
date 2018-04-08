var TeaAndMilkGirl = function(name){
    this.name = name;
};

var Ceo = function(girl){
    this.girl = girl;
    this.sendMarriageRing = function(ring){
       return "Hi " + this.girl.name +", ceo 送你一个礼物："+ring;
    }
};

var ProxyObj = function(girl){
    this.girl = girl;
    this.sendGift = function(gift){
        return (new Ceo(this.girl)).sendMarriageRing(gift);
    }
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

    init:function(lbl){
        var proxy = new ProxyObj(new TeaAndMilkGirl("奶茶妹"));
        var msg = proxy.sendGift("结婚戒")
        lbl.string = msg;
    }
});
