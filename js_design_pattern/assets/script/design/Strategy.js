var performanceA = function () { };
performanceA.prototype.calculate = function (salary) {
    return salary * 4;
};
var performanceB = function () { };
performanceB.prototype.calculate = function (salary) {
    return salary * 3;
};
var performanceC = function () { };
performanceC.prototype.calculate = function (salary) {
    return salary * 2;
};

//奖金类
var Bouns = function(){
    this.salary = null;//原始工资
    this.levelObj = null;//绩效等级对应的策略对象
};

Bouns.prototype.setSalary = function(salary){
    this.salary = salary;//保存员工的原始工资
};
Bouns.prototype.setlevelObj = function(levelObj){
    this.levelObj = levelObj;//设置员工绩效等级对应的策略对象
};
//获取奖金
Bouns.prototype.getBouns = function(){
    return this.levelObj.calculate(this.salary);
}

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

        var bouns = new Bouns();
        bouns.setSalary(10000);
        bouns.setlevelObj(new performanceA());
        console.log(bouns.getBouns());

        bouns.setlevelObj(new performanceB());
        console.log(bouns.getBouns());

        if(fun)
            fun("策略模式测试成功")
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
