var AssetManager = require("AssetManager");
var ResPatchManager = require("ResPatchManager");
var Handler = require("Handler");

var EffectAudioSource = cc.Class({
        //name: "EffectAudioSource",
        extends: cc.AudioSource,

        properties: () => ({
                _isFreeBln :true,
                isFreeBln :{
                        get: function(){
                                return this._isFreeBln;
                        }
                },

                _playingSound:null,

                playingSound:{
                        get:function(){
                                return this._playingSound;
                        }
                }
        }),

        playEffectSound(name, loop = false, finish) {
                let self = this;
                self._isFreeBln = false;
                self._playingSound = name;
                let path = ResPatchManager.instance.getAudioPatch(name);

                AssetManager.instance.getSoundRes(path, Handler.create(self, function(clip) {

                        if(!cc.isValid(self) || self._isFreeBln) {
                                if(finish){
                                        finish();
                                }
                                return ;
                        }

                        if (!clip) {
                                if(finish) {
                                        finish()
                                }
                                return;
                        }

                        self._audioID = cc.audioEngine.play(clip, loop , 1)
                        if(!loop) {
                                cc.audioEngine.setFinishCallback(self._audioID, () => {
                                        self.soundPlayComplete()
                                        if(finish){
                                                finish()
                                        }
                                })
                        }

                }))


        },

        stopPlay() {
                let self = this;
                if (self._audioID) {
                        cc.audioEngine.stop(self._audioID)
                        if(this._stophandler) {
                                clearTimeout(this._stophandler)
                                this._stophandler = null;
                        }
                        this.soundPlayComplete();
                        return;
                }
                this.pause();
                this.stop();
                this.soundPlayComplete();
        },

        soundPlayComplete(){
                let self = this;
                if (this._stophandler) {
                        clearTimeout(this._stophandler)
                        this._stophandler = null;
                }
                if (!self._isFreeBln) {
                        self._isFreeBln = true;
                        if (self._audioID) {
                                cc.audioEngine.uncache(self._audioID)
                        } 
                        self._audioID = null;
                        var MusicManager = require("MusicManager");
                        MusicManager.instance.effectAudioSourceBack(self);
                }
        },

        onDestroy() {
                let self = this;
                if (self._audioID){
                        cc.audioEngine.stop(self._audioID)
                        cc.audioEngine.uncache(self._audioID)
                        self._audioID = null;
                        return;
                }
        }



})