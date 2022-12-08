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
        _nodePoolList: Dictionary,
        _prefabObjList: Dictionary,
        _creatingList: Dictionary,

        _notRealseList:[]
    },

    ctor: function(){
        this._nodePoolList = new Dictionary();
        this._prefabObjList = new Dictionary();
        this._creatingList = new Dictionary();
    },
    
    /**
     * 注册对象池
     * @param {预制路径} name 
     * @param {初始化对象池长度} size 
     * @param {初始化完成} complete 
     */

    registerPool(name, size, complete) {

    },

    createPool(nodePool, name, size, complete) {
        let  self  = this;
        if(size > 0) {
             let prefab = self._prefabObjList.find(name);
             if(prefab != null) {
                for(let i = 0; i < size; i++) {
                    let objNode = cc.instantiate(prefab)
                    nodePool.put(objNode)
                }
                if(complete != null) {
                    complete.run();
                }
                return;
             }

             let createInfo = this._creatingList.find(name)
             let isCreating = false;
             if (!createInfo) {
                 createInfo = {
                    handler:[complete],
                    size:size,
                 }
                 this._creatingList.add(name,createInfo)
             } else {
                 isCreating = true;
                 createInfo.handler.push(complete)
                 createInfo.size += size;
             }

             AssetManager.instance.getRawAsset(name, AssetResType.prefab, Handler.create(self, function(prefabAsstData){
                try {
                    self._creatingList.remove(name)
                    if(prefabAsstData != null){
                        let prefabObj = prefabAsstData
                        if(!this._prefabObjList.find(name)){
                            this._prefabObjList.add(name, prefabObj)
                        }
                        for(let i =0 ; i < createInfo.size;i++) {
                            let objNode = cc.instantiate(prefabObj);
                            nodePool.put(objNode)
                        }

                        createInfo.handler.forEach(element => {
                            element.run();
                        }) 
                    } else {
                        createInfo.handler.forEach(element =>{
                            element.run();
                        })
                    }
                } catch (error) {
                    jf.log(name + ' create handler error => '+ error)
                }
             }))

        } else {
            if(complete != null) {
                complete.run();
            }
        }
    },

    createEnemy(name){
        let self = this;
        let enemy = null;
        let nodePool = self._nodePoolList.find(name);
        if(nodePool != null) {
            if(nodePool.size() > 0) {
                return nodePool.get();
            } else {
                let prefab = self._prefabObjList.find(name)
                if(prefab != null){
                    enemy = cc.instantiate(prefab)
                    return enemy
                }
            }
        }
    },

    /***   
     * 异步获取资源
     * @param {*} name
     * @param {*} complete
     */
    createEnemyAsyn(name, complete) {
        let self = this;
        let enemy = null;
        let nodePool = self._nodePoolList.find(name);
        if(nodePool  != null) {
            if(nodePool.size() > 0) {
                enemy = nodePool.get();
            }
        } else {
            nodePool = new cc.NodePool(name);
            self._nodePoolList.add(name,nodePool);
        }

        if(enemy != null) {
            if(complete != null) {
                complete.runWith([enemy])
                return;
            }
        }

        let prefab = self._prefabObjList.find(name);
        if (prefab == null) {
            self.createPool(nodePool, name, 1, Handler.create(self, ()=>{

                let obj = self.createEnemy(name)
                if(obj && complete != null) {
                    complete.runWith([obj])
                } else if(complete != null ){
                    complete.run();
                }
            }))


        } else {
            enemy = cc.instantiate(prefab)
            if(complete != null) {
                complete.runWith([enemy])
            }
        }

    }

});

AssetModelFactory.instance = new AssetModelFactory()
module.exports = AssetModelFactory;