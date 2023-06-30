import { _decorator, Component, director, Node } from 'cc';
import { UIController } from '../../qfw/base/UIController';
import { UIMgr } from '../../qfw/base/UIMgr';
import { UI_Common_HUD } from './hud/UI_Common_HUD';
const { ccclass, property } = _decorator;

@ccclass('DemoMgr')
export class DemoMgr  {
    private static _inst:DemoMgr

    public static get inst():DemoMgr{
        if(!this._inst) {
            this._inst = new DemoMgr()
        }
        return this._inst
    }

    private _demos = null
    private _isLoading  = false
    private _currentIndex :number = 0

    constructor() {
        this._demos = [
            { title: 'Cocos Creator 3D 实用案例\nCocos Creator 3D Cases', folder: 'scenes/start', scene: 'start', icon: '' },
            { title: '换装\nAvatar', folder: 'scenes/avatar', scene: 'avatar', icon: 'preview.jpg' },
            { title: '天空盒\nSkybox', folder: 'scenes/skybox', scene: 'skybox', icon: 'preview.jpg' },
            { title: '武器发光\nWeapon Glow', folder: 'scenes/weapon_glow', scene: 'weapon_glow', icon: 'preview.jpg' }
       
        ]
    }

    public get demos(){
        return this._demos
    }

    public get current(): { title: string, folder: string, scene: string, icon: string } {
        return this._demos[this._currentIndex];
    }

    public goto(demoIndex: number) {
        if (this._isLoading) {
            return;
        }

        this._currentIndex = demoIndex
        UIController.hideAll()

        let demo = this._demos[demoIndex] as { title: string, folder: string, scene: string, icon: string }
        if(demo && director.getScene().name != demo.scene) {
            this._isLoading = true 
            director.loadScene(demo.scene, (error) => {
                this._isLoading = false;
                if (error) {
                    alert('demo not found!');
                    DemoMgr.inst.goto(0);
                    return;
                }
                if (demoIndex != 0) {
                    UIMgr.inst.showUI(UI_Common_HUD);
                }
            });
        }

    }
}

