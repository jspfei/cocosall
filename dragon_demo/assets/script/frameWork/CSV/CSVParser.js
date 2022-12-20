var Handler = require("Handler")
var Dictionary = require("Dictionary")

var CSVParser = cc.Class({
        name:"CSVParser",

        properties:()=>({

        }),

        statics:{
                callBackHandler:Handler,

                ParseFile(csvInfo, csvStr, csvResName, callBack){
                        let self = this;
                        CSVParser.callBackHandler = callBack;
                        var info = csvStr
                        CSVParser.readVerCsvFileCallBack(csvInfo,info)
                        csvInfo = null;
                        csvStr = null;
                },

                readVerCsvFileCallBack(csvInfo, info){
                        let self = this;
                        var result = CSVParser.Parse(csvInfo, info);
                        info = null;  
                        if (CSVParser.callBackHandler != null) CSVParser.callBackHandler.runWith([result])
                },


                Parse(csvInfo, sourceText) {
                        let self = this; 
                        let result = new Dictionary();
                        let lineList = sourceText.split("\n")
                        let keyList = [];
                        let typeList = [];

                        let n = lineList.length;
                        for (let i = 0; i < n; i++) {
                                let line = self.trim(lineList[i]);
                                if (line.length <= 0) continue;

                                if(i > 2) { //数据
                                        let record = csvInfo.getTemplateClass();
                                        let itemList = CSVParser.ParseLine(line);
                                        CSVParser.ParseRecord(keyList,typeList,itemList,record);
                                      
                                        result.add(parseInt(itemList[0]),record);
                                        continue;
                                }

                                if(i == 0) keyList = CSVParser.ParseLine(line); 	//第一行, key.
                                if(i == 1) typeList = CSVParser.ParseLine(line) //第二行, type.
                        } 

                        return result;
                },

                trim(ostr){
                        let r1 = /^\s+/;
                        let r2 = /\s+$/;
                        return ostr.replace(r1,"").replace(r2,"")
                },

                ParseLine(line){
                        let self = this;
                        let itemList = line.split(",")
                        let result = []
                        let n = itemList.length;
                        for (let i = 0; i < n; i++){
                                result[i] = CSVParser.trim(itemList[i])
                        }
                        return result;
                },

                ParseRecord(keyList, typeList, itemList, record){
                        let self = this;
                        let n = itemList.length;
                        for(let i = 0; i < n ; i++) {
                                record[keyList[i]] = CSVParser.CastType(typeList[i], itemList[i]);
                        } 
                },

                CastType(type, value) {
                        if(type == "bool") return value =="1" ? true : false;
                        if(type == "int") return parseInt(value);
                        if(type == "float") return parseFloat(value);
                        return value;
                }
        }

})