var SceneNameType = require("SceneNameType");

var SceneManager = cc.Class({
        name:"SceneManager",

        statics:{
                instance:null,
        },

        properties: () =>({
                _currScene: null,

                currScene: {
                        get:function (){
                                return this._currScene;
                        }
                }
        }),

        switchScene(sceneName, loadingType = "", complete = null, autoChange =  true) {
                
        }
})

SceneManager.instance = new SceneManager()
module.exports = SceneManager