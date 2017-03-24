import {IPlayer} from './IPlayer';
import {INewable} from '../common/INewable';


declare const BABYLON;


export class Player extends (<INewable> BABYLON.Node) implements IPlayer {


    constructor(name: string, scene) {
        super(name, scene);

        console.log('Player created!');
    }


    public get login(): string {
        return 'mrHuman';
    }


}
