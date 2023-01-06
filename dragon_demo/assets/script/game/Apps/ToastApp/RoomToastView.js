let ToastView = require('ToastView')
cc.Class({
        extends:ToastView,

        properties:{
                _topMargin:4,
        },

        onLoad(){
                let self = this;
                this.scrolling = false;
                if (this.sendToastBtn) {
                        var ToastManager = require("ToastManager")
                        this.sendToastBtn.on(cc.Node.EventType.TOUCH_END, ToastManager.instance.showSendToastView, ToastManager.instance);
                }
                self.item_node.on(cc.Node.EventType.TOUCH_END, this.clickItemNode,this)
        },

        scrollFinish(info){
                if (this.noticeList.length){
                        this.scrollNotice(this.noticeList[0])
                } else {
                        this.scrolling = false;
                        this.hide()
                }
        },

        show(){
                let self = this; 
                this.node.stopAllActions()
                if (self.node.parent == null) {
                        self.node.parent = cc.find('Canvas')
                }
                self.node.active = true;

                if (this.showEffect) {
                        this.node.position = cc.v2(0, (cc.winSize.height + 40) / 2)
                        let toY = ((cc.winSize.height - 40 )/ 2 - this._topMargin);
                        TweenLite.killTweensOf(this.node);
                        TweenLite.to(this.node, this.showEffectDuration, {ease: Linear.easeIn, y : toY, onComplete:function(){

                        }})
                } else {
                        this.node.position = cc.v2(0,(cc.winSize.height-40)/2)
                        this.node.active = true;
                }
        },

        hide(){
                let self = this;
                this.node.stopAllActions();
                if (this.showEffect) {
                        let toY = (cc.winSize.height + 40)/ 2
                        this.node.position = cc.v2(0, ((cc.winSize.heigth - 40)/ 2 - this._topMargin));

                        TweenLite.killTweensOf(this.node);
                        TweenLite.to(this.node, this.showEffectDuration, {ease: Linear.easeIn, y : toY, onComplete: function(){
                                self.node.active = false;
                                self.node.parent = null;
                        }})
                } else {
                        this.node.active = false;
                }
        }
})