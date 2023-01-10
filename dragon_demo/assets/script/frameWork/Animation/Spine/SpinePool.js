var Dictionary = require("Dictionary");
var SpineCtrComponent = require("SpineCtrComponent");
var AssetModelFactory = require("AssetModelFactory");
var Handler = require("Handler");


var SpinePool = cc.Class({
        name: "SpinePool",
        statics: {
            instance: null
        },

        properties:() => ({
            _pool:null,
        }),

        ctor:function(){
            let self = this;
            self._pool = new Dictionary();
        },

        ctor:function(){
            let  self = this;
            self._pool = new Dictionary()
        },

        getBone(assectName, complete){
            let self  = this;
            let bone = null;
            if(self._pool != null && self._pool.count() > 0){
                if(self._pool.hasOwnPropertyKey(assectName)){
                    let list = self._pool.find(assectName)
                    if(list != null && list.length > 0) {
                        bone  = list.shift()
                        bone.assectName = assectName;
                        if(complete != null) {
                            complete.runWith([bone])
                        } else {
                            self.loadAssest(assectName, complete)
                        }
                    } else {
                        self.loadAssest(assectName, complete)
                    }
                } else {
                    self.loadAssest(assectName, complete)
                }
            } else {
                self.loadAssest(assectName, complete)
            }
        },

        loadAssest(assectName, complete) {
            let self = this;
            AssetModelFactory.instance.createEnemyAsyn(assectName, Handler.create(self, function(obj) {
                    let bone = obj.getComponent(SpineCtrComponent);
                    bone.assectName = assectName;
                    if(complete != null) {
                        complete.runWith([bone])
                    }
            }))
        },

            
        backToPool(bone){
            let self = this;
            if(bone != null) {
                let list = []
                if(self._pool.hasOwnPropertyKey(bone.assectName)){
                    list = self._pool.find(bone.assectName)
                    if(list.indexOf(bone) == -1) {
                        list.push(bone);
                    }
                } else {
                    self._pool.add(bone.assectName, list)
                    list.push(bone)
                }
            }
        },

        dispose(){
            let self = this;
            if(self._pool != null) {
                let valueList = self._pool.getAllValues()
                if(valueList != null) {
                    while(valueList.length > 0) {
                        let list = valueList.pop()
                        if(list != null) {
                            while(list.length > 0) {
                                let bone = list.pop()
                                if(list.length == 0) {
                                    AssetModelFactory.instance.releasePool(bone.assectName)
                                    AssetModelFactory.instance.releasePrefabList(bone.assectName)
                                }

                                if(bone != null) {
                                    bone.destroy()
                                    bone = null;
                                }
                            }
                            list = null;
                        }
                    }
                }
                self._pool.clear();
            }
        }


});

SpinePool.instance = new SpinePool();
module.exports = SpinePool;