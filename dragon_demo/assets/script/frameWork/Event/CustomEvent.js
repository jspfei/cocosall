var CustomEvent = cc.Class({
        name :"CustomEvent",

        properties:()=>({
                eventTarget:cc.EventTarget,
        }),

        ctor:function(){
                this.eventTarget = new cc.EventTarget()
        },

        dispatchEventWith(eventType, dataObj) { 
                this.eventTarget.emit(eventType, {detail:dataObj})
        },


        addEventListener(eventType, callBackHandler, target) {
                this.eventTarget.on(eventType, callBackHandler, target)
        },


        removeEventListener(evenType, callBackHandler, target) {        
                this.eventTarget.off(evenType, callBackHandler, target)
        },

        removeAllEventListener(target) {
                this.eventTarget.targetOff(target)
        }


});