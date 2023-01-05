
var TimerManager = require("TimerManager");
var Handler = require("Handler");

var UIComm_TipsStrItem = cc.Class({
        extends:cc.Component,

        properties: () =>({
                label:cc.Label,
                _nodeY:326,
                _type:0,
                _standTimeOnCallBack:null,
        }),

        move(dir, type, startPos, moveYDic, time, standTime =1000){
                
        }

})