 var LoginPanel = require("LoginPanel") 
 var HttpManager = require("HttpManager"); 
var Handler = require("Handler");
const GameGlobleDataManager = require("GameGlobleDataManager");
/** 
 * 使用单例模式定义
 * 
 * 对登录进行分类处理，
 * 
*/
var LoginManager = cc.Class({
    name:"LoginManager",


    statics:{
        instance:null,

        statics:{
            instance:null,

            LOGIN_NONE:0,
            LOGIN_GUEST:1, 
            LOGIN_FB:2,
            LOGIN_LINE:3,
            LOGIN_GM:4,
            LOGIN_SMS:5,
            LOGIN_APPLE:6,
        }

    },
    properties: {
        _view: LoginPanel,
        _isSocketConntBln:false, 
        _isReLogin:false,

        isFacebookLogin:{
            get:function(){
                return this.loginType == LoginManager.LOGIN_FB
            },
            set:function () {}
        },

        isLineLogin:{
            get:function(){
                return this.loginType == LoginManager.LOGIN_LINE;
            },
            set:function () {}
        },

        _loginType:0,
        loginType:{
            get:function(){
                return this._loginType;
            },
            set:function(value){
                this._loginType = value;
            }
        }

    }, 

    setView(view){ 

        this._view = view;
       
    },

    showLoginView(){
        let self = this;
        if(cc.isValid(self._view)){
           
            self._view.showLoginView(); 
        }
    },

    init(){
        let self = this;

        let GameEnterManager = require("GameEnterManager")    
        GameEnterManager.instance.init();

        self.initGameEnter();
        
        //加载配置数据
        self.analysisTempData();
    },

    initGameEnter(){
          //异步监听成功以后 调用
          let GameEnterManager = require("GameEnterManager")    
          GameEnterManager.instance.setup();
    },

    analysisTempData(){
        let self = this;
        if(!GameGlobleDataManager.instance.isInitCompleteBln)  {
            GameGlobleDataManager.instance.setup();
            GameGlobleDataManager.instance.initStep(Handler.create(self, self.analysisTempDataComplete));
        }else {
            self.realSwitchScene() 
        }
        //其他
    },

    analysisTempDataComplete(){
        let self = this;
        self.realSwitchScene();
    },

    realSwitchScene(){
        //其他操作


        //切换到其他界面
        console.log("[进入界面】 > key > ")

    },
    // onLoad () {}, 
    start () {

    },

    // update (dt) {},
});
LoginManager.instance = new LoginManager();
module.exports = LoginManager;