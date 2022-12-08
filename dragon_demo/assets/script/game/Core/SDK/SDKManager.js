window.GlobalSDKManager = null;
var SDKManager = cc.Class({
    name: "SDKManager", 

    statics: {
        instance: null
    },
    logI(str) {
        console.log("[I]["  + "]" + str);
    },
    log(str) {
        console.log("["  + "]" + str);
    },
    setup() {
        window.GlobalSDKManager = this;
    },

});

SDKManager.instance = new SDKManager()
window.jf = SDKManager.instance;
module.exports = SDKManager;