import {IControllable} from './IControllable';
import {INewable} from '../common/INewable';
import {MotionScene} from '../scenes/scene';
import {EventType} from '../common/EventType';


declare const BABYLON;
declare const JSWorks;


export class Entity extends (<INewable> BABYLON.Mesh) implements IControllable {

    private readonly modelName: 'spaceship';
    public ship: any;
    public camera: any;
    public light: any;
    public target: any;


    constructor(name: string, scene: MotionScene) {
        super(name, scene);

        scene.queueMesh(this.modelName, '/game/assets/models/', 'spaceship.obj');

        JSWorks.EventManager.subscribe(this, scene, EventType.MESHES_LOAD,
            (event, emitter) => { this.onMeshesLoaded(event, emitter); });
        JSWorks.EventManager.subscribe(this, scene, EventType.RENDER,
            (event, emitter) => { this.onRender(event, emitter); });
    }


    public onMeshesLoaded(event, emitter) {
        this.ship = (<any> this).getScene().getLoadedMesh(this.modelName);
        this.ship = this.ship.clone(MotionScene.descendantName((<any> this).name, 'ship'));
        this.ship.parent = this;
        this.ship.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.ship.rotation = new BABYLON.Vector3(3 * Math.PI / 2, Math.PI, 0);
        this.ship.position = new BABYLON.Vector3(0, 0, 0);
        this.ship.setEnabled(true);

        this.camera = new BABYLON.TargetCamera(
            MotionScene.descendantName((<any> this).name, 'ship'),
            new BABYLON.Vector3(0, 0, 0),
            (<any> this).getScene()
        );
        this.camera.parent = this;
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.position = new BABYLON.Vector3(0, 1, -5);

        this.target = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'ship'),
            0.1,
            (<any> this).getScene()
        );
        this.target.parent = this;
        this.target.position = new BABYLON.Vector3(0, 0, 5);

        this.light = new BABYLON.HemisphericLight(
            MotionScene.descendantName((<any> this).name, 'light'),
            new BABYLON.Vector3(0, 0, 0),
            (<any> this).getScene()
        );
        this.light.parent = this;
        this.light.intensity = 0.7;
    }


    public onRender(event, emitter) {
        //this.ship.rotation.y += 0.02;
    }


    public joystickMoved(x: number, y: number) {
        this.target.position.x +=  x * 0.01;
        this.target.position.y += -y * 0.01;
    }


}
