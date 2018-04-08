
  function createPreson(name,age,sex){
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.sex = sex;
    obj.sayName = function()
    {
        return this.name;
    }
    return obj;
}
cc.Class({
    extends: cc.Component,

    properties: { 
    },

       // use this for initialization
    onLoad: function () {

    },
    init:function(fun){
        var lbl = ""
        var p1 = new createPreson("longen","28","男");
        var p2 = new createPreson("tugenhua","27","女");
        lbl = p1.name +" "+p1.age+" "+p1.sex+"   "+p1.sayName();
        lbl =lbl +"\n"+ p2.name +" "+p2.age+" "+p2.sex+"   "+p2.sayName();
        if(fun)
            fun(lbl)
    },
  

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
