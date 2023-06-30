import { _decorator, Component, Node } from 'cc';
import { UILayer, UIMgr } from '../../qfw/base/UIMgr';
import { UI_SkyboxHUD } from './hub/UI_Skybox_HUD';
const { ccclass, property } = _decorator;

@ccclass('AppStart_Skybox')
export class AppStart_Skybox extends Component {
    start() {
        UIMgr.inst.setup(UILayer.NUM);
        UIMgr.inst.showUI(UI_SkyboxHUD);
    }

    update(deltaTime: number) {
        
    }
}

