
var Handler = require("Handler");

cc.Class({
    extends: cc.Component,

    properties: {
        _loginPanel: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let self = this;
        self.initView();
        cc.g_start = this;


     
    },

    start() {

    },
    initView() {
        let self = this;
        let AssetModelFactory = require("AssetModelFactory");
        let ResPatchManager = require("ResPatchManager");
        AssetModelFactory.instance.createEnemyAsyn(ResPatchManager.instance.LoginPanel, Handler.create(self, (obj) => {
            if (obj != null) {
                obj.parent = cc.find("Canvas");
                self._loginPanel = obj;



                self.initLogin(); 
            }
            //测试


        }))
    },
    init() {

    },
    initLogin() {
        let LoginManager = require("LoginManager");
        LoginManager.instance.init();
    },
    // update (dt) {},
});
