var Handler = require("Handler")

var SpineCtrComponent = cc.Class({
        extends: cc.Component,
        editor: {
            //requireComponent: sp.Skeleton
        },

        properties:() =>({
                _assectName:"",
                _boneName:"",
                _spine: sp.Skeleton,

                _isStart:false,
                _playActName:"",
                _isLoop:false,
                _playCount:0,
                _hasShowBln:false,
                _autoHide:false,

                _startPlayCallBack:Handler,
                _interruptCallBack:Handler,
                _endPlayCallBack:Handler,
                _completeCallBack:Handler,
                _disposeCallBack:Handler,
                _frameEnterCallBack:Handler,

                startPlayCallBack : {
                        set:function(params) {
                                this._startPlayCallBack = params;
                        }
                },

               interruptCallBack :{
                        set :function(params) {
                                this._interruptCallBack = params;
                        }
               } ,

               endPlayCallBack:{
                        set:function(params) {
                                this._endPlayCallBack = params;
                        }
               },

               completeCallBack:  {
                        set:function(params) {
                                this._completeCallBack = params;
                        }
               },

               disposeCallBack:{
                        set:function(params) {
                                this._disposeCallBack = params;
                        }
               },

               frameEnterCallBack:{
                        set:function(params) {
                                this._frameEnterCallBack = params;
                        }
               },

               assectName:{
                        set:function(params) {
                                this._assectName = params;
                        },
                        get:function(){
                                return this._assectName;
                        }
               },

               boneName:{
                        set:function(params) {
                                this._boneName = params;
                        },
                        get:function() {
                                return this._boneName;
                        }
               },

               spineTarget:sp.Skeleton,
               _startAddFuncs:[],
        }),

        onLoad(){
                let self = this;
                if (self .spineTarget) {
                        self._spine = self.spineTarget;
                } else{
                        self._spine = self.node.getComponent('sp.Skeleton');
                }

                self._spine.setStartListener(trackEntry => {
                        let animationName = trackEntry.animation ? trackEntry.animation.name : "";
                        if (self._startPlayCallBack) {
                                self._startPlayCallBack.runWith([animationName])
                        }
                });

                self._spine.setInterruptListener(trackEntry => {
                        let animationName = trackEntry.animation ? trackEntry.animation.name: ""
                        if (self._interruptCallBack != null) {
                                self._interruptCallBack.runWith([animationName])
                        }
                });

                self._spine.setEndListener(trackEntry => {
                        let animationName = trackEntry.animation ? trackEntry.animation.name :""
                        if(self._endPlayCallBack != null){
                                self._endPlayCallBack.runWith([animationName])
                        }
                });

                self._spine.setDisposeListener(trackEntry => {
                        let animationName = trackEntry.animation ? trackEntry.animation.name : ""
                        if(self._disposeCallBack != null){
                                self._disposeCallBack.runWith([animationName])
                        }
                });

                self._spine.setCompleteListener((trackEntry, loopCount) => {
                        let animationName = trackEntry.animation ? trackEntry.animation.name : "";
                        let _autoHide = self._autoHide;
                        if(self._completeCallBack != null) {
                                if(self._plactAct2) {
                                        let end = loopCount >= self._playCount;
                                        self._completeCallBack.runWith([animationName, loopCount,end])
                                } else {
                                        self._completeCallBack.runWith([animationName, loopCount])
                                }
                        }

                        self._playActName = ""
                        if(loopCount < self._playCount){
                                return;
                        }

                        if(_autoHide) {
                                self.backToPool()
                        }
                        self._isLoop = false;
                });

                self._spine.setEventListener((trackEntry , event) =>{
                        let animationName = trackEntry.animation ? trackEntry.animation.name : ""
                        if(self._completeCallBack != null){
                                self._completeCallBack.runWith([event]);
                        }
                })
        },

        start(){
                let self = this;
                self._isStart = this;
                if(self._hasShowBln) {
                        self._doAct()
                        if(self._startAddFuncs) {
                                self._startAddFuncs.forEach(element => {
                                        element();
                                });
                                self._startAddFuncs = []
                        }
                }
        },

        playAct(actName, loop, autoHide, complete){
                let self = this;
                self._placAct2 = false;
                self._playActName = actName;
                self._isLoop = loop;
                self._playCount = 1;
                if(self._completeCallBack != null) {
                        self._completeCallBack = null;
                }
                self._completCallBack = complete;
                self._autoHide = autoHide;
                if(self._isStart){
                        self._doAct();
                        return
                }
                self._hasShowBln = true;
        },

        playAct2(actName, playCount = 1  , autoHide, complete){
                let self = this;
                self._plactAct2 = true;
                self._playActName = actName;
                self._isLoop = playCount !=1;
                if(self._completeCallBack != null){
                        self._completeCallBack = null;
                }
                if (complete ){
                        complete.once = false;
                }

                self._completeCallBack = complete;
                self._autoHide = autoHide;
                self._playCount = playCount;
                if(self._isStart){
                        self._doAct()
                        return;
                }
                self._hasShowBln = true;
        },

        _doAct(){
                let self = this;
                if(self._spine != null) {
                        self._spine.setAnimation(0, self._playActName, self._isLoop)
                }
        },

        stop(){
              let self = this;
              if(self._spine != null)   {

              }
              self._completeCallBack = null;
              self._playActName = ""
              self._isLoop = false;
        },
        /**
         *在动画中寻找插槽
         *
         * @param {*} name
         */
        getSlotByName(name) {

                let self = this;
                if (self._spine != null) {
                        let sk = self._spine.skeletonData;
                        if(sk != null) {
                                let runTimeSk = sk.getRuntimeData();
                                if(runTimeSk != nul) {
                                        let slots = runTimeSk.slots;
                                        let i = 0
                                        let len = slots.length;
                                        for(i = 0; i < len ;i++) {
                                                if(slots[i].name == name) {
                                                        return slots[i];
                                                }
                                        }
                                }
                        }
                }
        },

        getSkinkObj(name) {
                let self = this;
                if (self._spine != null) {
                        let sk = self._spine.skeletonData;
                        if(sk !=null) {
                                let skins = sk.skeletonJson.skins.default;
                                for(const key in skins) {
                                        if(skins.hasOwnProperty(key)) {
                                                const element = skins[key]
                                                if(key == name) {
                                                        return element;
                                                }
                                        }
                                }
                        }
                }
        },

        findSlot(name) {
                let self =this; 
                if(self._spine != null) {
                        let slot = self._spine.findSlot(name)
                        return slot;
                }
        },

        pushObjectToSlot(slotName, obj) {
                let self = this;
                if(self._spine != null) {
                        let slot = self.getSlotByName(slotName)
                        if(slot != null){

                        }
                }
        },

        backToPool(){
                let self  = this;
                self.stop()
                if(self.node && cc.isValid(self.node)){
                        self.node.parent = null;
                        let SpinePool = require("SpinePool")
                        SpinePool.instance.backToPool(self)
                }
        }


})