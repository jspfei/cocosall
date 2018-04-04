cc.Class({
    extends: cc.Component,

    properties: {
      imageloader:{
          default:null,
          type:cc.Prefab
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
    },
    onBtnCtrlClick: function (event, customEventData) {

        var self = this;
        cc.info("onBtnCtrlClick  this.isOpenScreen", customEventData)
        switch (customEventData) {
            case "1": 
                self.openImageLoaderPrefab(); //imageload加载图片
                break;

            case "2": 
                self.playMusic(); //播放音乐
                break;
            case "3":
                self.playMusic(); //暂停音乐
                break;
            case "4":
                self.playMusic(); //恢复音乐
                break;
            case "5":
                self.openMVCScene(); //MVC
                break;
            case "6":
                self.showWc();
                break;
            default:
                break;

        }
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
