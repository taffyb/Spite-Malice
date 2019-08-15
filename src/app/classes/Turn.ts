import {Move} from './Move';
import { v4 as uuid } from 'uuid';

export class Turn {
  guid: string;
  moves: Move[]=[];

  constructor(){
      this.guid= uuid();
  }
}