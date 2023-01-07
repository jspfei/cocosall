var AssetManager = require("AssetManager");
var Handler = require("Handler");
var ResPatchManager = require("ResPatchManager");
var EffectAudioSource = require("EffectAudioSource");

var MusicManager = cc.Class({
        name :"MusicManager",
        statics:{
                instance:null,
        },

        properties: () => ({
                _isCloseBGM:false,
                _isCloseEffectSound:false,
                hasEffect:{
                        get:function(){
                                return !this._isCloseEffectSound
                        }
                },

                _currBGMID:0,
                _currBGMPatch:"",
                _effectAudioSourceList:[],
                _playingList:[],
        }),

        ctor:function(){

        },

        userSetCloseBGM(){
                let self = this;
                self._isCloseBGM = true;
                self.stopBGM();
        },

        userSetOpenBGM(){
                let self = this;
                self._isCloseBGM = false;
                if (self._currBGMPatch != ""){
                        AssetManager.instance.getSoundRes(self._currBGMPatch,Handler.create(self, function(data) {
                                this._currBGMID = cc.audioEngine.play(data, true, 1)
                        }))
                }
        },

        userOpenEffectSound(){
                this._isCloseEffectSound = false;
        },

        userCloseEffectSound(){
                this._isCloseEffectSound = true;
        },

        playBGM(path){
                let self = this;
                if (path == self._currBGMPatch && this._currBGMID != 0) {
                        return;
                }

                if(this._currBGMID != 0){
                        self.stopBGM();
                }

                self._currBGMPatch = path;
                if (path == null || path === '') {
                        return;
                }
                if(self._isCloseBGM) {
                        return;
                }
                AssetManager.instance.getSoundRes(path, Handler.create(self, function(data) {
                        this._currBGMID = cc.audioEngine.play(data, true, 1) 
                }))
        },

        stopBGM(){
                let self = this
                cc.audioEngine.stop(self._currBGMID)
                self._currBGMID = 0;
        },

        getFreeEffectSound(){
                let len = this._effectAudioSourceList.length;
                if (len > 0){
                        this._effectAudioSourceList.pop();
                }
                return new EffectAudioSource()
        },

        playEffectSound(name, loop, finish) {
                if(!name) {
                        if(finish) finish();
                        return;
                }

                let  self = this;
                if (this._isCloseEffectSound){
                        return;
                }
                if (!this._playingMap){
                        this._playingMap = {}
                }

                if (!this._playingMap[name]) {
                        this._playingMap[name] = 0
                }
                if(this._playingMap[name] > 3) {
                        return;
                }

                this._playingMap[name] += 1
                let effectAudioSource = self.getFreeEffectSound(name)
                effectAudioSource.playEffectSound(name, loop , finish)
                this._playingList.push(effectAudioSource)
        },

        stopEffectSound(name) {
                if (name){
                        let list = this._playingList.slice()
                        list.forEach(element => {
                                if (element.playingSound == name) {
                                        element.stopPlay()
                                }
                        });
                }
        },

        stopAllEffect(){
                let list = this._playingList.slice()
                list.forEach(element => {
                        element.stopPlay();
                })
        },
        uncaheAllEffect(){
                this.stopAllEffect()
        },

        effectAudioSourceBack(effectAudioSource) {
                if (effectAudioSource && effectAudioSource._playingSound && this._playingMap && this._playingMap[effectAudioSource._playingSound]) {
                        this._playingMap[effectAudioSource._playingSound] --;
                }

                if(!cc.js.array.contains(this._effectAudioSourceList, effectAudioSource) && cc.isValid(effectAudioSource)){
                        this._effectAudioSourceList.push(effectAudioSource)
                }

                cc.js.array.remove(this._playingList,effectAudioSource)
        }       
})

MusicManager.instance = new MusicManager();
module.exports = MusicManager;