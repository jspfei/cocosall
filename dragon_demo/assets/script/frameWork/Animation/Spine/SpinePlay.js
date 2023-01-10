var SpineAnimationName = cc.Class({
        name :"SpineAnimateName",
        properties:{
                animation:"",
        }
})


cc.Class({
        extends:cc.Component,

        properties:{
                spineTarget:sp.Skeleton,
                autoPlay:true,
                loop:false,
                playCount:1,

                loopEnd:false,
                playList:{
                        default:[],
                        type:SpineAnimationName
                },
                autoHide:false,
        },

        onLoad(){
                let self = this;
                if(self.spineTarget){
                        self._spine = self.spineTarget;
                } else {
                        self._spine = self.node.getComponent('sp.Skeleton')
                }

                self._spine.setCompleteListener(() => {
                        self._playEnd();
                })

                self._spine.loop = false;
        },

        start(){
                this._init = true;
                if(this.autoPlay || this._wait) {
                        this._wait = false;
                        this.doPlay()
                }

        },

        onEnable(){
                if(this._init && (this._wait || this.autoPlay)) {
                        this._wait = false;
                        this.doPlay()
                }
        },

        onDisable(){
                this.stop();
        },

        _playEnd(){
                let self = this;
                if(self._playIndex < self.playList.length -1) {
                        self._doPlay(self._playIndex + 1)
                } else if(self.loop) {
                        self._doPlay(0)
                } else if(self._playingCount < self.playCount){
                        self._doPlay(0)
                } else if(self.loopEnd && this.node.active) {
                        self._doPlay(self._playIndex);
                } else {
                        if(this._playFinishCallback){
                                this._playFinishCallback();
                                this._playFinishCallback = null;
                        }
                }
        },

        stop(){
                let self = this;
                if(self._spine != null && cc.isValid(self._spine)) {
                        self._spine.clearTrack(0)
                }
        },

        play(finish){
                this._playFinishCallback = finish;
                if(!this._init) {
                        this._wait = true;
                        return;
                }
                this.doPlay()
        },


        doPlay(){
                this._playIndex = 0;
                this._playingCount = 0
                this._doPlay();
        },

        _doPlay(index = 0){
                let self = this;
                if(!self.playList || self.playList.length ==0) {
                        if(this._playFinishCallback) {
                                this._playFinishCallback();
                                this._playFinishCallback = null;
                        }
                        return
                }

                self._playIndex = index;

                if(index == 0) {
                        self._playingCount ++;
                }

                if(index < self.playList.length) {
                        this._spine.setAnimation(0, self.playList[index].animation, false)
                }

        }
})