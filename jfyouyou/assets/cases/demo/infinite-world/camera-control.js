

cc.Class({
    extends: cc.Component,

    properties: {
        target:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
    },
    onEnable(){
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable(){
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },

    lateUpdate:function(dt){
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.node.position = this.node.parent.convertToWorldSpaceAR(targetPos);

        let ratio = targetPos.y / cc.winSize.height;
        this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },
    start () {

    },

    // update (dt) {},
});
