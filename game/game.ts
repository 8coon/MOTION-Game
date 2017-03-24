import {MotionScene} from './scenes/default';

// ln -s ./../node_modules/babylonjs/babylon.js ./release/babylon.js
declare const BABYLON: any;


window.addEventListener('load', () => {
    const canvas = document.getElementById('render-canvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new MotionScene(engine);
});
