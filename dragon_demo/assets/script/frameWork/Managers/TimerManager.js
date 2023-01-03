var Handler = require("Handler")


var TimerManager = cc.Class({
        name:"TimerManager",
        statics: {
                instance:null,
        },

        properties:() =>({
                _isStarBln : false,
                _idle:0.02,
                _time:0,
                _timeCallHandlerList:[Handler],
                _startTime:0,
                _tempTime:0,
                _setTimeOutList:[],
        }),

        addTimeCall(callBack, isLoop = false) {
                let  self = this;
                if(!self._isStarBln){
                        self._isStarBln = true;
                        self._tempTime = new Data().getTime();
                }

                if(self._timeCallHandlerList.indexOf(callBack) == -1) {
                        self._timeCallHandlerList.push(callBack)
                }
        },

        setTimeout(timeout, callBackHandler, loop = false) {
                let self = this;
                if(!self._isStarBln) {
                        self._isStarBln = true;
                        self._tempTime = new Date().getTime();
                }

                let bln =  self.checkIsHasTimeOutHandler(timeout, callBackHandler, loop)  
                if(!bln) {
                        let obj = {}
                        obj.currTimeCount = 0;
                        obj.timeout = timeout;
                        obj.loop = loop;
                        obj.callBackHandler = callBackHandler;
                        self._setTimeOutList.push(obj)
                }
        },

        removeTarget(target) {
                let self = this;
                if (target == null) {
                        return;
                }

                let i = 0;
                let len = self._setTimeOutList.length;
		for(i = 0; i < len; i++){
			let setTimeOutObj = self._setTimeOutList[i];
			if(target == setTimeOutObj.callBackHandler.caller){
				self._setTimeOutList.splice(i, 1);
				setTimeOutObj.currTimeCount = 0;
				setTimeOutObj.timeout = 0;
				setTimeOutObj.loop = false;
				if(setTimeOutObj.callBackHandler != null){
					setTimeOutObj.callBackHandler.recover();
					setTimeOutObj.callBackHandler = null;
				}
				setTimeOutObj = null;
				break;
			}
		}
        },

        removeTimeOut(callBackHandler) {
                let self = this;
                if(callBackHandler == null) {
                        return;
                }

                let i = 0;
                let len = self._setTimeOutList.length;
                for(i = 0; i < len ;i++){
                        let setTimeOutObj = self._setTimeOutList[i];
                        if(callBackHandler == setTimeOutObj.callBackHandler) {
                                self._setTimeOutList.splice(i, 1);
                                setTimeOutObj.currTimeCount = 0
                                setTimeOutObj.timeout = 0;
                                setTimeOutObj.loop = false;
                                if(setTimeOutObj.callBackHandler != null) {
                                        setTimeOutObj.callBackHandler.recover()
                                        setTimeOutObj.callBackHandler = null;
                                }
                                setTimeOutObj = null;
                                callBackHandler = null;
                                break;
                        }
                }
        },

        removeTimeCall(callBack) {

                let self = this;
                let index = self._timeCallHandlerList.indexOf(callBack)
                if(index > -1) {
                        let handler = self._timeCallHandlerList.splice(index, 1)[0];
                        if(handler != null) {
                                handler.recover();
                        }
                } 
        },

        timeUpdate(){
                let self = this;
                let currTime = new Date().getTime()
                let timeStamp = currTime - self._tempTime;
                self._tempTime = currTime;

                let i = 0 ;
                let len = self._timeCallHandlerList.length;
                for (i = 0; i < len; i++) {
                        let handler = self._timeCallHandlerList[i];
                        if(handler) {
                                handler.runWith([timeStamp])
                        }
                }

                let delTimeOutList = []
                len = self._setTimeOutList.length;
                for(i = 0 ; i <  len; i++) {
                        let setTimeOutObj = self._setTimeOutList[i]
                        if(setTimeOutObj) {
                                setTimeOutObj.currTimeCount += timeStamp;
                                if(setTimeOutObj.currTimeCount >= setTimeOutObj.timeout) {
                                        if(setTimeOutObj.callBackHandler != null) {
                                                setTimeOutObj.currTimeCount = 0;
                                                setTimeOutObj.callBackHandler.run();
                                        }
                                        if(!setTimeOutObj.loop) {
                                                delTimeOutList.push(setTimeOutObj)
                                        }
                                }
                        }
                }

                while(delTimeOutList.length > 0 ){
                        let delObj = delTimeOutList.pop();
                        let index = self._setTimeOutList.indexOf(delObj);
                        if(index > -1) {
                                self._setTimeOutList.splice(index, 1)
                        }
                        delObj.currTimeCount = 0;
                        delObj.timeout = 0;
                        delObj.loop = false;
                        if(delObj.callBackHandler != null) {
                                delObj.callBackHandler.recover();
                                delObj.callBackHandler = null;
                        }
                        delObj = null;
                }
                delTimeOutList = null;

        },

        closeTime(){

        },


        checkIsHasTimeOutHandler(timeout, callBackHandler, loop) {
                let self  = this;
                if(callBackHandler != null) {
                        let len = self._setTimeOutList.length;
                        let i = 0
                        for(i = 0 ; i < len ; i++) {
                                let dataObj = self._setTimeOutList[i]
                                if(dataObj != null && dataObj.callBackHandler == callBackHandler) {
                                        return true;
                                }
                        }
                }

                return false;
        }


})

TimerManager.instance = new TimerManager();
module.exports = TimerManager