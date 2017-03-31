

import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";
import {Chunk} from "./chunk";
declare const BABYLON;
declare const JSWorks;

export class Map extends (<INewable> BABYLON.Mesh) {

    private chunks: Chunk[];
    private scene: MotionScene;

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;
    }


}