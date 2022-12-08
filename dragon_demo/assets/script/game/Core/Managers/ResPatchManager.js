var ResPatchManager = cc.Class({
    name: "ResPatchManager",

    statics:{
        instance:null,
    },

    properties: {
        LoginPanel:{
            get:function(){
                return "Prefab/Login/LoginPanel"; 
            }
        }
    }, 
});

ResPatchManager.instance = new ResPatchManager()
module.exports = ResPatchManager;