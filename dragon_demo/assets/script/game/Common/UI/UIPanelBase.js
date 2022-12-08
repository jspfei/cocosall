var UIComm_Frame = require("UIComm_Frame")

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
