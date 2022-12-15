var UIComm_Frame = require("UIComm_Frame")
var Handler = require("Handler");
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

        closeBtnClickCallBack:Handler,
        _frameCloseBtnClickHandler:Handler,
    }, 

    start() {

    },

    init(root){

    },

    show(uiParam) {

    },

    showPanelEffect(){

    },

    creatPrefabEnemyObj(prefabPatch,callBackHandler) {

    },

    getAsstet(url, type, callBackHandler) {

    },

    turnBackPrefabObjToPool(prefabPatch,obj){

    },

    closeBtnClick(){

    },

    close(){

    },

    onDestroy(){
        
    }

});
