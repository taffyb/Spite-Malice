import { Injectable } from '@angular/core';
import {Move} from '../classes/Move';
import {Turn} from '../classes/Turn';
import {Deal} from '../classes/Deal';
import {Recycle} from '../classes/Recycle';
import {Game} from '../classes/Game';
import {IMoveSubscriber} from '../classes/IMoveSubscriber';
import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {MoveScoresEnum} from '../classes/StocasticEnum';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  turns:Turn[]=[];
  subscriber:any;
  

  constructor() { }
  
  addRecycle(stack:number[],pos:number){
      let recycle:Turn = new Recycle();
      let move:Move;
      stack.forEach(c=>{
          move=new Move();
          move.from=pos;
          move.card=c;
          move.to=GamePositionsEnum.RECYCLE_PILE;
          recycle.moves.push(move);
      });
      this.turns.push(recycle);
      this.turns.push(new Turn());
  }
  addTurn(turn:Turn){
      this.turns.push(turn);
  }
  addMove(move:Move){
      if(this.turns.length==0){
          this.turns.push(new Turn());
      }
      this.turns[this.turns.length-1].moves.push(move);
      if(move.isDiscard){
//          console.log(`Turn: ${JSON.stringify(this.turns[this.turns.length-1])}`);
          this.turns.push(new Turn());
      }
      this.publish(move);
  }
  
  subscribeToChanges(subscriber:IMoveSubscriber){
      this.subscriber=subscriber;
  }
  private publish(move:Move){
      this.subscriber.onNewMoves([move]);
      
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
  private undoMove(move:Move):Move{
      let from=move.to;
      move.to=move.from;
      move.from=from; 
      
      return move;
  }
  undo(){
//      console.log(`Turns: ${this.turns.length}\n${JSON.stringify(this.turns)}`);
      let undoMoves:Move[]=[];
      if(this.turns.length>0){
          this.turns.forEach((t,i)=>{
             if(t instanceof Deal){
//                 console.log(`Undo [${i}] Deal ${t.moves.length} cards`);
             }else if(t instanceof Recycle){
//                 console.log(`Undo [${i}] Recycle`);                 
             }else{
//                 console.log(`Undo [${i}] Turn ${t.moves.length} cards`);                 
             }
          });
          let currentTurn:Turn=this.turns[this.turns.length-1];
          while(currentTurn.moves.length==0){              
              this.turns.pop();
              currentTurn=this.turns[this.turns.length-1];
          }
          if(currentTurn instanceof Deal){
              for(let i:number=currentTurn.moves.length-1;i>0;i--){
                  let m:Move=currentTurn.moves[i];
                  undoMoves.push(this.undoMove(m));
              }              
              this.turns.pop();
//              this.subscriber.onUndoActivePlayer();
              currentTurn=this.turns[this.turns.length-1];
          } 
          if(currentTurn instanceof Recycle){
              //remove the top of the stack because that will be undone when the top card is moved back to the player
              currentTurn.moves.pop();
              for(let i:number=0;i<currentTurn.moves.length;i++){
                  let m:Move=currentTurn.moves[i];
                  undoMoves.push(this.undoMove(m));
              }              
              this.turns.pop();
              currentTurn=this.turns[this.turns.length-1];              
          }
          if(currentTurn.moves.length==0){
              this.turns.pop();
              if(this.turns.length>0){
                  currentTurn=this.turns[this.turns.length-1];
              }
          }         
          if(currentTurn && currentTurn.moves.length>0){
              let move:Move=currentTurn.moves.pop();
              undoMoves.push(this.undoMove(move));
              console.log(`[moves.service] move:${JSON.stringify(move)}`);
              if(move.isDiscard){
                  console.log(`[moves.service] call onUndoActivePlayer()`);
                  this.subscriber.onUndoActivePlayer();
              }
          }
          this.subscriber.onUndo(undoMoves);  
      }           
  }
}