 var AssetResType = require("AssetResType")

var AssetManager = cc.Class({
    name: "AssetManager",

    properties: { 
    }, 

    getRawAsset(url, type, callBackHandler) {
        let self = this;
        switch(type) {
            case AssetResType.normal:
            case AssetResType.prefab:
                self.getNormalAsset(url, callBackHandler);
                break;
            case AssetResType.spriteAtlas:
                self.getSpriteAtlas(url, callBackHandler);
                break;
            case AssetResType.spriteFrame:
                self.getSpriteFrame(url, callBackHandler);
                break;
            case AssetResType.sound:
                self.getSoundRes(url, callBackHandler);
                break;
            default:
                self.getNormalAsset(url,callBackHandler)
                break;
        }
    },

    getNormalAsset(url, callBackHandler){
        cc.resources.load(url, function(err, obj){
            if(err) {
                jf.log("[获取本地资源错误]> url > "+ url +" error > "+err.message);
                if(callBackHandler != null) {
                    callBackHandler.run();
                }
            } else {
                if(callBackHandler != null){
                    callBackHandler.runWith([obj])
                }
            }
        })
    },


    getSpriteAtlas(url, callBackHandler){
        cc.resources.load(url, cc.SpriteAtlas, function(err, atlas){
            if(err) {
                jf.log("[获取本地资源错误]> url > "+ url +" error > "+err.message);
                if(callBackHandler != null) {
                    callBackHandler.run();
                }
            } else {
                if(callBackHandler != null){
                    callBackHandler.runWith([atlas])
                }
            }
        })
    },

    getSpriteFrame(url, callBackHandler){
        cc.resources.load(url, cc.SpriteFrame, function (err, spriteFrame) {
            if(err){
                ztj.log("[获取本地资源错误]> url > " + url + " error > " + err.message);      
            }else{
                if(callBackHandler != null){
                    callBackHandler.runWith([spriteFrame]);
                }
            }
        });
    },

    getSoundRes(url, callBackHandler){
        cc.loader.loadRes(url.replace('resources/',''), cc.AudioClip, function (err, clip) {
            if(err){
                ztj.log("[获取本地资源错误]> url > " + url + " error > " + err.message);      
            }else{
                if(callBackHandler != null){
                    callBackHandler.runWith([clip]);
                }
            }
        });
    },


    getUrlTexture(remoteUrl, txType, callBackHandler){
        cc.loader.load({url: remoteUrl, type: txType}, function(err, texture) {
            if(callBackHandler != null) {
                if(err) {
                    callBackHandler.runWith([null]);
                } else {
                    callBackHandler.runWith([texture]);
                }
            }
        })
    },

    releaseRes(url) {
        cc.assetManager.releaseAsset(url);
    }
});

AssetManager.instance = new AssetManager();
module.exports = AssetManager;
