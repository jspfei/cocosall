var SocketManager = require("SocketManager")

var SocketEvents = require("SocketEvents");
var ProtoInType = require("ProtoInType");

var ToastManager = cc.Class({
        statics: {
                instance: null,
                k_EVENT_RECEIVE_TOAST: "k_EVENT_RECEIVE_TOAST",
                k_EVENT_SPLICE_TOAST: "k_EVENT_SPLICE_TOAST",
        },

        properties: {
                _view: cc.Node,
                _views: [],
                list: [],
                _toastId: 1,
        },

        genID() {
                return this._toastId++;
        },

        setup() {
                let self = this;
                SocketManager.instance.addEventListener(SocketEvents.GET_SC_EVENT(ProtoInType.TOAST_SC), (event) => {

                }, self);

                this.initToast()
                this.checkInRoomToast()
        },

        initToast() {
                let self = this;
                var ResPatchManager = require("ResPatchManager")
                let url = ResPatchManager.instance.RoomToastView;
                let AssetManager = require('AssetManager');
                let Handler = require('Handler');


                AssetManager.instance.getNormalAsset(url, Handler.create(self, obj => {
                        if (obj) {
                                let node = cc.instantiate(obj)
                                self._view = node.getComponent('RoomToastView')
                                if (callback) {
                                        callback();
                                }
                        }
                }))
        },

        checkInRoomToast() {
                let self = this;
                if (this.timerHandler) {
                        clearTimeout(this.timerHandler)
                }
                this.timerHandler = setTimeout(() => {
                        self.checkInRoomToast();
                }, 300 * 1000)

                let GameEnterManager = require("GameEnterManager")
                if (GameEnterManager.instance.isPlayingGame()) {
                        let GameConfig = require("GameConfig")
                        let hornlist = GameConfig.instance.getHornList()
                        if (hornlist && hornlist.length) {
                                hornlist.foEach(info => {
                                        let oneInfo = self.parseOneMsg(info)
                                        self.showToastToRoom(oneInfo)
                                })
                        }
                }

        },

        showToastToRoom(info) {
                let self = this;
                let GameEnterManager = require("GameEnterManager")
                if (GameEnterManager.instance.isPlayingGame()) {
                        let roomMsg = {
                                msg: info.msg,
                                userId: info.userId,
                                count: 3
                        }
                        if (!cc.isValid(this._view)) {
                                if (!this.roomToastList) {
                                        this._roomToastList = [];
                                }
                                this._roomToastList.push(roomMsg)
                                if (this._loadingToast) {
                                        return;
                                }
                                this._loadingToast = true;
                                this.initToast(function ()   {
                                        self._loadingToast = false;
                                        self._roomToastList.forEach( element =>{
                                                self._view.insectNotice(element)
                                        });
                                        self._roomToastList = null;
                                }) 
                        } else {
                                this._view.insectNotice(roomMsg)
                        }
                }
        },

        showToast(info) {
                let self = this;
                this._views.forEach(element => {
                        if (cc.isValid(element) && element.insectNotice) {
                                element.insectNotice({
                                        msg: info.msg,
                                        userId: info.userId,
                                        count: 1
                                });
                        }
                });
                self.showToastToRoom(info)
        },

        showSendToastView(){

                
        }







})