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
    private _potentialArea: { side: number, front: number, };
    public chunkSize: { width: number, height: number, } = {width: 200, height: 200,};
    // private renderedChunks: Chunk[] = [];
    private _activeChunk: Chunk;
    private visibleChunks: number[] = [];
    private visibleArea: { leftDown: { x: number, z: number }, rightTop: { x: number, z: number } };

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;

        this.loadChunks();
        this._potentialArea = {side: 400, front: 500,};

        JSWorks.EventManager.subscribe(this, this.scene, EventType.MAP_ENDS,
            (event, emiter) => {

                // console.log(event.data.potentialArea);
                // console.log(this.visibleChunks);
                this.chunks.forEach(chunk => {
                    if (!chunk.isSeeable(event.data.visibleArea)) {
                        chunk.isActive = false;
                    }
                });
                console.log(this.visibleChunks);

                this.initRandomChunk(event.data.visibleArea, false);

                const pos = event.data.shipPosition;
                this.chunks.forEach(chunk => {
                    if (chunk.inArea(pos)) {
                        this.activeChunk = chunk;
                        return;
                    }
                });

            }
        )
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
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
        ];
    }

    public initRandomChunk(position: { leftDown: { x: number, z: number }, rightTop: { x: number, z: number } }, start:boolean): void {

        //проход по прямоугольной бласти и рендеринг блоков в ней
        // const newVisibleArea = this.visibleArea;
        for (let z = Math.round(position.rightTop.z / this.chunkSize.height) * this.chunkSize.height;
             z >= position.leftDown.z; z -= this.chunkSize.height) {

            for (let x = Math.round(position.leftDown.x / this.chunkSize.width) * this.chunkSize.width;
                 x <= position.rightTop.x; x += this.chunkSize.width) {
                // console.log(this.visibleChunks);
                // debugger;


                console.log("x", x);
                const currentChunkPos = {x: x, z: z};
                if (!start && this.isRendered(currentChunkPos)) {
                    console.log("eee");
                    continue;
                }
                // console.log(currentChunkPos);
                for (let i = 0; i < this.chunks.length && this.chunks[this.counter].isActive; i++) {
                    this.counter = (this.counter + 1) % this.chunks.length;
                }
                this.chunks[this.counter].init(currentChunkPos);
                this.counter = (this.counter + 1) % this.chunks.length;
            }

        }
        this.visibleArea = position;
        console.log(this.visibleArea);
    }

    public initStartChunk() {
        this.visibleArea = {
            leftDown: {x: 0, z: 0},
            rightTop: {x: 0, z: 0}
        };

        this.initRandomChunk({
            leftDown: {x: -this._potentialArea.side / 2, z: 0},
            rightTop: {x: this._potentialArea.side / 2, z: this._potentialArea.front}
        }, true);

        this.chunks.forEach(chunk => {
            if (chunk.inArea(new BABYLON.Vector3(0, 0, 1))) {
                this._activeChunk = chunk;
                console.log(this._activeChunk);
                return;
            }
        });

    }

    get potentialArea(): { side: number; front: number } {
        return this._potentialArea;
    }

    set potentialArea(value: { side: number; front: number }) {
        this._potentialArea = value;
    }

    get activeChunk(): Chunk {
        return this._activeChunk;
    }

    set activeChunk(value: Chunk) {
        this._activeChunk = value;
    }

    public isRendered(pos: { x: number, z: number }): boolean {
        return (this.visibleArea.leftDown.z < pos.z) && (this.visibleArea.leftDown.x < pos.x)
            && (this.visibleArea.rightTop.z > pos.z) && (this.visibleArea.rightTop.x > pos.x);
    }



}