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
            default:
                break;

        }
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
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
