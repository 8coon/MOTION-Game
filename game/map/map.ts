

import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";
import {Chunk} from "./chunk";
import {EventType} from "../common/EventType";
declare const BABYLON;
declare const JSWorks;

export class Map extends (<INewable> BABYLON.Mesh) {

    private chunks: Chunk[];
    private scene: MotionScene;
    private counter: number = 0;

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;

        this.loadChunks();

        JSWorks.EventManager.subscribe(this, this.scene, EventType.MAP_ENDS,
            (event, emiter) => { this.initRandomChunk(scene.getPlayer().getCurrentPosition()); })
    }

    public getScene(): MotionScene {
        return this.scene;
    }

    public loadChunks(): void {
        this.chunks = [new Chunk("green", this.scene), new Chunk("red", this.scene), new Chunk("blue", this.scene)];
    }

    public initRandomChunk(position: any): void {
        console.log(this.chunks);
        console.log(this.counter);
        console.log(position);
        this.chunks[this.counter].init({x: position.x, y: position.y, z: position.z});
        this.counter++;
    }
}