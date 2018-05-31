cc.Class({
    extends: cc.Component,

    properties: {
        impulse:cc.v2(0,1000)
    },

   onBeginContact:function(contact,selfCollider,otherCollider){
        var manifold = contact.getWorldManifold();
        if(manifold.normal.y < 1) return;

        let body = otherCollider.body;
        body.linearVelocity = cc.v2();
        body.applyLinearImpulse(this.impulse,body.getWorldCenter(),true);
   },

    start () {

    },

    // update (dt) {},
});
