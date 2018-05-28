var State=cc.Enum({
    Normal:-1,
    Left:-1,
    mid:-1,
    Cricle:-1,

});

cc.Class({
    extends: cc.Component,

    properties: {
       _state:{
           default:State.Normal,
           type:State,
           visible:false
       },
       state:{
           get:function(){
              return this._state;
           },
           set:function(value){
              
               if(value !== this._state){
                   this._state = value;
                   if(this._state !== State.Normal){
                        var animName = State[this._state];
                        this.anim.stop();
                        this.anim.play(animName);
                   }
               }
           },
           type:State
       }
    },
    statics(){
        State :State
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
  
    start () { 
         this.anim = this.getComponent(cc.Animation);
         
        this.state = State.Cricle;
    },

      update (dt) {
        switch(this.state){
            case State.Normal:
                 this.setState(State.Left);
                break;
            case State.Left:
                this.setState(State.mid);                
                break;
            case State.mid: 
                this.setState(State.Cricle);               
                break;
            case State.Cricle:
                this.setState(State.Normal);
                break;
        }
      },
      setState:function(value){
          setTimeout(function(){
            this.state = value; 
          }.bind(this),1000)
      }
});
