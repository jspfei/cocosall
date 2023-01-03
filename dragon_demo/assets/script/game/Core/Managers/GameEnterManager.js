var CustomEvent = require("CustomEvent");


var GameEnterManager = cc.Class({
        name :"GameEnterManager",
        extends: CustomEvent,
        statics:{
                instance:null,
                LOGIN_STATE: 0,
                MAIN_MENU_STATE: 1,
                HILO_STATE: 2,
        },
        

        properties: () =>({
                _currGameState:0,
                currGameState:{
                        get:function(){
                                return this._currGameState
                        },
                        set:function(value){
                                this._currGameState = value;
                        }
                },
                _isEnterBln:false, 
        }),

        setup(){
                // 初始化 其他 分系统管理初始化工作
        },

        init(){
                if (!this._hasInit){
                        this._hasInit = true;
                        this.backGameEvent();
                    }
                //插入一个注册backGameEvent处理
        },
        enterGame() {
                let self = this;
                jf.log("[进入游戏完成] > GameEnterManager > _isEnterBln > " + true);
                self._isEnterBln = true;



        },
        /**
         *返回键处理逻辑
         *\
         */
        backGameEvent(){
                let self = this;
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,(event) => {
                        switch (event.keyCode) {
                                case cc.macro.KEY.back:
                                case cc.macro.KEY.backspace:


                                break; 
                        } 
                })  
        }
})
GameEnterManager.instance = new GameEnterManager();
module.exports = GameEnterManager;

