import {Player} from './Player';
import {IAutoplay} from './IAutoplay';
import {Move} from './Move';
import {Game} from './Game';

export abstract class AutoPlayer extends Player implements IAutoplay{
    
    constructor(){
        super();
    }
    abstract findNextMove(game:Game):Move;
}