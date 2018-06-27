// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var globalvar = require("./globalvar.js");
cc.Class({
    extends: cc.Component,

    properties: {
        normalBrickSp: {
            "default": null,
            type: cc.SpriteFrame
        },
        higherBrickSp: {
            "default": null,
            type: cc.SpriteFrame
        },
        brokenBrickSp: {
            "default": null,
            type: cc.SpriteFrame
        },
        shootClip: {
            url: cc.AudioClip,
            "default": null
        },
        breakClip: {
            url: cc.AudioClip,
            "default": null
        },
        countdownClip: {
            url: cc.AudioClip,
            "default": null
        },
        gameoverClip: {
            url: cc.AudioClip,
            "default": null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.brickList = [];
        this.brickSpList = [this.normalBrickSp,this.higherBrickSp];
        this.effectList = [];

        this.gameWidget = cc.find("gameWidget",this.node);
        this.touchnode_01 = cc.find("touchnode_01",this.gameWidget);
        this.touchnode_01.on("touchstart",this.touchStart,this);
        this.touchnode_02 = cc.find("touchnode_02",this.gameWidget);
        this.touchnode_02.on("touchstart",this.touchStart,this);
        this.touchnode_03 = cc.find("touchnode_03",this.gameWidget);
        this.touchnode_03.on("touchstart",this.touchStart,this);
        this.touchnode_04 = cc.find("touchnode_04",this.gameWidget);
        this.touchnode_04.on("touchstart",this.touchStart,this);

        this.shootEffect = cc.find("image_shoot_effect",this.gameWidget);
        this.shootSpineNode = cc.find("image_shoot_effect/image_shoot_02/effect_node",this.gameWidget);
        this.brickNode = cc.find("brickNode",this.gameWidget);
        this.guideNode = cc.find("guideNode",this.gameWidget);
        this.startCountdown = cc.find("label_start_count",this.gameWidget);
        this.effectNode = cc.find("effectNode",this.gameWidget);

        var e = cc.view.getVisibleSize();
        this.startPosY = e.height / 2 - 150;
        this.EndPosY = - (e.height / 2 - 180);
        this.poolManager = this.node.getComponent("brickpool");

        this.startCountdownCallBack = function(){
            if(0 < this.readyTime){
                this.readyTime--;
                this.startCountdown.getComponent(cc.Label).string = this.readyTime;
                if(this.readyTime == 0 ){
                    this.startCountdown.active = false;
                    this.gameState = 1;
                    this.startGame();
                    this.unschedule(this.startCountdownCallBack);
                }
            }
        }

    },
   
    start () {
         this.initData();
         this.schedule(this.startCountdownCallBack,1,3,1);

    },
    startGame:function(){
        this.createInitialBrick();
        for(var i = 0,t = 0;t< 4;t++){
            if(this.brickList[0].LackList[t]){
                i = 160 * t -240;
                break;
            }
        }

        this.guideNode.active = true;
        this.guideNode.x = i;
    },
    createInitialBrick:function(){
        for(var e = 0; e < 10;e++){
            this.createTopBrick();
        }
        this.topPosY = this.brickList[this.brickList.length -1].Node.y;
    },
    createTopBrick:function(){
        var brick = this.poolManager.get("brick");
        var len = this.brickList.length;
        if(len == 0){
            brick.setPosition(0,this.startPosY);
        }else{
            brick.setPosition(0,this.brickList[len -1].Node.y + 100);
        }
        this.brickNode.addChild(brick);

        var index = Math.floor(4 * Math.random());
        brick.children[index].active = false;
        for(var n = this.getRandomDifficulty(),r =0; r < brick.childrenCount;r++){
            brick.children[r].getComponent(cc.Sprite).spriteFrame = this.brickSpList[n-1];
        }

        var  data = {
            Node:brick,
            Dif:n,
            HitCount:[n,n,n,n],
            BrokenState:false,
            LackList:[1,1,1,1]
        }

        data.LackList[index] = 0;
        data.HitCount[index] = 0;
        this.brickList.push(data);
        this.bricksMove(brick);

    },
 
    initData:function(){
        this.readyTime = 3;
        this.startCountdown.getComponent(cc.Label).string = this.readyTime;
        this.startCountdown.active = true;
        this.timeSlot = 0;
        this.gameState = 0;
        this.isdestory = true;
        this.guideNode.active = false;

    },
    touchStart:function(e){
        if(this.gameState !=0 && this.isdestory !=0){
            this.guideNode.active = false;
            var t = e.currentTarget,
            i = t.name.charAt(t.name.length -1) -1;

            var size = cc.view.getVisibleSize();
            this.shootEffect.x = t.x;
            this.shootEffect.y = -(size.height/2 + 32);
            this.shootSpineNode.active = true;
            this.shootSpineNode.getComponent("sp.Skeleton").setAnimation(0,"animation",false);
            var e = cc.moveTo(.1,this.shootEffect.x,this.brickList[0].Node.y -30),
                s = cc.sequence(e,cc.callFunc(function(){
                    this.shootEffect.y = -(size.height /2 +32);
                    this.shootSpineNode.active = false;
                    if(this.brickList[0].LackList[i] == 1){
                        this.createBottomBrick(i);
                        
                    }else{
                        for(var a = 0,t =1; t < this.brickList.length; t++){
                            if (1 == this.brickList[t].LackList[i]) {
                                a = t - 1;
                                break;
                            }
                            if (1 == this.brickList[t].Dif) {
                                if (0 <this.brickList[t].HitCount[i]) {
                                    a = t - 1;
                                    break;
                                }
                            } else {
                                if (0 < this.brickList[t].HitCount[i] && this.brickList[t].HitCount[i] < this.brickList[t].Dif) {
                                    if (0 == this.brickList[t].BrokenState) {
                                        a = t - 1;
                                        break;
                                    }
                                } else {
                                    if (this.brickList[t].HitCount[i] == this.brickList[t].Dif) {
                                        a = t - 1;
                                        break;
                                    }
                                }
                            }
                        }
                        this.shootBrick(a,i);
                    }
                    this.breakBricks();
                }.bind(this)));
                this.shootEffect.runAction(s);
        }

    },
    shootBrick:function(a,t){
        this.brickList[a].Node.children[t].getComponent(cc.Sprite).spriteFrame = this.normalBrickSp;
        this.brickList[a].Node.children[t].active = true;
        this.brickList[a].HitCount[t]++;
        if(this.brickList[a].HitCount[t] > this.brickList[a].Dif){
            this.brickList[a].HitCount[t] = this.brickList[a].Dif;
        }
    },
    breakBricks:function(){
        for(var a = 0,t = 0; t < this.brickList.length; t++){
            for(var e = 0 , n = 0;n < this.brickList[t].HitCount.length;n++){
                if(this.brickList[t].HitCount[n] == this.brickList[t].Dif){
                    e++;
                }
            }
            if(this.brickList[t].HitCount.length !=e){
                break;
            }
            a++;
        }
        this.destoryBricks(a);
    },
    destoryBricks:function(index){
        var self = this;
        if(index > 0 ){
            this.isdestory = false;
            for(var t = this.brickList.length - 1 ; 0 <= t; t--){
                !function(t){
                    self.brickList[t].Node.stopAllActions();
                    var e = cc.moveBy(.05,0,15),
                        a = cc.sequence(e,cc.callFunc(function(){
                            if(t==0 && self.gameState == 1){
                                for(var topNode, n = index -1; 0 <= n;n--){
                                    topNode = self.poolManager.get("effect0"+self.brickList[n].Dif);
                                    topNode.y = self.brickList[n].Node.y;
                                    self.effectNode.addChild(topNode);

                                    var effectData = {
                                        effectNode:topNode,
                                        Dif:self.brickList[n].Dif
                                    };
                                    self.effectList.push(effectData);

                                    var count = topNode.childrenCount;
                                    if(self.brickList[n].Dif == 2){
                                        count -= 1;
                                        topNode.children[topNode.childrenCount -1].getComponent(cc.Label).string="+"+globalvar.ExtraScoreList[self.timeSlot];
                                    
                                    }
                                    for(var r = 0;r < count;r++)   {
                                        topNode.children[r].getComponent("sp.Skeleton").setAnimation(0,"animation",false);
                                    }
                                    topNode.children[0].getComponent("sp.Skeleton").setCompleteListener(function(){
                                        for(var t = 0; t < self.effectList.length; t++){
                                            self.poolManager.put("effect0" + self.effectList[t].Dif,self.effectList[t].effectNode);
                                        }
                                    });
                                    self.poolManager.put("brick",self.brickList[n].Node);
                                    self.brickList.splice(n,1); 
                                }
                                if(self.brickList.length <=10){
                                    for(var l = 0;l < 10- self.brickList.length;l++){
                                        self.createTopBrick();
                                    }
                                }

                                if(self.brickList[0].Dif > 1){
                                    for(var c = 0 ;c < self.brickList[0].LackList.length; c++){
                                        if (0 == self.brickList[0].LackList[c] && 0 <self.brickList[0].HitCount[c]) {
                                            self.brickList[0].Node.children[c].active = false;
                                            self.brickList[0].BrokenState = true;
                                            for (var h = 0; h < self.brickList[0].LackList.length; h++) {
                                                self.brickList[0].Node.children[h].getComponent(cc.Sprite).spriteFrame =self.brokenBrickSp;
                                            }
                                            break;
                                        }
                                    }
                                }
                                self.isdestory = true;

                                if(self.brickList[0].Node.y > self.startPosY){
                                    self.brickList[0].Node.y = self.startPosY;
                                }

                                for(var u = 1; u < self.brickList.length; u++){
                                    self.brickList[u].Node.y = self.brickList[u -1 ].Node.y + 100;
                                }
                            }
                            if(self.isdestory){
                                for(var g = 0 ; g < self.brickList.length; g++){
                                    self.bricksMove(self.brickList[g].Node);
                                }
                            }

                        }.bind(self)));
                    self.brickList[t].Node.runAction(a);
                }(t);
            }
            if (globalvar.SoundFlag) {
                cc.audioEngine.play(this.breakClip, false, 1.5);
            }
        }else{
            this.isdestory = true;
            if(this.brickList[0].Dif >1){
                for(var e = 0 ; e < this.brickList[0].LackList.length ;e++){
                    if(this.brickList[0].LackList[e] == 0 && 0 < this.brickList[0].HitCount[e]){
                        this.brickList[0].Node.children[e].active = false;
                        this.brickList[0].BrokenState = true;
                        for(var a = 0;a < this.brickList[0].LackList.length;a++){
                            this.brickList[0].Node.children[a].getComponent(cc.Sprite).spriteFrame = this.brokenBrickSp;
                        }
                        if(globalvar.SoundFlag){
                            cc.audioEngine.play(this.breakClip,false,1.5);
                        }
                    }
                }
            }
        }
    },
    createBottomBrick:function(i){
        console.log("bottom")
        var brick= this.poolManager.get("brick");
        brick.setPosition(0,this.brickList[0].Node.y - 100);
        this.brickNode.addChild(brick);
        for(var s = 0 ; s < brick.childrenCount; s++){
            brick.children[s].getComponent(cc.Sprite).spriteFrame = this.brickSpList[0];
            brick.children[s].active = false;
        }
        brick.children[i].active = true;
        var data = {
             Node:brick,
             Dif:1,
             HitCount:[0,0,0,0],
             BrokenState:false,
             LackList:[0,0,0,0]
        }
        data.LackList[i] = 1;
        data.HitCount[i] = 1;
        this.brickList.unshift(data);
        this.bricksMove(brick);
    },
    gametimer:function(){
        this.gameTime += le3 / 60;
        for(var a = this.timeSlot, t = globalvar.TimeSlotList.length - 1;0 <= t;t--){
            if(this.gameTime <= le3 * globalvar.TimeSlotList[t]){
                this.timeSlot = t;
            }
        }
    },
    getRandomDifficulty: function() {
        for (var a = globalvar.ProbabilityList[this.timeSlot], t = 0, e = 100 * Math.random(), n = a.length - 1; 0 <= n; n--) {
            t += a[n];
            if (e <= t) {
                return n + 1;
            }
        } 
         
    },
    bricksMove:function(brick){
        brick.stopAllActions();
        var t = brick.y,
        e = this.EndPosY,
        n = (t -e)/globalvar.SpeedList[this.timeSlot],
        action = cc.moveTo(n,brick.x,e);
        brick.runAction(action);
    },
    update (dt) {

        if(this.gameState !=0 && this.isdestory !=0){
            if(this.brickList[0].Node.y < this.EndPosY || Math.floor(this.brickList[0].Node.y- this.EndPosY)<=15){
                this.gameState = 0;
                this.lose();
            }
            var timeSlot = this.timeSlot;
            if(Math.abs(this.brickList[this.brickList.length -1].Node.y - this.topPosY) >= 100){
                this.createTopBrick();
            }

            if(timeSlot != this.timeSlot){
                for(var t = 0; t < this.brickList.length; t++){
                    this.brickList.Node.stopAllActions();
                    if(t > 0){
                        this.brickList[t].Node.y = this.brickList[ t -1 ].Node.y + 100;
                                           
                    }
                    this.bricksMove(this.brickList[t].Node);
                } 
            }
        }
    },

    lose:function(){
        console.log("lose");
        console.log("length   "+ this.brickList.length);
        for(var i = this.brickList.length -1;0 <=i ;i--){
            this.brickList[i].Node.stopAllActions();
            var t = cc.moveBy(.04,cc.p(10,-10));
            var e = cc.moveBy(.04,cc.p(-20,20));
            var n = cc.moveBy(.04,cc.p(20,-20));
            var a = cc.moveBy(.04,cc.p(-10,-20));
            var s = cc.sequence(t,e,n,e,n,a);
            console.log("i "+i);
            this.brickList[i].Node.runAction(s);

        }
    }
});
