import { game } from "cc";
import { UIController } from "../../../qfw/base/UIController";
import { UILayer, UIMgr } from "../../../qfw/base/UIMgr";
import { AvatarBodyparts } from "../AvatarBodyparts";

export class UI_AvatarHUD extends UIController {

    constructor() {
        super('scenes/avatar/hud/ui_avatar_hud_panel', UILayer.HUD);
    }

    protected onCreated() {

        let fn = (evt, args) => {
            game.emit(AvatarBodyparts.EVENT_CHANGE_PART, args.part,args.suit);
        }

        for (let i = 0; i < AvatarBodyparts.NUM; ++i) {
            let partName = AvatarBodyparts.getPartName(i);
            this.onButtonEvent('ops/' + partName + '/btn_004', fn, null, { part: i, suit: '004' });
            this.onButtonEvent('ops/' + partName + '/btn_006', fn, null, { part: i, suit: '006' });
            this.onButtonEvent('ops/' + partName + '/btn_008', fn, null, { part: i, suit: '008' });
        }
    }
}