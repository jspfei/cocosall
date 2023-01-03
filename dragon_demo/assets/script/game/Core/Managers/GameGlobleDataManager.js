
const Handler = require("Handler") 
const Dictionary = require("Dictionary");
const ResPatchManager = require("ResPatchManager");
const LevelCSVConfig = require("LevelCSVConfig")
const LevelBean = require("LevelBean")

const AssetManager = require("AssetManager")



var GameGlobleDataManager = cc.Class({
        name: "GameGlobleDataManager",
        statics: {
            instance: null
        },

        properties:() =>({
                _initStepCompleteCallBack:Handler,
                _totalStepCsvList:Dictionary, //键 string, 值 ICsvData 
                _beanTypeList:Dictionary ,// 键 string 值 BaseTemplate 
                _needParseCount:0,
                _currParseCount:0,
                _isParseIngBln:false,


                isInitCompleteBln:false,
        }),

        ctor: function(){
                let self = this;
                self._totalStepCsvList = new Dictionary()
                self._beanTypeList = new Dictionary();
        },

        setup(){
                let self = this

                let Level_csv = ResPatchManager.instance.LevelCSV;
                self._totalStepCsvList.add(Level_csv, new LevelCSVConfig());
                self._beanTypeList.add(Level_csv, new LevelBean());
        },
        initStep(complete){
                let self = this;
                self._initStepCompleteCallBack = complete;
                self._needParseCount = self._totalStepCsvList.count();

               
                if(self._currParseCount >= self._needParseCount){
                        self.initStepComplete();
                } else {
                        if(!self._isParseIngBln){
                                self.getCsvFile();
                        }   
                }

             
        },
        getCsvFile(){
                let self = this;
                self._isParseIngBln = true;
                let key = self._totalStepCsvList.getKeyByIndex(self._currParseCount);
                let keyStrAry= key.split("_")
                key = key.replace("_",".")
                let patch = ResPatchManager.instance.getCSVPatch(keyStrAry[0])
                AssetManager.instance.getRawAsset(patch,AssetManager.normal, Handler.create(self, self.getCSVFileCallBackHandler))

        },
        getCSVFileCallBackHandler(data){
                let csvStr = data.text || data;
                this.starSingleParse(csvStr)
        },

        starSingleParse(csvStr) {
                let self = this;
                let key = self._totalStepCsvList.getKeyByIndex(self._currParseCount);
                jf.log("[解析csv] > key > " +key);
               
                let icsvData = self._totalStepCsvList.getValueByIndex(self._currParseCount)
                let bean = self._beanTypeList.find(key);
                icsvData.setup(bean, csvStr, Handler.create(self, self.singleParseComplete, null, false))
        },

        singleParseComplete(){
                let self = this;
                self._isParseIngBln = false; 
                self._currParseCount ++;
                
        },
        initStepComplete() {
                let self = this;
                if (self._initStepCompleteCallBack != null) {
                        self._initStepCompleteCallBack.run();
                }
        }  

});
GameGlobleDataManager.instance = new GameGlobleDataManager();
module.exports = GameGlobleDataManager;
