import { _decorator, Component, find, loader, Node ,ResolutionPolicy,UITransformComponent,view, WidgetComponent,instantiate,resources, Asset, SceneAsset, Prefab} from 'cc';
import { UIController } from './UIController';
const { ccclass, property } = _decorator;


export enum UILayer{
    SCENE,
    GAME,
    HUD,
    POPUP,
    ALERT,
    NOTICE,
    MASK,
    NUM
}


export class UIMgr  {
    private static _inst:UIMgr = null
    public static get inst():UIMgr{
        if(!this._inst) {
            this._inst = new UIMgr()
        } 
        return this._inst
    }

    public resize(){
        let dr = view.getDesignResolutionSize()
        var s = view.getFrameSize()
        var rw = s.width
        var rh = s.height
        var finalW = rw;
        var finalH = rh

        if((rw/rh) > (dr.width / dr.height)) {
            finalH = dr.height
            finalW = finalH * rw /rh;
        } else {
            finalW = dr.width
            finalH = rh / rw * finalW
        }

        view.setDesignResolutionSize(finalW,finalH, ResolutionPolicy.UNKNOWN)
        let cvs = find("Canvas").getComponent(UITransformComponent)
        cvs.width  = finalW
        cvs.height = finalH

    }

    public setup(maxLayers:number) {
        this.resize()

        
        let canvas = find("Canvas").getComponent(UITransformComponent)
        if(canvas.node.children.length){
            return
        }

        for(let i = 0; i < maxLayers;i++) {
            let layerNode = new Node()
            layerNode.layer = canvas.node.layer
            let uiTransForm =  layerNode.getComponent(UITransformComponent)
            uiTransForm.width = canvas.width
            uiTransForm.height = canvas.height

            let widget = layerNode.getComponent(WidgetComponent)
            widget.isAlignBottom = true
            widget.isAlignLeft = true
            widget.isAlignRight = true
            widget.isAlignTop = true 

            widget.left = 0
            widget.right = 0
            widget.bottom = 0
            widget.top = 0
            canvas.node.addChild(layerNode)
        }

    }

    public getLayerNode(layerIndex:number) :Node {
        let canvas = find("Canvas")
        return canvas.children[layerIndex]
    }

    public showUI(uiCls:any, cb?:Function, target?:any) :any {
        let ui = new uiCls() as UIController
        let resArr = ui.getRes() || []
        console.log(ui.prefabUrl)
        loader.loadRes(ui.prefabUrl, Prefab , (err: any, prefab: Prefab) => {
           
            if(err){
                console.log(ui.prefabUrl+"   message  " +err)
            }else {
                let node :Node = null
                if(prefab){
                      node    = instantiate(prefab);
                } 
                else {
                    node = new Node();
                    node.layer = find('Canvas').layer;

                    //keep size
                    let widget = node.addComponent(WidgetComponent);
                    widget.isAlignBottom = true;
                    widget.isAlignTop = true;
                    widget.isAlignLeft = true;
                    widget.isAlignRight = true;
        
                    widget.left = 0;
                    widget.right = 0;
                    widget.top = 0;
                    widget.bottom = 0;
                } 
           

                ui.setup(node); 
            }
           

           
        });
        

        return ui
    }
}

 
