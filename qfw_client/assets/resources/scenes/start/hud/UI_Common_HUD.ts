import { _decorator, Component, Node ,director,ToggleComponent} from 'cc';
import { UIController } from '../../../qfw/base/UIController';
import { UILayer,UIMgr } from '../../../qfw/base/UIMgr';
import { UILayout_Common_HUD } from './UILayout_Common_HUD';
import { DemoMgr } from '../DemoMgr';
import { UI_SkyboxSetting } from '../../../common/skybox/UI_SkyboxSetting';
const { ccclass, property } = _decorator;

@ccclass('UI_Common_HUD')
export class UI_Common_HUD  extends UIController {
    constructor() {
        super('scenes/start/hud/ui_hud_common', UILayer.HUD);
    }

    private get layout(): UILayout_Common_HUD {
        return this.node.getComponent(UILayout_Common_HUD);
    }

    protected onCreated() {
        this.onButtonEvent(this.layout.btnSkyboxSetting, () => {
            UIMgr.inst.showUI(UI_SkyboxSetting);
        });

        this.onButtonEvent(this.layout.btnHome, () => {
            DemoMgr.inst.goto(0);
        });

        this.onToggleEvent(this.layout.useSkybox, (toggle: ToggleComponent) => {
            director.getScene().globals.skybox.enabled = toggle.isChecked;
        });

        this.onToggleEvent(this.layout.useIBL, (toggle: ToggleComponent) => {
            director.getScene().globals.skybox.useIBL = toggle.isChecked;
        });

        this.layout.useIBL.isChecked = director.getScene().globals.skybox.useIBL;
        this.layout.useSkybox.isChecked = director.getScene().globals.skybox.enabled;
        this.layout.title.string = DemoMgr.inst.current.title;

    }

}

