import {INewable} from '../common/INewable';
import {Entity} from '../entity/entity';
import {IControllable} from '../entity/IControllable';
import {EventType} from '../common/EventType';
import {BulletManager} from '../entity/BulletManager';
import {Loader} from "../common/Loader";
import {Skydome} from "../sky/skydome";


declare const BABYLON;
declare const JSWorks;


export class MotionScene extends (<INewable> BABYLON.Scene) {

    private player: Entity;
    private skydome: Skydome;

    public meshesLoader: Loader;
    public shadersLoader: Loader;
    private loadersCount: number = 0;
    private loadersFired: number = 0;

    private loader;
    public currentInput: IControllable;
    public bulletManager: BulletManager;


    constructor(engine) {
        super(engine);
        engine.enableOfflineSupport = false;
        this.bulletManager = new BulletManager(this);

        JSWorks.EventManager.subscribe(this, this, EventType.JOYSTICK_MOVE,
            (event, emitter) => { this.currentInput.joystickMoved(event.data.x, event.data.y); });
        JSWorks.EventManager.subscribe(this, this, EventType.JOYSTICK_PRESS,
            (event, emitter) => { this.currentInput.joystickPressed(); });
    }


    public initMeshesLoader() {
        this.meshesLoader = new Loader(this.loader);
        this.loadersCount++;

        this.meshesLoader.taskAdder = (self, name, root, file) => {
            return self.loader.addMeshTask(name, '', root, file);
        };

        this.meshesLoader.resultGetter = (self, task) => {
            task.loadedMeshes[0].setEnabled(false);
            return task.loadedMeshes[0];
        };

        JSWorks.EventManager.subscribe(this, this.meshesLoader, EventType.LOAD_SUCCESS,
            () => { this.onLoaderSuccess(); })
    }


    public initShadersLoader() {
        this.shadersLoader = new Loader(this.loader);
        this.loadersCount++;

        this.shadersLoader.taskAdder = (self, name, root, file) => {
            return self.loader.addTextFileTask(name, `${root}/${file}`);
        };

        this.shadersLoader.resultGetter = (self, task) => {
            BABYLON.Effect.ShadersStore[task.name] = task.text;
            return task.text;
        };

        JSWorks.EventManager.subscribe(this, this.shadersLoader, EventType.LOAD_SUCCESS,
            () => { this.onLoaderSuccess(); })
    }


    public onLoaderSuccess() {
        this.loadersFired++;

        if (this.loadersCount === this.loadersFired) {
            [EventType.MESHES_LOAD, EventType.SHADERS_LOAD].forEach((type) => {
                (<any> this).emitEvent({ type: type });
            });

            this.run();
        }
    }


    public init() {
        this.loader = new BABYLON.AssetsManager(this);

        this.initMeshesLoader();
        this.initShadersLoader();

        this.player = new Entity('player', this);
        this.currentInput = this.player;

        this.skydome = new Skydome('skydome', this);
        (<any> this.skydome).position.z = 100;

        const ground = BABYLON.Mesh.CreateGround('ground', 5000, 5000, 250, this);
        ground.position.y = -10;
        ground.material = new BABYLON.StandardMaterial('ground', this);
        ground.material.wireframe = true;

        this.loader.load();
        this.meshesLoader.load();
        this.shadersLoader.load();
    }


    public run() {
        (<any> this).setActiveCameraByName(this.player.camera.name);
        this.player.camera.attachControl((<any> this).getEngine().getRenderingCanvas(), true);

        (<any> this).getEngine().runRenderLoop(() => {
            (<any> this).emitEvent({ type: EventType.RENDER });
            (<any> this).render();
        });
    }


    public static descendantName(parentName: string, name: string): string {
        return `${parentName}__${name}`;
    }


}
