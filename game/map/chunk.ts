

import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";
declare const BABYLON;
declare const JSWorks;

export class Chunk extends (<INewable> BABYLON.Mesh) {

    private scene: MotionScene;
    public ground: any;

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;
    }

    public getScene(): MotionScene {
        return this.scene;
    }

    public init(position: {x: number, y: number, z: number}) {
        this.ground = BABYLON.Mesh.CreateGround('ground', 300, 300, 250, this.scene);
        this.ground.position.x = position.x;
        this.ground.position.z = position.z;
        this.ground.position.y = -10;
        this.ground.material = new BABYLON.StandardMaterial('ground', this.scene);
        if (this.name === "red") {
            this.ground.material.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        }
        if (this.name === "green") {
            this.ground.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
        }
        if (this.name === "blue") {
            this.ground.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 1.0);
        }
        this.ground.material.wireframe = true;
        console.log(this.ground);
    }
}