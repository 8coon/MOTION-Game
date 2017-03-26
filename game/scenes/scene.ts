import {INewable} from '../common/INewable';
import {Entity} from '../entity/entity';
import {IControllable} from '../entity/IControllable';
import {EventType} from '../common/EventType';


declare const BABYLON;
declare const JSWorks;


export class MotionScene extends (<INewable> BABYLON.Scene) {

    private player: Entity;
    private meshesCount: number = 0;
    private meshesLoaded: number = 0;
    private meshesError: boolean = false;
    private meshesHash: object = {};

    private loader;
    public currentInput: IControllable;


    constructor(engine) {
        super(engine);
        engine.enableOfflineSupport = false;

        JSWorks.EventManager.subscribe(this, this, EventType.JOYSTICK_MOVE,
            (event, emitter) => { this.onJoystickMove(event, emitter); });
    }


    public onJoystickMove(event, emitter) {
        this.currentInput.joystickMoved(event.data.x, event.data.y);
    }


    public init() {
        this.loader = new BABYLON.AssetsManager(this);

        this.player = new Entity('player', this);
        this.currentInput = this.player;

        this.loader.load();
    }


    public queueMesh(name, root, file) {
        if (this.meshesHash[name]) {
            return;
        }

        const task = this.loader.addMeshTask(name, '', root, file);
        this.meshesHash[name] = true;
        this.meshesCount++;

        task.onSuccess = (task) => {
            this.meshesLoaded++;
            this.meshesHash[name] = task.loadedMeshes[0];
            this.meshesHash[name].setEnabled(false);

            if ((this.meshesLoaded === this.meshesCount) && !this.meshesError) {
                (<any> this).emitEvent({ type: EventType.MESHES_LOAD });
                this.run();
            }
        };

        task.onError = (task) => {
            this.meshesError = true;
            this.meshesHash = {};
            this.meshesLoaded = 0;
            this.meshesCount = 0;

            (<any> this).emitEvent({ type: EventType.MESHES_FAIL });
        }
    }


    public run() {
        (<any> this).setActiveCameraByName(this.player.camera.name);
        this.player.camera.attachControl((<any> this).getEngine().getRenderingCanvas(), true);

        (<any> this).getEngine().runRenderLoop(() => {
            (<any> this).emitEvent({ type: EventType.RENDER });
            (<any> this).render();
        });
    }


    public getLoadedMesh(name: string) {
        return this.meshesHash[name];
    }


    public static descendantName(parentName: string, name: string): string {
        return `${parentName}__${name}`;
    }


}
