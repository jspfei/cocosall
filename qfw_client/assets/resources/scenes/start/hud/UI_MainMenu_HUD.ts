import { _decorator, Component,loader, ImageAsset, instantiate, LabelComponent, Node, resources, SpriteComponent, SpriteFrame } from 'cc';
import { UIController } from '../../../qfw/base/UIController';
import { UILayer } from '../../../qfw/base/UIMgr';
import { UILayout_MainMenu_HUD } from './UILayout_MainMenu_HUD';
import { DemoMgr } from '../DemoMgr';
const { ccclass, property } = _decorator;

@ccclass('UI_MainMenu_HUD')
export class UI_MainMenu_HUD extends UIController {
     
    constructor() {
        super('scenes/start/hud/ui_main_menu_hud_panel', UILayer.HUD);
    }
    private get layout(): UILayout_MainMenu_HUD {
        return this.node.getComponent(UILayout_MainMenu_HUD);
    }
    
    protected onCreated() {
        let demos = DemoMgr.inst.demos
        let prefab = this.layout.demoList.children[0];
        prefab.removeFromParent();
        for(let i = 1; i < demos.length ; i++) {
            let demo = demos[i]  as { title: string, scene: string, icon: string, folder: string };
            let node = instantiate(prefab)
            this.layout.demoList.addChild(node)
            node.getChildByName('title').getComponent(LabelComponent).string = demo.title
            if(demo.folder && demo.icon){
                loader.loadRes(demo.folder +"/" + demo.icon, ImageAsset, (err:Error , imgAsset:ImageAsset) => {
                    if(imgAsset ) {
                        node.getChildByName("preview").getComponent(SpriteComponent).spriteFrame = SpriteFrame.createWithImage(imgAsset)    
                    }
                })
            }
            this.onButtonEvent(node, () => {
                DemoMgr.inst.goto(i);
            });
         }

    }
}

