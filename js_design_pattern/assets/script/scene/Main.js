cc.Class({
    extends: cc.Component,

    properties:  {
        tips:cc.Label
        },

    // use this for initialization
    onLoad: function () { 
        this.initButtonHandler("Canvas/layout/btn_simple")
        this.initButtonHandler("Canvas/layout/btn_complex")
    },
    initButtonHandler:function(btnPath){
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn,this.node,"Main","onBtnClicked");        
    },
    onBtnClicked:function(event){
        this.tips.string = "";
        cc.log("----------------",event.target.name);
        if(event.target.name == "btn_simple"){
            var SimpleFactory =  require("SimpleFactory");
            var simpleFactory = new SimpleFactory();
            simpleFactory.init(this.tips);
        }else if(event.target.name == "btn_complex")
        {
            var ComplexFactory =  require("ComplexFactory");
            var complexFactory = new ComplexFactory();
            complexFactory.init(this.tips);
        }
    }
});
