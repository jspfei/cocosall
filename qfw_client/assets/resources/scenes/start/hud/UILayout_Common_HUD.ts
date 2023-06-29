import { _decorator, ButtonComponent, Component, LabelComponent, Node, ToggleComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UILayout_Common_HUD')
export class UILayout_Common_HUD extends Component {
     
    @property({type:ToggleComponent})
    useSkybox:ToggleComponent = null

    @property({type:ToggleComponent})
    useIBL:ToggleComponent

    @property({type:ButtonComponent})
    btnSkyboxSetting:ButtonComponent

    @property({type:ButtonComponent})
    btnHome:ButtonComponent

    @property({type:LabelComponent})
    title:LabelComponent
    
}

