

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

    public getScene(): MotionScene {
        return this.scene;
    }

    public init(x: number, y: number) {
        const ground = BABYLON.Mesh.CreateGround('ground', 5000, 5000, 250, this.scene);
        ground.position.y = -10;
        ground.material = new BABYLON.StandardMaterial('ground', this.scene);
        if (this.name === "red") {
            ground.material.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        }
        if (this.name === "green") {
            ground.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
        }
        if (this.name === "blue") {
            ground.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 1.0);
        }
        ground.material.wireframe = true;
    }
}