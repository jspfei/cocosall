let ComUtils = require("ComUtils")

var ToastView = cc.Class({
        extends:cc.Component,

        properties: {
               content : cc.Node,
               item_node: cc.Node,
               
               _speed: 70,
               noticeList:[],

               showEffectDuration:0,
               scrolling:false,
               sendToastBtn:cc.Node,
               showEffect:false,
        },

        onLoad: function(){
                let self = this;
                this.scrolling = false;
                let ToastManager = require("ToastManager")
                ToastManager.instance.addToastView(this);

                if (this.sendToastBtn) {
                        this.sendToastBtn.on(cc.Node.EventType.TOUCH_END, ToastManager.instance.showSendToastView, ToastManager.instance);
                }
                self.item_node.on(cc.Node.EventType.TOUCH_END, this.clickItemNode, this);
        },

        clickItemNode(){
                if(this.scrolling && this._scrollingInfo) {
                        if (this.scrollingInfo.userId) {
                                var UIManager = require("UIManager")
                                var UIPanelType = require("UIPanelType")
                                var ResPatchManager = require("ResPatchManager");
                                UIManager.instance.showPanel(ResPatchManager.instance.OtherPlayerInfoPanel, UIPanelType.OTHERPLAYERINFO_PANEL, false, this._scrollingInfo.userId);
                        }
                }
        },

        start(){
                let ToastManager = require("ToastManager")
                let list = ToastManager.instance.getToastList()
                if (list && list.length) {
                        this.initData(list)
                } else {
                        this.configItemString('')
                        this.hide()
                }
        },

        
        onDestroy() {
                let ToastManager = require('ToastManager');
                ToastManager.instance.removeToastView(this);
        },

        initData:function(list){
                this.item_node.stopAllActions();
                this.noticeList = []
                this.scrolling = false;
                list.forEach(function(element) {
                        this.addNotice(element)
                },this) 
        },

        insectNotice:function(info){
                this.noticeList.unshift(info)
                if (!this.scrolling) {
                        this.scrollNotice(this.noticeList[0])
                }
        },

        addNotice(info){
                this.noticeList.push(info)
                if (!this.scrolling) {
                        this.scrollNotice(this.noticeList[0])
                }
        },

        configItemString(str){
                if(this.item_node.getComponent(cc.Label)) {
                        let label = this.item_node.getComponent(cc.Label)
                        label.string = str;
                } else if (this.item_node.getComponent(cc.RichText)) {
                        let rictText = this.item_node.getComponent(cc.RichText);
                        rictText.string = str;
                }
        },
        scrollNotice(info){
                let self = this;
                let needDelay = false
                if (!this.scrolling) {
                        this.show();
                        needDelay = true;
                }

                this.scrollingInfo = info;
                this.scrolling = true;

                ComUtils.arrayRemove(this.noticeList, info);
                if (info.count > 1) {
                        info.count--;
                        this.noticeList.push(info)
                }

                let item = this.item_node
                this.configItemString(info.msg)

                let w = (item.width + this.content.width) /2;
                item.x = w;
                let sec = w / this._speed;

                let delayTime = 0
                if (needDelay && this.showEffect) {
                        delayTime = this.showEffectDuration
                }


        },

        scrollFinish(info){
                if (this.noticeList.length) {
                        this.scrollNotice(this.noticeList[0])
                } else {
                        this.scrolling = false;
                        let ToastManager = require("ToastManager")
                        let list = ToastManager.instance.getToastList()
                        if (list && list.length) {
                                list.forEach(function(element) {
                                        this.addNotice(element)
                                },this)
                        } else {
                                this.hide();
                        }
                }
        },

        show(){
                this.node.active = true;
        },

        hide(){
                this.node.active = false;
        }
})