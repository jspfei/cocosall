var Blob = require('blob');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        blob:{
            default:null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this);
    },
    onTouchBegan:function(event){
        var touchLoc = event.touch.getLocation();
        
        var node = cc.instantiate(this.blob);
        var blob = node.getComponent(Blob);
        blob.init();
        blob.emitTo(touchLoc);

        node.active = true;
        node.parent = cc.director.getScene();
    },

    start () {

    },

    // update (dt) {},
});
