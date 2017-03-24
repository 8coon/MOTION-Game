import {MotionScene} from './scenes/scene';


declare const BABYLON: any;


window.addEventListener('load', () => {
    const canvas = document.getElementById('render-canvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new MotionScene(engine);
});
