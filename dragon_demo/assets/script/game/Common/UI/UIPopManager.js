var AssetModelFactory = require("AssetModelFactory")
var Handler = require("Handler")


var ResPatchManager = require("ResPatchManager")

var UIPopManager = cc.Class({
        name: "UIPopManager",
    
        statics: {
            instance: null
        },

        properties: () => ({
                _rewardPop:null,
                _textEnterPop:null,
                _textEnterCancelPop:null,
        }),

        popRewardPop(){

        },

        popGoldRewardType(){

        },

        popGoldRewardPop(){

        },

        popTextEnterPop(){

        },

        popTextEnterPopMiddle(){

        },

        popTextClosePopMiddle(){


        },


        popTextEnterCancelPop(){

        },

        closeTextEnterCancelPop(){

        }



});

UIPopManager.instance = new UIPopManager()
module.exports = UIPopManager