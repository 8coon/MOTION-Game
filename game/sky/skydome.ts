import {INewable} from '../common/INewable';
import {MotionScene} from '../scenes/scene';
import {EventType} from "../common/EventType";


declare const BABYLON;
declare const JSWorks;


export class Skydome extends (<INewable> BABYLON.Mesh) {

    private cube: any;


    constructor(name: string, scene: MotionScene) {
        super(name, scene);

        this.cube = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'cube'),
            10,
            (<any> this).getScene()
        );
        this.cube.parent = this;

        scene.shadersLoader.queue('spaceFragmentShader', '/game/assets/shaders/', 'space.fragment.glsl');
        scene.shadersLoader.queue('spaceVertexShader', '/game/assets/shaders/', 'space.vertex.glsl');

        JSWorks.EventManager.subscribe(this, scene, EventType.SHADERS_LOAD,
            (event, emitter) => { this.onShadersLoaded(event, emitter); });
    }


    public onShadersLoaded(event, emitter) {
        const shaderMaterial = new BABYLON.ShaderMaterial('space', (<any> this).getScene(), {
            fragment: 'space',
            vertex: 'space',
        }, {
            attributes: [
                'time',
            ],
            uniforms: [
            ],
        });

        this.cube.material = shaderMaterial;
        this.cube.material.setTexture('textureSampler', new BABYLON.Texture('/game/assets/textures/huge.png',
            (<any> this).getScene()));
        this.cube.setEnabled(true);
    }

}