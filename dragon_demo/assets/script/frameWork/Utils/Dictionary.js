 

 var Dictionary = cc.Class({
    name :"Dictionary",

    properties: ()=>({
        keystore: new Array(),
        datastore:new Array(),
        _len:0 
    }),

    add(key, value) {
        let self = this;
        self.keystore.push(key)
        self.datastore.push(value);
        self._len++;
    },

    find(key){
        let self = this;
        let index = self.keystore.indexOf(key);
        if(index > -1) {
            return self.datastore[index];
        }

        return null;
    },

    hasOwnPropertyKey(key){
        let self = this;
        let index = self.keystore.indexOf(key)
        if(index > -1){
            return true;
        } else{
            return false;
        }
    },

    remove(key){
        let self = this;
        let index = self.keystore.indexOf(key)
        if(index > -1){
            self.keystore.splice(index, 1);
            self.datastore.splice(index, 1);
            self._len --;
        }
    },

    count(){
        return this._len;
    },

    getKeyByIndex(index) {
        let  self = this;
        if (index < 0 || index >= self._len){
            return null;
        }
        let key = self.keystore[index]
        return key;
    },

    getValueByIndex(index) {
        let self = this;
        if (index < 0 || index >= self._len) {
            return null;
        }
        let data = self.datastore[index]
        return data;
    },

    getAllValues(){
        return this.datastore
    },

    getAllKeys(){
        return this.keystore
    },

    clear(){
        let self = this;
        while(self.keystore.length > 0) {
            self.keystore.pop();
        }

        while(self.datastore.length > 0) {
            let data = self.datastore.pop();
            data = null;
        }
        self._len = 0;
    }
 
});
