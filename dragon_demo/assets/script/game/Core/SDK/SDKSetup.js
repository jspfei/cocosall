var SDKManager = require("SDKManager");

var SDKSetup = cc.Class({
    extends: cc.Component,

    onLoad () {
        SDKManager.instance.setup();
    }
})