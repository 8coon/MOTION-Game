import {IControllable} from './IControllable';
import {INewable} from '../common/INewable';
import {MotionScene} from '../scenes/scene';
import {EventType} from '../common/EventType';


declare const BABYLON;
declare const JSWorks;


export class Entity extends (<INewable> BABYLON.Mesh) implements IControllable {

    private readonly modelName: 'spaceship';
    public shipHolderX: any;
    public shipHolderZ: any;
    public ship: any;
    public camera: any;
    public light: any;
    public joystick: any;
    public target: any;

    public speed: number = 0.1;


    constructor(name: string, scene: MotionScene) {
        super(name, scene);

        scene.queueMesh(this.modelName, '/game/assets/models/', 'spaceship.obj');

        JSWorks.EventManager.subscribe(this, scene, EventType.MESHES_LOAD,
            (event, emitter) => { this.onMeshesLoaded(event, emitter); });
        JSWorks.EventManager.subscribe(this, scene, EventType.RENDER,
            (event, emitter) => { this.onRender(event, emitter); });
    }


    public onMeshesLoaded(event, emitter) {
        this.shipHolderZ = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'shipHolder'),
            0.1,
            (<any> this).getScene()
        );
        this.shipHolderZ.parent = this;
        this.shipHolderZ.isVisible = false;

        this.shipHolderX = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'shipHolder'),
            0.1,
            (<any> this).getScene()
        );
        this.shipHolderX.parent = this.shipHolderZ;
        this.shipHolderX.isVisible = false;

        this.ship = (<any> this).getScene().getLoadedMesh(this.modelName);
        this.ship = this.ship.clone(MotionScene.descendantName((<any> this).name, 'ship'));
        this.ship.parent = this.shipHolderX;
        this.ship.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.ship.rotation = new BABYLON.Vector3(3 * Math.PI / 2, 0, Math.PI);
        this.ship.setEnabled(true);

        this.camera = new BABYLON.TargetCamera(
            MotionScene.descendantName((<any> this).name, 'ship'),
            new BABYLON.Vector3(0, 0, 0),
            (<any> this).getScene()
        );
        this.camera.parent = this;
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.position = new BABYLON.Vector3(0, 1, -5);
        this.camera.noRotationConstraint = true;

        this.joystick = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'ship'),
            0.1,
            (<any> this).getScene()
        );
        this.joystick.parent = this;
        this.joystick.position = new BABYLON.Vector3(0, 0, 5);

        this.target = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'ship'),
            0.1,
            (<any> this).getScene()
        );
        this.target.parent = this.shipHolderX;
        this.target.position = new BABYLON.Vector3(0, 0, 5);

        this.light = new BABYLON.HemisphericLight(
            MotionScene.descendantName((<any> this).name, 'light'),
            new BABYLON.Vector3(0, 0, 0),
            (<any> this).getScene()
        );
        this.light.parent = this;
        this.light.intensity = 0.7;
    }


    public static slowMo(prev: number, value: number, power: number = 50) {
        return (power * prev + value) / (power + 1);
    }


    private static getTranslationMatrix(node) {
        return BABYLON.Matrix.Compose(
            node.scaling,
            BABYLON.Quaternion.RotationYawPitchRoll(
                node.rotation.y,
                node.rotation.x,
                node.rotation.z,
            ),
            node.position,
        );
    }


    private calculateMovement(modifier: number = 1) {
        const xMatrix = Entity.getTranslationMatrix(this.shipHolderX);
        const zMatrix = Entity.getTranslationMatrix(this.shipHolderZ);

        let direction = new BABYLON.Vector3(0, 0, modifier * this.speed);
        direction = BABYLON.Vector3.TransformCoordinates(direction, xMatrix);
        direction = BABYLON.Vector3.TransformCoordinates(direction, zMatrix);

        (<any> this).position.x += direction.x;// * this.speed;
        (<any> this).position.y += direction.y;// * this.speed;
        (<any> this).position.z += direction.z;// * this.speed;
    }


    public onRender(event, emitter) {
        const cosAngleY = this.joystick.position.y / this.joystick.position.z;
        let cosAngleX = this.joystick.position.x / this.joystick.position.z;
        cosAngleX *= 1.1;

        this.shipHolderX.rotation.x = Entity.slowMo(this.shipHolderX.rotation.x, Math.PI / 2 - Math.acos(-cosAngleY));
        this.shipHolderZ.rotation.z = Entity.slowMo(this.shipHolderZ.rotation.z, -Math.PI / 2 + Math.acos(cosAngleX));

        this.calculateMovement(2);
    }


    public static limitTarget(vector, distX, distY) {
        if (vector.x < -distX) vector.x = -distX;
        if (vector.y < -distY) vector.y = -distY;
        if (vector.x >  distX) vector.x =  distX;
        if (vector.y >  distY) vector.y =  distY;
    }


    public joystickMoved(x: number, y: number) {
        this.joystick.position.x +=  x * 0.01;
        this.joystick.position.y += -y * 0.01;

        Entity.limitTarget(this.joystick.position, 4.5, 3.5);
    }


}
