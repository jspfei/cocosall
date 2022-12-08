cc.Class({
    extends: cc.Component,

    properties: {
         
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (cc.g_start){
            cc.g_start.initView();
        }
    },

    start () {

    },

    // update (dt) {},
});
