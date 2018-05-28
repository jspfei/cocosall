
var topicAry =["使用ImageLoader加载图片","播放音乐","暂停音乐","恢复音乐","MVC","等待连接","模板","小羊"]; 

cc.Class({
    extends: cc.Component,

    properties: {
      imageloader:{
          default:null,
          type:cc.Prefab
      },
      content_layout:{
          default:null,
          type:cc.Node
      },
      contentBtn:{
          default:null,
          type:cc.Node
      }
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        this._handlerAry = {};
        this._initBtnHandlers();

        this._initContentLayout();
    },
    _initContentLayout:function(){
        for(var i = 0 ; i < topicAry.length ; i++){
            let item = cc.instantiate(this.contentBtn);   
            let temp = item.getComponent("BtnBind"); 
            cc.info("str: "+i+" "+topicAry[i])
            temp.lbl.string =topicAry[i];
            item.active = true; 
            this._initButtonHandler(temp.btn,i+1+"");
            item.parent = this.content_layout;
        }    
    },
    _initButtonHandler:function(btn,customEventData){
        // var btn = cc.find(btnPath);
         cc.info("initButtonHandler   btn ",btn);
         cc.vv.utils.addClickEvent(btn,this.node,"MainBind","onBtnClicked",customEventData);   
     },

    _initBtnHandlers:function(){
       this.onSHanlder("1",this.openImageLoaderPrefab.bind(this));
       this.onSHanlder("2",this.playMusic.bind(this));
       this.onSHanlder("3",this.pauseMusic.bind(this) );
       this.onSHanlder("4",this.resumeMusic.bind(this));
       this.onSHanlder("5",this.openMVCScene.bind(this) );
       this.onSHanlder("6",this.showWc.bind(this));
       this.onSHanlder("7",this.jumpTempalte.bind(this)); 
       this.onSHanlder("8",this.jumpSheep.bind(this));
    },

    onSHanlder:function(key,handler){
        this._handlerAry[key] = handler;
    },
    getHandler:function(key){
        return this._handlerAry[key]();
    },

    onBtnClicked: function (event,customEventData) {
        cc.info("customEventData ",customEventData);      
        this.getHandler(customEventData);        
    },

    jumpSheep:function(){
        cc.director.loadScene("sheep");
    },

    jumpTempalte:function(){
        cc.director.loadScene("template");
    },

    showWc:function(){
        cc.vv.wc.show('正在返回游戏房间');
    },

    openImageLoaderPrefab:function(){
        this.imageloadercase = cc.instantiate(this.imageloader);
        this.imageloadercase.parent = cc.find("Canvas"); 
    },

    playMusic:function(){
        cc.poker.audio.playBGM("bg2.mp3");
    },

    pauseMusic:function(){
        cc.poker.audio.pauseBGM(); 
    },

    resumeMusic:function(){
        cc.poker.audio.resumeBGM(); 
    },

    openMVCScene:function(){
        cc.director.preloadScene("mvc", function () {  
            cc.director.loadScene("mvc");
        });
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
