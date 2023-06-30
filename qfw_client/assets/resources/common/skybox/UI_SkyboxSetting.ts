import { _decorator, ButtonComponent, Component, director, find, loader, Node, TextureCube } from 'cc';
import { UIController } from '../../qfw/base/UIController';
import { UILayer } from '../../qfw/base/UIMgr';
const { ccclass, property } = _decorator;

@ccclass('UI_SkyboxSetting')
export class UI_SkyboxSetting extends UIController {

    constructor() {
        super('common/skybox/ui_skybox_setting', UILayer.POPUP);
    }

    private _oldSelected: ButtonComponent = null;
    private _isLoadingCubemap = false;
    
    protected onCreated(): void {
        this.onButtonEvent('btn_close',()=>{
            this.hide();
        });

        for(let i =0; i < 5; i++) {
            let index = i + 1
            let sep = index < 10 ? "0":""
            let skyboxName = sep + index
            let btnName = 'content/btn_0' + skyboxName;

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

