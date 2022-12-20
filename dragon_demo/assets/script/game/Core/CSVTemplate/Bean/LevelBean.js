var LevelBean = cc.Class({
        name:"LevelBean",
        properties: ()=>({
                level:0,
                upgradeExp:0,
                gold:0,
        }),

        getTemplateClass(){
                let obj = new LevelBean()
                return obj;
        }
})