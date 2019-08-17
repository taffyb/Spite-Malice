import {Turn} from './Turn';
import {TurnEnum} from './Enums';

export class Recycle extends Turn{
    constructor(){
        super();
        this.type=TurnEnum.RECYCLE;
    }
    
}