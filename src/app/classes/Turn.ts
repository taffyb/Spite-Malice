import {Move} from './Move';
import {TurnEnum} from './Enums';
import { v4 as uuid } from 'uuid';

export class Turn {
  protected _type:number=TurnEnum.PLAYER;
  private uuid: string;
  moves: Move[]=[];

  constructor(){
      this.uuid= uuid();
  }
  get type():number{
      return this._type;
  }
}