var Handler = require("Handler");
var Dictionary = require("Dictionary")
var CSVParser = require("CSVParser")

var LevelCSVConfig = cc.Class({
        name: "LevelCSVConfig",

        properties:() =>({ 
        }),

        statics:{
                _parseComplete:Handler,
                _cache: Dictionary,

                getCfg(id){
                        let cache = LevelCSVConfig._cahce;
                        if(cache != null) {
                                return cache.find(id);
                        }
                        return null;
                },

                getAllRows(){
                        return LevelCSVConfig._cache.getAllValues();
                }
        },

        setup(csvInfo, csvStr, parseComplete){
                let self = this;
                LevelCSVConfig._parseComplete = parseComplete;

                CSVParser.ParseFile(csvInfo, csvStr, "Level_csv",Handler.create(self, self.parseCallBack));
                csvInfo = null;
        },

        parseCallBack(dictionary) {
                let self = this;
                LevelCSVConfig._cache = dictionary;
                if(LevelCSVConfig._parseComplete != null) {
                        LevelCSVConfig._parseComplete.run();
                }
        }

});