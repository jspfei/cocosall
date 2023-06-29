import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UILayout_MainMenu_HUD')
export class UILayout_MainMenu_HUD extends Component {

    @property({type:Node})
    demoList:Node = null;
    
}

