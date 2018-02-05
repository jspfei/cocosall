cc.Class({
    extends: cc.Component,

    properties: {
        sprHeadImg:cc.Sprite
    },

    // use this for initialization
    onLoad: function () {
        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setImageFromByHttp("http://p1.ifengimg.com/a/2017_26/6b429e677db4df2_size131_w800_h532.jpg");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
