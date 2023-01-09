var CustomEvent = require("CustomEvent");

var SocketManager = cc.Class({
        name: "SocketManager",
        extends: CustomEvent,
        statics: {
            instance: null
        },

        properties: () =>({
            _hasInitEvents:false,
            _socket:null
        }),

        setUp(ip) {
            let self = this;
            self.initEvent()
            if (self._socket){
                self._socket.close()
                self._socket.dispose();
            }

            ByteSocket = require("ByteSocket")
            self._socket = new ByteSocket()
            self._socket.init(true)
            self._socket.connect(ip)

            jf.log("[提示: 启动socket]>" + ip);     
        },

        _test(){
            let self = this;
            if (cc.sys.isBrowser){
                self._sockets = []
                for (let i = 0 ; i < 20 ; i ++){
                    let socekt  = new ByteSocket(); 
                    socekt.init(true);
                    socekt.connect(ip);
                    self._sockets.push(socekt);
                }
                self._sockets.push(self._socket);
            }
    
        },
    
        test_sendAllSocket(packageOut, buffer){
            let self = this;
            if (cc.sys.isBrowser){
                if (self._sockets){
                    self._sockets.forEach(socekt => {
                        socekt.sendProtobuffer(packageOut, buffer);
                    });
                }
            }
        },

        initEvent() {
            let self = this;
            if (self._hasInitEvents) {
                return;
            }
            self.addEventListener(SocketManager.SOCKET_ERROR, self.errorHandler,self)
            self.addEventListener(SocketManager.SOCKET_CLOSE,self.socketCloseHandler, self)
            self._hasInitEvents = true;
        },

        connectHandler(){
                let self = this;
                self.dispatchEventWith(SocketEvents.SOCKET_CONNECT)
                

        },

        errorHandler(evt){
            SocketManager.instance.close()
            let GameEnterManager = require("GameEnterManager")
            if(GameEnterManager.instance.isPlayingGame()){

            } else {

            }
        },

        socketCloseHandler(evt){
            SocketManager.instance.close()
            if(this.notConnect){
                this.notConnect = false;
                if (this.closeCallBack){
                    this.closeCallBack()
                    this.closeCallBack = null;
                }
                return
            }

            let LoginManager = require('LoginManager')
            let GameConfigInfoManager = require('GameConfigInfoManager')
            if(GameConfigInfoManager.instance.needSwitchServer){
                let CenterControlManager = require("CenterControlManager");
                CenterControlManager.instance.requestGameServer(LoginManager.instance.loadServerGameId, function(code, serverStr, api, serverId) {
                    if(code == 0) {
                         if(serverId != GameConfigInfoManager.instance.serverId) {
                            GameConfigInfoManager.instance.serverId = serverId;
                            GameConfigInfoManager.instance.httpPatch = api;
                            GameConfigInfoManager.instance.socketIp = serverStr
                         }  

                         if(cc.sys.isBrowser) {

                         }
                    }
                })
            }
        },

        close(){
            let self = this;
            if(self._socket != null){
                self._socket.close();
            }
        },

        closeWithCallback(closeFinish) {
            this.notConnect = true;
            this.closeCallBack = closeFinish;
            this.close();
        }


})


SocketManager.instance = new SocketManager();
module.exports = SocketManager;  