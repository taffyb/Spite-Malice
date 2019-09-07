import { v4 as uuid } from 'uuid';

import {PlayerPositionsEnum} from './Enums';
import {GamePositionsEnum} from './Enums';
import {CardsEnum} from './Enums';
import {Player} from './Player';
import {Move} from './Move';
import {SMUtils} from './SMUtils';

import {DealerService} from '../services/Dealer.Service';
import {MovesService} from '../services/Moves.Service';

export class Game {
  id:number=0;
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
      
//      console.log(`Game.fromJSON: ${json}`);
      game.guid = jsonGame.guid;
      game.name = jsonGame.name;
      jsonGame.players.forEach(p=>{game.players.push(Player.fromJSON(JSON.stringify(p)));});
      game.centreStacks= jsonGame.centreStacks;
      game.activePlayer=jsonGame.activePlayer;
      game.inPlay=jsonGame.inPlay;
      game.recyclePile=jsonGame.recyclePile;
      game.includeJokers=jsonGame.includeJokers;
      game.id=jsonGame.id+1;
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
  applyMove(move:Move){
      let activePlayer:Player=this.players[this.activePlayer];
      //remove card FROM
      activePlayer.removeCard(move.from);
      
      //add card TO
      if(move.to>PlayerPositionsEnum.STACK_4){
          this.centreStacks[move.to-GamePositionsEnum.BASE].push(move.card);
          //if this fills the stack then recycle it.
          if(this.viewTopOfStack(move.to-GamePositionsEnum.BASE)==CardsEnum.KING){              
              this.addToRecyclePile(this.centreStacks[move.to-GamePositionsEnum.BASE], this);
          }              
      }else{
          activePlayer.addCard(move.card,move.to);
      }
  }

  addToRecyclePile(cards:number[],game:Game){
      for(let c=0;c<cards.length-1;c++){
          game.recyclePile.push(cards[c]);
      }
  }
}