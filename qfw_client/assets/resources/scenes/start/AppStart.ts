import { _decorator, Component, Node } from 'cc';
import { UILayer, UIMgr } from '../../qfw/base/UIMgr';
import { UI_Common_HUD } from './hud/UI_Common_HUD';
import { UI_MainMenu_HUD } from './hud/UI_MainMenu_HUD';
const { ccclass, property } = _decorator;

@ccclass('AppStart')
export class AppStart extends Component {
    start() {
        UIMgr.inst.setup(UILayer.NUM)
        UIMgr.inst.showUI(UI_Common_HUD);
        UIMgr.inst.showUI(UI_MainMenu_HUD);
    }

    update(deltaTime: number) {
        
    }
}

