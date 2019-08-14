
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
  gameOver:boolean=false;
  autoplay:boolean=false;

  constructor(gameGUID:string='',private movesService:MovesService) {
      this.guid=gameGUID;
      this.name="New Game"; 
  }
  nextTurn(){
      let gameClone:Game=this.clone();
      this.movesService
  }
  toFaceNumber(card:number):number{
      let c:number;
      if(card>0){
          c=card%13;
          if(c==0){
              c=13;
          }
      }else{
          c=0;
      }
      return c;
  }
  clone():Game{
      let clone=JSON.parse(JSON.stringify(this));
      return clone;
  }
}