var GiveChangeTool = cc.Class({
        name:"GiveChangeTool",

        statics: {
                give(goldValue, faceValueList) {
                        let changeList = []
                        let faceValueListLen = faceValueList.length;
                        let faceValue = 0
                        for (let i = faceValueListLen - 1; i >= 0; i--){
                                faceValue = parseInt(faceValueList[i])
                                while(goldValue >= faceValue && goldValue > 0) {
                                        goldValue =  goldValue - faceValue
                                        changeList.push(faceValue)
                                }
                        }
                        return changeList;
                }
        }
})