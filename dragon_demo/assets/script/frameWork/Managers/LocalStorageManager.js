var LocalStorageManager = cc.Class({
        name:"LocalStorageManager",
        statics:{
                instance:null,
        },

        properties:() =>({
                ACCOUNT_NAME:{
                        get(){
                                return "AccountName"+this.domain;
                        }
                }
        }),

        getGameListKey(gameType){
                return 'kGameRoomInfo'+gameType;
        },

        configDomain(ip){
                let arr = ip.split(':')
                if(arr && arr.length) {
                        this.domain = arr[0];
                }
        },

        saveData(key, data) {
                if(!key) {

                }
                cc.sys.localStorage.setItem(key, data);
        },

        readData(key){
                var userData = cc.sys.localStorage.getItem(key);
                return userData;
        },

        removeItem(key){
                cc.sys.localStorage.removeItem(key);
        },

        
});

LocalStorageManager.instance = new LocalStorageManager();
module.exports = LocalStorageManager