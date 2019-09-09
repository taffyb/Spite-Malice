import {Turn} from './Turn';
import {TurnEnum} from './Enums';

export class Recycle extends Turn{
    constructor(){
        super();
        this._type=TurnEnum.RECYCLE;
    }
    
}