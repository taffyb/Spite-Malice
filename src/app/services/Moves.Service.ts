import { Injectable } from '@angular/core';
import {Move} from '../classes/Move';
import {Game} from '../classes/Game';
import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {MoveScoresEnum} from '../classes/Enums';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  moves:Move[]=[];
  subscriber:any;
  

  constructor() { }
  
  addMove(move:Move){
      this.moves.push(move);
      this.publish();
  }
  
  subscribeToChanges(subscriber:any){
      this.subscriber=subscriber;
  }
  publish(){
      this.subscriber.onNewMoves(this.moves);
      this.moves=[];
  }
  findNextMove(game:Game):Move{
      let m = new Move();
      
      //Check if can move off PILE
      const topOfPile:number=game.players[game.activePlayer].viewCard(PlayerPositionsEnum.PILE);
      let topOfStack:number;
      for(let i:number=0;i<game.centreStacks.length;i++){
          topOfStack=game.centreStacks[i][topOfStack=game.centreStacks[i].length-1];
          if(topOfPile==topOfStack+1){
              m.from=PlayerPositionsEnum.PILE;
              m.card=topOfStack;
              m.to=GamePositionsEnum.BASE+i;
              break;
          }
      }
            
      return m;
  }
  isValidMove(m:Move,game:Game):number{
      let score:MoveScoresEnum;
      
      return score;
  }
}
