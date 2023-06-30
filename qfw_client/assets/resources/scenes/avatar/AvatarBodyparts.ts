 
export class AvatarBodyparts  {
    public static HEAD = 0
    public static BODY = 1;
    public static HAND = 2;
    public static LEG = 3;
    public static WEAPON = 4;
    public static NUM = 5;

    public static EVENT_CHANGE_PART:string = "AvatarBodyparts.EVENT_CHANGE_PART"
    public static bodypartsName = ["tou","shen","shou","jiao"]

    public static getNameOfBodypart(part:number, suitId:string) {
        if(part == AvatarBodyparts.WEAPON) {
            return 'ch_we_one_hou_' + suitId;
        } else {
            return 'ch_pc_hou_' + suitId + '_' + this.bodypartsName[part];
        }
    }

    public static getPartName(part: number) {
        return this.bodypartsName[part];
    }
}

