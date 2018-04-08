
var BicycleShop = function(name){
    this.name = name;
    this.method = function(){
        return this.name;
    }
};

BicycleShop.prototype = {
    constructor : BicycleShop,
    sellBicycle:function(model){
        var bicycle = this.createBicycle(model);
        bicycle.A();
        bicycle.B();
        return bicycle;
    },
    createBicycle:function(model){
        throw new Error("父类是抽象的不能直接调用，需要子类重写方法")
    }
};

function extend(Sub,Sup){
     //Sub表示子类，Sup表示超类
        // 首先定义一个空函数
        var F = function(){};

        // 设置空函数的原型为超类的原型
        F.prototype = Sup.prototype; 

        // 实例化空函数，并把超类原型引用传递给子类
        Sub.prototype = new F();
                    
        // 重置子类原型的构造器为子类自身
        Sub.prototype.constructor = Sub;
                    
        // 在子类中保存超类的原型,避免子类与超类耦合
        Sub.sup = Sup.prototype;

        if(Sup.prototype.constructor === Object.prototype.constructor) {
            // 检测超类原型的构造器是否为原型自身
            Sup.prototype.constructor = Sup;
        }
}
var BicycleChild = function (name) {
    this.name = name;
    // 继承构造函数父类中的属性和方法
    BicycleShop.call(this, name);
};
// 子类继承父类原型方法
extend(BicycleChild, BicycleShop);
// BicycleChild 子类重写父类的方法
BicycleChild.prototype.createBicycle = function () {
    var A = function () {
        console.log("执行A业务操作");
    };
    var B = function () {
        console.log("执行B业务操作");
    };
    return {
        A: A,
        B: B
    }
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
        var lbl = ""
        var childClass = new BicycleChild("隆恩");
        lbl = childClass.name +"   "+ childClass.sellBicycle("model");
        if(fun)
            fun(lbl)
    },
   

});
