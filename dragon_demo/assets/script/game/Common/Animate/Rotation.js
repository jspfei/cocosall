cc.Class({
        extends: cc.Component,

        properties: {
                speed:5
        },

        start(){
                var repeat = cc.repeatForever(cc.rotateBy(this.speed, 360))
                this.node.stopAllActions()
                this.node.runAction(repeat)
        }

})