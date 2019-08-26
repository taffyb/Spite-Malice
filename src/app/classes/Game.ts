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
  static fromJSON(json:string):Game{
      let game = new Game();
      let jsonGame=JSON.parse(json);
      
      game.guid = jsonGame.guid;
      game.name = jsonGame.name;
      jsonGame.players.forEach(p=>{game.players.push(Player.fromJSON(JSON.stringify(p)));});
      game.centreStacks= jsonGame.centreStacks;
      game.activePlayer=jsonGame.activePlayer;
      game.inPlay=jsonGame.inPlay;
      game.recyclePile=jsonGame.recyclePile;
      game.includeJokers=jsonGame.includeJokers;
      return game;
  }
  viewTopOfStack(stack:number):number{
      let centreStack:number[]= this.centreStacks[stack];
      let tos:number= centreStack[centreStack.length-1];
      let j=0;
      while(tos>CardsEnum.DECK){
          j++;
          //its a joker
          tos=centreStack[centreStack.length-(1+j)]+j;
      }      
      return tos;
  }
}