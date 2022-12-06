cc.Class({
    extends: cc.Component,

    properties: {
        _loginPanel:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this;
        self.initView();
        cc.g_start  = this;
    },
    initView(){
        let self = this;
        let AssetModelFactory = require("AssetModelFactory");
        let ResPatchManager = require("ResPatchManager");

    }

    // update (dt) {},
});
