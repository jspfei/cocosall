// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        id : 0,
        icon: cc.Sprite,
        itemName:cc.Label,
        itemPrice:cc.Label 
    },

    //data：{id,iconSF,itemName,itemPrice}
     init:function(data){
         this.id = data.id;
         this.icon.spriteFrame = data.iconSF;
         this.itemName.string = data.itemName;
         this.itemPrice.string = data.itemPrice;
     }
});
