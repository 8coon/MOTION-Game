import {INewable} from '../common/INewable';


declare const BABYLON: any;


export class MotionScene extends (<INewable> BABYLON.Scene) {

    constructor(engine) {
        super(engine);

        console.dir(this);
    }

}
