import { v4 as uuid } from 'uuid';

import {PlayerPositionsEnum} from './Enums';
import {CardsEnum} from './Enums';
import {Player} from './Player';

import {DealerService} from '../services/Dealer.Service';
import {MovesService} from '../services/Moves.Service';

export class Game {
  guid: string;
  name: string;
  players:Player[]=[]; 
  centreStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];
  activePlayer:number=0;
  inPlay:boolean=false;
  recyclePile:number[]=[];
  gameOver:string="";
  includeJokers:number=4; //maximum 4 (per deck)

  constructor() {
      this.guid=uuid();
      this.name="New Game"; 
  }
  nextTurn(){
      let gameClone:Game=this.clone();
  }
  clone():Game{
      let clone=JSON.parse(JSON.stringify(this));
      return clone;
  }
}