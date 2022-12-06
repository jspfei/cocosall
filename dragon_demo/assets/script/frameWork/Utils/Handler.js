 

var Handler = cc.Class({
    name :"Handler",
    ctor:function(){},
    properties: {
       caller :null,
       /**处理方法 */
       method:null,
       /**参数 */
       args:[],
       /**表示是否 只执行一次 ，如果是true ,回调后执行 recover() 进行回收，回收后晖被利用， 默认为false*/
       once:false,

       _id:0,
       valid:true,
    },

    statics:{

    },

    init(){

    },

    setTo(caller, method, args, once) {

    },

    run(){

    },

    runWith(data) {

    },

    clear(){
        let self = this;
        self.caller = null;
        self.method = null;
        self.args = null;
        self._id = 0;
        self.once = false;
        self.vaild = false;
    },

    recover(){
        let self = this;
        self.clear();
    }
   
});
