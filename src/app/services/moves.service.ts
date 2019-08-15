import { Injectable } from '@angular/core';
import {Move} from '../classes/Move';
import {Turn} from '../classes/Turn';
import {Game} from '../classes/Game';
import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {MoveScoresEnum} from '../classes/Enums';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  turns:Turn[]=[new Turn()];
  subscriber:any;
  

  constructor() { }
  
  addMove(move:Move){
      this.turns[this.turns.length-1].moves.push(move);
      if(move.isDiscard){
          console.log(`Turn: ${JSON.stringify(this.turns[this.turns.length-1])}`);
          this.turns.push(new Turn());
      }
      this.publish(move);
  }
  
  subscribeToChanges(subscriber:any){
      this.subscriber=subscriber;
  }
  publish(move:Move){
      this.subscriber.onNewMoves(move);
      
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
