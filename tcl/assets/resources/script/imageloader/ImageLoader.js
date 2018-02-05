function loadImage(url,callback){
   
    cc.loader.load(url,function (err,tex) {
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        callback("",spriteFrame);
    });
};
 

cc.Class({
    extends: cc.Component,
    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.setupSpriteFrame();
    }, 
    setImageFromByHttp:function(url){
        var self = this;
        loadImage(url,function (err,spriteFrame) {
            self._spriteFrame = spriteFrame;
            self.setupSpriteFrame();
        });   
    },
    
    setupSpriteFrame:function(){
        if(this._spriteFrame){
            var spr = this.getComponent(cc.Sprite);
            if(spr){
                spr.spriteFrame = this._spriteFrame;    
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
