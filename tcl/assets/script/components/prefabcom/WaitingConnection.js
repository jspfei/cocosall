cc.Class({
    extends: cc.Component,

    properties: {
        target:cc.Node,
        labContent:cc.Label,
        _isShow:false
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null)
        {
            return null;
        }

        cc.vv.wc = this;
        this.node.active = this._isShow;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.target.rotation = this.target.rotation - dt*45;
    },

    show:function(content)
    {
        this._isShow = true;
        if(this.node)
        {
            this.node.active = this._isShow;
        }
        if(this.labContent)
        {
            if(content == null)
            {
                content = "";
            }
            this.labContent.string = content;
        }
    },

    hide:function(){
        this._isShow = false;
        if(this.node)
        {
            this.node.active = this._isShow;
        }
    }
});
