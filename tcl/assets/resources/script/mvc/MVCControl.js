cc.Class({
    extends: cc.Component,

    properties: {
       tabspanel:{
           default:null,
           type:cc.Node
       },
       centerpanel:{
           default:null,
           type:cc.Node
       },
       btnspanel:{
           default:null,
           type:cc.Node
       }
    },

    // use this for initialization
    onLoad: function () {
        this.t_panel = this.tabspanel.getComponent("TabsPanel"); 
        this.t_panel.title.string = "武炼巅峰" 

        this.c_panel = this.centerpanel.getComponent("MvcCenterPanel");
        this.c_panel.content.string = "无测试代码"

        this.b_panel = this.btnspanel.getComponent("BtnsPanel");
        cc.info("this.b_panel.lastBtn ",this.b_panel.lastBtn.name);
        var btnClose = cc.find("Canvas/main/buttom/btns/btn_1");
        
        this.initButtonHandler(this.b_panel.lastBtn);
        this.initButtonHandler(this.b_panel.curBtn);
        this.initButtonHandler(this.b_panel.nextBtn);
       
    },
    
    initButtonHandler:function(btn){
       // var btn = cc.find(btnPath);
        cc.info("initButtonHandler   btn ",btn);
        cc.vv.utils.addClickEvent(btn,this.node,"MVCControl","onBtnClicked");   
    },
    onBtnClicked:function(event){
        cc.info("event.target.name ",event.target.name);
        cc.info("this.b_panel.lastBtn.name ",this.b_panel.lastBtn.name);
        cc.info("this.b_panel.curBtn.name ",this.b_panel.curBtn.name);
        cc.info("this.b_panel.nextBtn.name ",this.b_panel.nextBtn.name);
        var txt = ""
        if(event.target.name == this.b_panel.lastBtn.name){
            txt = "上一页"
        }   
        else if(event.target.name == this.b_panel.curBtn.name){
            txt = "当前页"
        }
        else if(event.target.name == this.b_panel.nextBtn.name){
            txt = "下一页"
        }
         
        this.setContentText(txt);
    },

    setContentText:function(str){
        this.c_panel.content.string = str;
    },
    
    onBtnTaobaoClicked:function(){
        cc.sys.openURL('https://shop596732896.taobao.com/');
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
