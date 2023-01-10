cc.Class({
        extends: cc.Component,

        properties: {
                animate:cc.Animation,
                timeout:0,
                timeoutCall:false,
                _clipName:null,
                _startTime:0,
        },

        onLoad(){
                let self = this;
                if (this.animate){
                        this.animate.on('finished',function(){
                                if(self._finishHandle != null){
                                        self._finishHandle()
                                }
                                self.clearTimeout()
                                self.animate.setCurrentTime(0);
                        });
                }
        },

        play(finish) {
                this._finishHandle = finish;
                this._hasPlay = true;
                this._clipName = null;
                this._startTime = 0;

                if (this._init && this.animate) {
                        this.animate.setCurrentTime(0)
                        this.animate.play(this._clipName,this._startTime)
                        if(this.timeoutCall){
                                this.playTimeout()
                        }
                } else if(this._init && this.timeout > 0) {
                        this.playTimeout()
                }
        },

        playWith(name, startTime = 0, timeout = 0, finish = null){
                this._finishHandle = finish
                this._clipName = name;
                this._startTime = startTime;
                this._hasPlay = true;
                this.timeout = timeout;

                if(this._init && this.animate){
                        this.animate.setCurrentTime(0)
                        this.animate.play(this._clipName, this._startTime)
                        if(this.timeoutCall) {
                                this.playTimeout()
                        }
                } else if(this._init && this.timeout > 0){
                        this.playTimeout()
                }
        },

        stop(){
                if(cc.isValid(this.node)){
                        this.node.stopAllActions()
                }
                this.clearTimeout()
                if(cc.isValid(this.animate)){
                        this.animate.stop();
                }
        },

        start(){
                let self = this;
                this._init = true;
                if(this._hasPlay){
                        if(this.animate){
                                this.animate.setCurrentTime(0)
                                this.animate.play(this._clipName, this._startTime)
                                if(this.timeoutCall){
                                        this.playTimeout()
                                }
                        } else if(this.timeout > 0) {
                                self.playTimeout()
                        }
                }
        },

        playTimeout(){
                this.clearTimeout()
                let self = this;
                if (this.timeout > 0) {
                        this._timeoutId = setTimeout(() => {
                                if(self._finishHandle) {
                                        self._finishHandle();
                                }
                        },this.timeout * 1000)
                }
        },

        clearTimeout(){
                if (this._timeoutId) {
                        clearTimeout(this._timeoutId)
                        this._timeoutId = null;
                }
        },

        onDestory(){
                this.clearTimeout()
        }

});