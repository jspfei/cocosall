var command1 = {
    execute:function(){
        console.log(1);
    }
};

var command2 = {
    execute:function(){
        console.log(2);
    }
};

var command3 = {
    execute:function(){
        console.log(3);
    }
};

var command = function(){
    return {
        commandsList:[],
        add :function(command){
            this.commandsList.push(command);
        },
        execute:function(){
            for(var i = 0 ;i < this.commandsList.length ;i++){
                this.commandsList[i].execute();
            }
        }
    }
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

    },

    init:function(fun){
        var c = command();
        c.add(command1);
        c.add(command2);
        c.add(command3);
        c.execute();
        if(fun)
            fun("宏命令执行完毕") 
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
