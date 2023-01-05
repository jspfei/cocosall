var AssetModelFactory = require("AssetModelFactory");
var Handler = require("Handler");

var UIComm_TipsStrItem = require("UIComm_TipsStrItem");
var UIComm_EnterCancelTips = require("UIComm_EnterCancelTips");
var TipsStrManager = cc.Class({
        name :"TipsStrManager",

        statics:{
                instance : null,

                NORMAL:1,
                SMALL:2,
                ENTER_CANCE:3,
        },

        properties: () => ({
                _normalTipsPool:[],
                _smallTipsPool:[],
                _enterAndCanceTipsPool:[],

        }),

        showTips(dir, type, startPos, dicY, moveTime, standTime = 2000, callBack = null){
                let self = this;
                switch(type) {
                        case  TipsStrManager.NORMAL:
                                self.normalTipsShow(dir, type , startPos, dicY, moveTime, standTime)
                                break;
                        case TipsStrManager.SMALL:
                                self.smallTipsShow(dir, type, startPos, dicY, moveTime, standTime)
                                break;
                        case TipsStrManager.ENTER_CANCE:
                                self.enterCancelTipsShow(dir, type, startPos, dicY, moveTime, standTime)
                                break;
                }
        },

        normalTipsShow(dir, type, startPos, dicY, moveTime, standTime = 1000) {
                let self = this;
                let tipsItem = null;
                if (self._normalTipsPool != null && self._normalTipsPool.length > 0) { 
                        tipsItem = self._normalTipsPool.shift()
                        tipsItem.move(dir, type, startPos, dicY, moveTime, standTime)
                } else {
                        let params = [dir, type ,startPos, dicY, moveTime, standTime, callBack];
                        AssetModelFactory.instance.createEnemyAsyn("Prefab/CommUI/Tips/EnterCancelTips", Handler.create(self, function(){ 
                                tipsItem.getComponent(UIComm_TipsStrItem);
                                tipsItem.move(dirb, typeb, startPos, dicYb, moveTimeb, standTime)        
                        },params))
                }
        },

        smallTipsShow(dir, type, startPos, dicY, moveTime) {

        },

        enterCancelTipsShow(dir, type, startPos, dicY, moveTime, standTime, callBack) {
                let self = this;
                let tipsItem = null;
                if (self._enterAndCanceTipsPool != null && self._enterAndCanceTipsPool.length > 0) {
                        tipsItem = self._enterAndCancelTipsPool.shift()
                        tipsItem.move(dir, type, startPos, dicY, moveTime, standTime, callBack)
                } else {
                        let params = [dir, type, startPos, dicY, moveTime, standTime, callBack]
                        AssetModelFactory.instance.createEnemyAsyn("Prefab/CommUI/Tips/EnterCancelTips",Handler.create(self, function(dirb, typeb, startPosb, dicYb, moveTimeb, stantTimeb, callBackb, obj){
                                tipsItem = obj.getComponent(UIComm_EnterCancelTips);
                                tipsItem.move(dirb, typeb, startPosb,dicYb, moveTimeb,stantTimeb,callBackb)
                        },params));
                }
        },

        backPool(type, node) {
                let self = this;
                switch(type) {
                        case TipsStrManager.NORMAL:
                                if (self._normalTipsPool.indexOf(node) == -1) {
                                        self._normalTipsPool.push(node)
                                }
                                break;
                        case TipsStrManager.SMALL:
                                if (self._smallTpisPool.indexOf(node) == -1) {
                                        self._smallTpisPool.push(node)
                                }
                                break;

                        default:
                                break;
                }
        }

}) 
TipsStrManager.instance = new TipsStrManager();
module.exports = TipsStrManager;