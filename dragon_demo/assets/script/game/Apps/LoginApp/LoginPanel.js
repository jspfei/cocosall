var UIPanelBase = require("UIPanelBase");

cc.Class({
    extends: UIPanelBase,

    properties: {
        _panelName: {
            default: "LoginPanel",
            override: true
        },
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        let LoginManager = require("LoginManager");
        LoginManager.instance.setView(self);
      
    },

    showLoginView(){


    }
    // update (dt) {},
});
