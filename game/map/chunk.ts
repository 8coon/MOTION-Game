

import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";
declare const BABYLON;
declare const JSWorks;

export class Chunk extends (<INewable> BABYLON.Mesh) {

    private scene: MotionScene;

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;
    }

    public init() {
        const ground = BABYLON.Mesh.CreateGround('ground', 5000, 5000, 250, this.scene);
        ground.position.y = -10;
        ground.material = new BABYLON.StandardMaterial('ground', this.scene);
        ground.material.wireframe = true;
    }
}