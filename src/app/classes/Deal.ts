import {Turn} from './Turn';
import {TurnEnum} from './Enums';

export class Deal extends Turn {
    constructor(){
        super();
        this._type=TurnEnum.DEALER;
    }
}