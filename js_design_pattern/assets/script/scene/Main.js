cc.Class({
    extends: cc.Component,

    properties:  {
        tips:cc.Label
        },

    // use this for initialization
    onLoad: function () { 
        this.initButtonHandler("Canvas/layout/btn_simple")
        this.initButtonHandler("Canvas/layout/btn_complex")
        this.initButtonHandler("Canvas/layout/btn_singeton")
        this.initButtonHandler("Canvas/layout/btn_proxy")
        this.initButtonHandler("Canvas/layout/btn_cor")
        this.initButtonHandler("Canvas/layout/btn_command")
        this.initButtonHandler("Canvas/layout/btn_template")
        this.initButtonHandler("Canvas/layout/btn_tactics")
        this.initButtonHandler("Canvas/layout/btn_observer")
        this.initButtonHandler("Canvas/layout/btn_agency")
    },
    initButtonHandler:function(btnPath){
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn,this.node,"Main","onBtnClicked");        
    },
    onBtnClicked:function(event){
        this.tips.string = "";
        var temp = ""
        cc.log("----------------",event.target.name);
        if(event.target.name == "btn_simple"){
            
            temp = "SimpleFactory"
        }else if(event.target.name == "btn_complex")
        { 
        //     var ComplexFactory =  require("ComplexFactory");
        //     var complexFactory = new ComplexFactory();
        //     complexFactory.init(this.tips); 
            temp = "ComplexFactory"

        }else if(event.target.name == "btn_singeton")
        {
            // var Singleton =  require("Singleton");
            // var singleton = new Singleton();
            // singleton.init(this.tips);  
            temp = "Singleton"
        }else if(event.target.name == "btn_proxy")
        { 
          //  temp = "Proxy"
            temp = "ProxyCache"
        }else if(event.target.name == "btn_cor"){ 
            temp = "ChainResponsibility"
        }else if(event.target.name == "btn_command"){
           
            temp = "Command"
        }else if(event.target.name == "btn_template"){
            
            temp = "Template"
        }else if(event.target.name == "btn_tactics"){ 
            temp = "Strategy"
        }else if(event.target.name == "btn_observer"){
            temp = "Observer";
        }else if(event.target.name == "btn_agency"){
            temp = "Agency"
        }

        var Obj = new require(temp);
        var obj = new Obj();
        obj.init(function(msg){
            this.tips.string = msg;
        }.bind(this))
    }
});
