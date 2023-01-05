var NodePoolInfo = cc.Class({
        name:"NodePoolInfo",
        properties: () =>({
                nodeName:"",
                size:0,
        }),

        __ctor__:function(nodeName, size) {
                this.nodeName = nodeName;
                this.size = size;
        }
})