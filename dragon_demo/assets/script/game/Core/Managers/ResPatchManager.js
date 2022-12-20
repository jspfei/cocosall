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
        },

        LevelCSV:{
            get:function(){
                return "Level_csv"
            }
        },

       
    }, 
    getCSVPatch(name){
             
        return "CSV/" + name;
    },
});

ResPatchManager.instance = new ResPatchManager()
module.exports = ResPatchManager;