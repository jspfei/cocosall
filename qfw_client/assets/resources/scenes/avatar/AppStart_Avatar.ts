import { _decorator, Component, Node } from 'cc';
import { UILayer, UIMgr } from '../../qfw/base/UIMgr';
import { UI_AvatarHUD } from './hud/UI_AvatarHUD';
const { ccclass, property } = _decorator;

@ccclass('AppStart_Avatar')
export class AppStart_Avatar extends Component {
    start() {
        UIMgr.inst.setup(UILayer.NUM);
        UIMgr.inst.showUI(UI_AvatarHUD);
    }

    update(deltaTime: number) {
        
    }
}

