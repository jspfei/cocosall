var Handler = require("Handler");


var UIComm_Frame = cc.Class({
        //name: "UIComm_Frame",
        extends: cc.Component,
    
        properties: () => ({
            closeBtn: {
                default: null,
                type: cc.Node
            },
    
            title: {
                default: null,
                type: cc.Node
            },
    
            icon: {
                default: null,
                type: cc.Node
            },
    
            closeBtnClickCallBack: Handler,
        }),
    
        start: function () {
            let self = this;
            if(self.closeBtn != null){
                self.closeBtn.on(cc.Node.EventType.TOUCH_END, self.closeBtnClickHandler, self);
            }      
        },
    
        closeBtnClickHandler(event){
            let self = this;
            if(self.closeBtnClickCallBack != null){
                self.closeBtnClickCallBack.run();
            }
        }
    })