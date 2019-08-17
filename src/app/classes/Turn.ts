import {Move} from './Move';
import {TurnEnum} from './Enums';
import { v4 as uuid } from 'uuid';

export class Turn {
  protected type:number=TurnEnum.PLAYER;
  private guid: string;
  moves: Move[]=[];

  constructor(){
      this.guid= uuid();
  }
}