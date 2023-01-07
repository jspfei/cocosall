 
var Dictionary = require("Dictionary")

var UIManager = cc.Class({
     
    statics:{
        instance:null,
    },

    properties: {
        _UIRootGameObj:cc.Node, 
        _cacheUIDic:Dictionary, //已经初始过的面板缓存
        _closeUIList:[], // 当前添加在场景的UI
        _currPanel:null, // 当前显示最上层的UI
        _lastShowPanel:null,  // 上次显示的面板数组
        _curPanelName:"", // 当前显示的面板名称
        _isBuliding:false,
        _waitBulidList:[],
    },

    ctor(){
        let self = this;
        self._cacheUIDic = new Dictionary();
        self._closeUIList = new Array();
        self._lastShowPanel = new Array();
    },

    setGameRoot(obj){
        this._UIRootGameObj = obj;
    },
 

    showOtherPlayerPanel(userId) {
        
    },

    showPlayerHead(headUrl, defSprite){

    },

    showShopPanel(isCloseCurPanle = false, uiParam = null) {

    },

    showVipPanel(){


    },

    showVipLogAwardPanel(callback){

    },

    showFeedBackPannel(){

    },

    showPanel(patch, panelName, isCloseCurPanle = false, uiParam = null, hideCurrent = false) {

    },

    buildWaitPanel(){


    },

    showSecondLevelPanel(){

    },

    hidePanel(toHidePanel = null) {

    },

    back(){

    },

    closePanel(name){

    },


    closeAllScenePanel(){

    },

    getPanelByName(name) {

    },

    getCurrShowPanel(){

    },

    getUIRootGameObject(){

    },

    getCurPanelName(){

    },
    // update (dt) {},
});


UIManager.instance = new UIManager()
module.exports = UIManager;