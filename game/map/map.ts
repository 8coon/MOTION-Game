
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
    public chunkSize: {width: number, height: number, } = { width: 200, height: 200, };

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;

        this.loadChunks();
        this._potentialArea = {side: 300, front: 300,};

        JSWorks.EventManager.subscribe(this, this.scene, EventType.MAP_ENDS,
            (event, emiter) => { this.initRandomChunk(event.data); })
    }

    public getScene(): MotionScene {
        return this.scene;
    }

    public loadChunks(): void {
        this.chunks = [
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
        ];
    }

    public initRandomChunk(position: {leftDown: {x: number, z:number}, rightTop:{x:number,z:number}}): void {

        //проход по прямоугольной бласти и рендеринг блоков в ней

        // console.log(Math.round(position.rightTop.z / this.chunkSize.height) * this.chunkSize.height);
        for (let z = Math.round(position.rightTop.z / this.chunkSize.height) * this.chunkSize.height;
             z >= position.leftDown.z; z -= this.chunkSize.height) {

            for (let x = Math.round(position.leftDown.x / this.chunkSize.width) * this.chunkSize.width;
                 x <= position.rightTop.x; x += this.chunkSize.width) {

                const currentChunkPos = {x: x, z: z };
                // const temp1 = Math.round(position.rightTop.z / this.chunkSize.height) * this.chunkSize.height;
                // console.log(temp1);
                console.log(currentChunkPos);
                this.chunks[this.counter].init(currentChunkPos);
                this.counter = (this.counter + 1) % this.chunks.length;
            }

        }
    }

    public initStartChunk() {
        this.initRandomChunk({leftDown: {x: -this._potentialArea.side / 2, z: 0},
            rightTop: {x: this._potentialArea.side / 2, z: this._potentialArea.front }});
        this.counter = 3;
    }

    get potentialArea(): { side: number; front: number } {
        return this._potentialArea;
    }

    set potentialArea(value: { side: number; front: number }) {
        this._potentialArea = value;
    }

}