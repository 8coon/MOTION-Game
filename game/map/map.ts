
import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";

declare const BABYLON;
declare const JSWorks;

export class Map extends (<INewable> BABYLON.Mesh) {

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
    }
}