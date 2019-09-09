import {Turn} from './Turn';
import {TurnEnum} from './Enums';

export class PlayerSwitch extends Turn {
    constructor(){
        super();
        this._type=TurnEnum.PLAYER_SWITCH;
    }
}