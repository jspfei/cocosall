 
 
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
        _pool:[],
        _gid: 1,

        /***      
         * 创建回调函数
         */
        create(caller, method, args = null, once = true) {
            if(Handler._pool.length > 0) {
                let handler = Handler._pool.shift();
                handler.clear();
                handler.setTo(caller,method,args,once);
                return handler;
            }
            let handler = new Handler();
            handler.init(caller,method,args, once);
            return handler;
        }
    },

    init(caller = null, method = null, args = null, once = false){
        this.setTo(caller,method,args,once);
    },

    setTo(caller, method, args, once) {
        let self = this;
        self._id = Handler._gid++;
        self.caller = caller;
        self.method = method;
        self.once = once;
        self.valid = true;
        if(args != null) {
            if(args instanceof Array) {
                self.args = args;
            } else {
                self.args = [args];
            }
        }
        return self;
    },

    run(){
        let self = this;
        if(self.method == null) return null;
        self.method.apply(self.caller, self.args);
        if(self.once){
            self.recover();
        }       
    },

    runWith(data) {
        let self = this;
        if (self.method == null) return null;
        let result = null;
        if(data == null) {
            result = self.method.apply(self.caller,self.args);
        } else if(self.args) {
            let newArgs = self.args.concat(data);
            result = self.method.apply(self.caller, newArgs)
        } else {
            result = self.method.apply(self.caller, data);
        }

        if(self.once){
            self.recover();
        }
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
