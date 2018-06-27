  
cc.Class({
    extends: cc.Component,

    properties: {
        brickPrefab:cc.Prefab,
        effectPrefab01:cc.Prefab,
        effectPrefab02:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.brickPool = new cc.NodePool();
        this.effectPool01 = new cc.NodePool();
        this.effectPool02 = new cc.NodePool();
        this.PrefabMap = {
            brick:this.brickPrefab,
            effect01:this.effectPrefab01,
            effect02:this.effectPrefab02
        };
        this.PoolMap ={
            brick:this.brickPool,
            effect01:this.effectPool01,
            effect02:this.effectPool02
        };
        this.initPools();
    },
    initPools:function(){
        for(var n = 0;n<20;n++){
            var a = cc.instantiate(this.brickPrefab);
            a.active = false;
            this.brickPool.put(a);
        }

        for(var n = 0;n<10;n++){
            var t = cc.instantiate(this.effectPrefab01);
            t.active =false;
            this.effectPool01.put(t);
        }
        for(var n =0;n<10;n++){
            var t = cc.instantiate(this.effectPrefab02);
            t.active = false;
            this.effectPool02.put(t);
        }
    },

    get:function(type){
        var t = this.PoolMap[type].get();
        if(t == null){
            t = cc.instantiate(this.PrefabMap[type]);
        }
        t.active = true;
        return t;
    },

    put:function(type,value){
        var e = this.PoolMap[type];
        value.active =false;
        value.removeFromParent(true);
        e.put(value);
    },
    start () {

    },

    // update (dt) {},
});
