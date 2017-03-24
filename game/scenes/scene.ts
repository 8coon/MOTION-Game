import {INewable} from '../common/INewable';
import {Player} from '../player/player';


declare const BABYLON;


export class MotionScene extends (<INewable> BABYLON.Scene) {

    private camera: any;
    private player: Player;


    constructor(engine) {
        super(engine);

        this.camera = new BABYLON.Camera('', new BABYLON.Vector3(), this);
        this.player = new Player('player', this);
    }

}
