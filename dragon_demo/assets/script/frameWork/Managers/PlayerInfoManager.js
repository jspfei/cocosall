var PlayerInfoManager = cc.Class({
        extends: require("CustomEvent"),
        statics: {
                instance: null,
                EVENT_GOLD_CHANGED: "K_EVENT_GOLD_CHANGED",
        },

        properties: () => ({
                _userId: 0,
                _userType: 0,
                _nikeName: "",
                _gold: 0,

                userId: {
                        set: function (value) {
                                this._userId = value;
                        },
                        get: function () {
                                return this._userId;
                        }
                },

                userType: {
                        set: function (value) {
                                this._userType = value;
                        },
                        get: function () {
                                return this._userType;
                        }
                },

                nickName: {
                        set: function (value) {
                                this._nikeName = value;
                        },
                        get: function () {
                                return this._nikeName;
                        }
                },

                gold: {
                        set: function (value) {
                                this._gold = value;
                                GlobalSDKManager.dispatchEventWith(PlayerInfoManager.EVENT_GOLD_CHANGED, value);
                        },
                        get: function () {
                                return this._gold;
                        }
                },
        }),

        initEvent(){

        },
        
});

PlayerInfoManager.instance = new PlayerInfoManager()
module.exports = PlayerInfoManager;