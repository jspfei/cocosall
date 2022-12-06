window.GlobalSDKManager = null;
var SDKManager = cc.Class({
    name: "SDKManager",
    extends: CustomEvent,

    statics: {
        instance: null
    },
    logI(str) {
        console.log("[I]["  + "]" + str);
    },
    log(str) {
        console.log("["  + "]" + str);
    },


});

SDKManager.instance = new SDKManager()
window.jf = SDKManager.instance;
module.exports = SDKManager;