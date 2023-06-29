import { _decorator, Component, Node, Vec3, v3, CameraComponent, Terrain } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeFloatingAnim')
export class NodeFloatingAnim extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private _angles:Vec3 = v3(0,0,0);
    private _pos:Vec3 = v3(0,0,0);
    private _lifeTime = Math.random();

    @property
    rotateSpeed:number = 10;

    @property
    updownSpeed:number = 1;

    start () {
        // Your initialization goes here.
        this._angles = this.node.eulerAngles.clone();
        this.node.getPosition(this._pos);
    }

    update (deltaTime: number) {
         if(this.rotateSpeed){
            this._angles.y += deltaTime * this.rotateSpeed;
            this.node.eulerAngles = this._angles;
         }

         if(this.updownSpeed){
            this._lifeTime += deltaTime;
         
            this.node.getPosition(this._pos);
            this._pos.y = Math.sin(this._lifeTime * this.updownSpeed);
            this.node.setPosition(this._pos);
         }
    }
}
