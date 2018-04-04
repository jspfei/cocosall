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
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("start");
            return;
        }

        this.initBtnHandler("Canvas/btn_create_room");
        this.initBtnHandler("Canvas/btn_enter_room");
        this.initBtnHandler("Canvas/btn_charge");
    },
    initBtnHandler:function(btnPath)
    {
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn,this.node,"Template","onBtnClicked"); 
    },
    onBtnClicked:function(event){
        cc.log("name : ",event.target.name)
        if(event.target.name =="btn_create_room")
        {

        }else if(event.target.name =="btn_enter_room")
        {

        }else if(event.target.name =="btn_charge")
        {
            this.onBtnTaobaoClicked();
        }
    },
    onBtnTaobaoClicked:function(){
        cc.log("url ","onBtnTaobaoClicked")
        cc.sys.openURL('https://shop596732896.taobao.com/');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
