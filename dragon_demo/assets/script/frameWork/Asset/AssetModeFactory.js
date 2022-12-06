 var Dictionary = require("Dictionary")
 var AssetManager = require("AssetManager")
 var AssetResType = require("AssetResType")
 var Handler = require("Handler")

var AssetModelFactory = cc.Class({
    name: "AssetModelFactory",

    statics: {
        instance: null
    },
    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});

AssetModelFactory.instance = new AssetModelFactory()
module.exports = AssetModelFactory;