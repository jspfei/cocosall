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
        bgVolume:0.5,           // 背景音量

        deskVolume:0.5,         //   房间 房间音量
        
        bgAudioID:-1,            //   背景 音乐  id
        sfxVolume:0.5,
    },

    // use this for initialization
    init: function () {
        var t = cc.sys.localStorage.getItem("bgVolume");
        if(t != null){
            this.bgVolume = parseFloat(t);    
        }
        
        var t = cc.sys.localStorage.getItem("deskVolume");

        if(t != null){
            this. deskVolume = parseFloat(t);   
            this.sfxVolume = parseFloat(t);
        }
        
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.audioEngine.resumeAll();
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
    
    getPlatformUrl:function(url){//平台音效
        return cc.url.raw("resources/audio/sounds/platform/" + url);
    },
    getChatMUrl:function(url){//聊天男语音
        return cc.url.raw("resources/audio/sounds/game/common/M/" + url);
    },
    getChatWUrl:function(url){//聊天nv语音
        return cc.url.raw("resources/audio/sounds/game/common/W/" + url);
    },
    getGameC8SpecialSoundUrl:function(url){//8张特效音
        return cc.url.raw("resources/audio/sounds/game/card8/" + url);
    },
    playBGM(url){
        var audioUrl = this.getPlatformUrl(url);
        if(this.bgAudioID >= 0){
            cc.audioEngine.stop(this.bgAudioID);
        }

        cc.info("----------------- initMgr before playBGM url = " + audioUrl + " ------------------");

        this.bgAudioID = cc.audioEngine.play(audioUrl,true,this.bgVolume);
    },
    /**
     * 播放聊天特效音
     * @param {*} url 
     * @param {*}type 1是男  2是女
     */
    playSFX(url,type){
        var audioUrl= this.getChatMUrl(url);
        if(type !=null){ 
            if(type ==2){
                audioUrl = this.getChatWUrl(url);
            }
        } 
        
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.deskVolume);    
        } 
    },
    /**
     * 按钮点击声音
     */
    playBtnClick(){
        var audioUrl = this.getPlatformUrl("btn_click2.mp3");//btn_click1
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.deskVolume);    
        } 
    },
     /**
     * 输入房间号数字按钮点击声音
     */
    playNumBtnClick(){
        var audioUrl = this.getPlatformUrl("num_click.mp3");//btn_click1
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.deskVolume);    
        } 
    },
    /**
     * 输入房间号数字按钮点击声音
     */
    playOpenRoomClick(){
        var audioUrl = this.getPlatformUrl("open_room.mp3");//btn_click1
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.deskVolume);    
        } 
    },
    /**
     * 
     */
    /**
     * c8游戏桌面特效音
     * @param {*} url 
     */
    playGameS(url){ 
        var audioUrl = this.getGameC8SpecialSoundUrl(url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.deskVolume);    
        } 
    },
    
    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("deskVolume",v);
            this.deskVolume = v;
            this.sfxVolume = v;
        }
    },
    pauseSound:function(){
        this.sfxVolume =0;
    },
    resumeSound:function(){
        this.sfxVolume =  this.deskVolume;
    },
    getSoundState:function(){
        if(this.sfxVolume==0){
            return false;
        }else{
            return true;
        }
    },
    getState:function(){
        return cc.audioEngine.getState(this.bgAudioID);
    },
    setBGMVolume:function(v,force){
        if(this.bgAudioID >= 0){
            if(v > 0 && cc.audioEngine.getState(this.bgAudioID) === cc.audioEngine.AudioState.PAUSED){
                cc.audioEngine.resume(this.bgAudioID);
            }else if(v == 0){
                cc.audioEngine.pause(this.bgAudioID);
            }
        }
        if(this.bgVolume != v || force){
            cc.sys.localStorage.setItem("bgVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgAudioID,v);
        }
    },
    pauseBGM:function(){
        cc.audioEngine.pause(this.bgAudioID);
    },
    resumeBGM:function(){
        cc.audioEngine.resume(this.bgAudioID);
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
});
