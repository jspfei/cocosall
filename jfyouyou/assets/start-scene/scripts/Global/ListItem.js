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
       label:{
           default:null,
           type:cc.Label
       },
       url:'',
       bg:cc.Sprite,
       btn:cc.Button
    },

    init(menu){
        this.index = -1;
        this.menu = menu;
    },
    loadExample:function(){
        if(this.url){
            this.menu.loadScene(this.url);
        }
    },

    updateItem(idx,y,name,url){
        let isDir = !url;
        this.index = idx;
        this.node.y = y;
        this.node.x = isDir ? 50 : 100;
        this.label.string = name;
        this.url = url;
        this.bg.enabled = !isDir;
        this.btn.interactable = !isDir;
    },
});
