import {Move} from './Move';
import {Game} from './Game';

export interface IAutoplay{
    findNextMove(game:Game):Move;
}
