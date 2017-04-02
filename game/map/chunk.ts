

import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";
declare const BABYLON;
declare const JSWorks;

export class Chunk extends (<INewable> BABYLON.Mesh) {

    private scene: MotionScene;
    public ground: any;

    private height: number = 300;
    private width: number = 300;

    constructor(name: string, scene: MotionScene, widht, height) {
        super(name, scene);
        this.scene = scene;
        this.width = widht;
        this.height = height;
        this.ground = BABYLON.Mesh.CreateGround('ground', this.width, this.height, 50, this.scene)
        this.ground.position.z = -1000;
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
    }

    public getScene(): MotionScene {
        return this.scene;
    }

    public init(position: {x: number, z: number}) {
        this.ground.position.x = position.x;
        this.ground.position.z = position.z;
        this.ground.position.y = -10;
    }

    public getSize(): {h: number, w: number} {
        return {h: this.height, w: this.width};
    }
}