import { _decorator, ButtonComponent, Component, Node, TextureCube ,loader, director,find} from 'cc';
import { UIController } from '../../../qfw/base/UIController';
import { UILayer } from '../../../qfw/base/UIMgr';
const { ccclass, property } = _decorator;

 
export class UI_SkyboxHUD extends UIController {
   
    constructor(){
        super("scenes/skybox/hub/ui_skybox_hud_panel",UILayer.HUD)
    }

    private _oldSelected:ButtonComponent = null
    private _isLoadingCubemap = false

    protected onCreated() {
        for(let i= 0; i < 5; i++) {
            let index = i + 1
            let sep = index < 10 ? "0":""
            let skyboxName = sep + index
            let btnName = 'ScrollView/view/content/btn_0' + skyboxName;
            this.onButtonEvent(btnName,(btn:ButtonComponent, skyboxName:string)=>{
                if(this._isLoadingCubemap) {
                    return 
                }

                this._isLoadingCubemap = true

                btn.interactable = false;
                if (this._oldSelected) {
                    this._oldSelected.interactable = true;
                }
                this._oldSelected = btn;

                loader.loadRes('common/skybox/cubemap_sky'+skyboxName,TextureCube,(err, cubemap:TextureCube) =>{
                    this._isLoadingCubemap = false
                    director.getScene().globals.skybox.envmap = cubemap
                })

            },this,skyboxName)

            if(i == 0){
                this._oldSelected = (find(btnName,this.node) as Node).getComponent(ButtonComponent);
                this._oldSelected.interactable = false;
            }
        }


    }
}

