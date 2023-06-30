import { _decorator, Component, find, game, ImageAsset, instantiate, loader, Material, Node, Prefab, resources, SkinningModelComponent, Texture2D } from 'cc';
import { AvatarBodyparts } from './AvatarBodyparts';
const { ccclass, property } = _decorator;

@ccclass('Avatar')
export class Avatar extends Component {

    private bodyparts:Node[] = []
    private _rootNode:Node 

    @property({type:Texture2D})
    public tex:Texture2D = null


    start() {
        this.changeBodypart(AvatarBodyparts.HEAD, '004')
        this.changeBodypart(AvatarBodyparts.BODY, '004')
        this.changeBodypart(AvatarBodyparts.HAND, '004')
        this.changeBodypart(AvatarBodyparts.LEG, '004')

        game.on(AvatarBodyparts.EVENT_CHANGE_PART, this.changeBodypart,this)
    }

    onDestroy() {
        game.off(AvatarBodyparts.EVENT_CHANGE_PART,this.changeBodypart,this)
    }

    changeBodypart(part:number, suitId:string) {
        let oldPart = this.bodyparts[part]
        if (oldPart) {
            oldPart.removeFromParent()
            oldPart.destroy()
            this.bodyparts[part] = null
        }

        let partName = ''
        if(part == AvatarBodyparts.WEAPON) {
            partName = 'ch_we_hou_' + suitId
        } else {
            partName = 'ch_pc_hou_' + suitId +"_"+AvatarBodyparts.getPartName(part)
        }

        loader.loadRes('scenes/avatar/prefabs/' + partName, Prefab, (err, prefab) =>{
            let node = instantiate(prefab)
            if(part == AvatarBodyparts.WEAPON) {

            }else {
                this.node.addChild(node)

            }

            this.bodyparts[part] = node
            let meshNode = find('RootNode/' + partName, node)
            let albedoMapName = AvatarBodyparts.getNameOfBodypart(part,suitId) +"_d"
            console.log("---textures ----"+albedoMapName)
            resources.load('scenes/avatar/textures/' + albedoMapName, ImageAsset, (err, tex: ImageAsset) => {
               
               if (tex) {
                    const texture = new Texture2D();
                    texture.image = tex;
                    meshNode.getComponent(SkinningModelComponent).material.setProperty('albedoMap', texture);
                }
            });
        })
    }

    update(deltaTime: number) {
        let r = this.node.eulerAngles.clone()
        r.y += deltaTime * 10
        this.node.eulerAngles = r
    }
}

