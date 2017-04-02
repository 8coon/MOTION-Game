

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
    private _potentialArea: {side: number, front: number,};
    public chunkSize: {width: number, height: number, } = { width: 300, height: 300, };

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;

        this.loadChunks();
        this._potentialArea = {side: 300, front: 600,};

        JSWorks.EventManager.subscribe(this, this.scene, EventType.MAP_ENDS,
            (event, emiter) => { this.initRandomChunk(scene.getPlayer().getCurrentPosition()); })
    }

    public getScene(): MotionScene {
        return this.scene;
    }

    public loadChunks(): void {
        this.chunks = [
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
        ];
    }

    public initRandomChunk(position: any): void {
        const randomNum = Math.round(Math.random() * this.chunks.length);
        this.chunks[randomNum].init( {x: position.x, y: position.y, z: position.z,} );
    }

    get potentialArea(): { side: number; front: number } {
        return this._potentialArea;
    }

    set potentialArea(value: { side: number; front: number }) {
        this._potentialArea = value;
    }

}