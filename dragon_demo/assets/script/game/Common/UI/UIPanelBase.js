var UIComm_Frame = require("UIComm_Frame")
var Handler = require("Handler");

var AssetModelFactory = require("AssetModelFactory");
var MusicManager = require("MusicManager");
var AssetManager = require("AssetManager");
cc.Class({
    extends: cc.Component,

    properties: {
        _panelName: "",
        _panelTF: null,
        _UIRootGameObject: null,
        _isInited: false,
        _isShow: false,
        _isHasShowEffect: false,
        _creatObjList: [],
        _getAsseteList: [],
        _frame: UIComm_Frame,
        _isInit: false,

        panelName: {
            set: function (value) {
                this._panelName = value;
            },
            get: function () {
                return this._panelName;
            }
        },

        frame:{
            get:function(){
                return this.panelFrame;
            }
        },

        closeBtnClickCallBack:Handler,
        _frameCloseBtnClickHandler:Handler,
    }, 

    start() {
        let self = this;
        self._isInit = true;
        self._frame = self.panelFrame.getComponent(UIComm_Frame);
        self._frameCloseBtnClickHandler = Handler.create(self, self.closeBtnClick, null, false)
        self._frame.closeBtnClickCallBack = self._frameCloseBtnClickHandler;

        if(self._isHasShowEffect){
            if(self.panelFrame !=null) {
                self.node.opacity = 255;
                self.panelFrame.setScale(0.7);
                self.panelFrame.opacity = 0;
                self.showPanelEffect();
            }
        }
    },

    init(root){
        let self = this;
        self._UIRootGameObject = root;
    },

    show(uiParam) {
        let self = this;

        if(self.node == null) { 
            return;
        }

        self._isShow = true;
        self.uiParam = uiParam;
        if (cc.isValid(self._UIRootGameObject)){
            self.node.parent = self._UIRootGameObject;
        } else {
            self._UIRootGameObject = cc.find('Canvas');
            self.node.parent = self._UIRootGameObject;
        }

        self.node.setPosition(0,0);
        if(self._isHasShowEffect && self._isInit){
            if(self.panelFrame != null){
                self.node.opacity = 255;
                self.panelFrame.setScale(0.7)
                self.panelFrame.opacity = 0;
                self.showPanelEffect();
            }
        }
    },

    showPanelEffect(){
        let self = this;
        if (self._isHasShowEffect){
            if(self.panelFrame != null){
                TweenLite.killTweensOf(self.panelFrame);
                TweenLite.to(self.panelFrame, 0.3, {ease:Power4.easeOut, opacity:255});
                TweenLite.to(self.panelFrame, 0.45, {ease:Back.easeOut.config(3),scale:1, onComplete:function(){
                    self.showPanelEffectComplete();
                }});

                MusicManager.instance.playEffectSound("return");
            }
        }
    },  
    // 弹窗动画完成, 开始初始化数据
    showPanelEffectComplete(){

    },
    creatPrefabEnemyObj(prefabPatch,callBackHandler) {
        let self = this;
        if (self._creatObjList.indexOf(prefabPatch) == -1){
            self._creatObjList.push(prefabPatch)
        }
        AssetModelFactory.instance.createEnemyAsyn(prefabPatch, callBackHandler)
    },

    getAsstet(url, type, callBackHandler) {
        let self = this;
        if (self._getAssteList.indexOf(url) == -1) {
            self._getAssteList.push(url);
        }
        AssetManager.instance.getRawAsset(url, type , callBackHandler)
    },

    turnBackPrefabObjToPool(prefabPatch,obj){
        AssetModelFactory.instance.returnEnemy(prefabPatch,obj);
    },

    closeBtnClick(){
        var UIManager = require("UIManager")
        UIManager.instance.hidePanel(this);
    },

    close(){
        let self = this;
        self._isShow = false;
        if (self.node != null) {
            if (self ._isHasShowEffect) {
                TweenLite.killTweensOf(self.node)
                TweenLite.to(self.node, 0.3, {ease: Power2.easeOut, opacity:0, onComplete:function(){
                    if(self.node && self.node.parent) {
                        self.node.parent = null;
                    }
                }})
            } else if(self.node.parent){    
                self.node.parent = null;
            }
        }
    },

    onDestroy(){
            let self = this;
            self._isShow = false;
            if (cc .isValid(self.node)) {
                TweenLite.killTweensOf(self.node)
            }
            if(self._creatObjList != null){
                while(self._creatObjList.length) {
                    let prefabPatch = self._creatObjList.pop();
                    AssetModelFactory.instance.releasePool(prefabPatch)
                }
            }

            if(self._getAssteList != null) {
                while(self._getAssteList.length) {
                    let assPatch = self._getAssteList.pop();
                    AssetManager.instance.releaseRes(assPatch);
                }
            }
            self._UIRootGameObject = null;
    }

});
