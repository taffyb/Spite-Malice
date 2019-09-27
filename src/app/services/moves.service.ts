import { Injectable } from '@angular/core';
import {Move} from '../classes/Move';
import {Turn} from '../classes/Turn';
import {Deal} from '../classes/Deal';
import {SMUtils} from '../classes/SMUtils';
import {Recycle} from '../classes/Recycle';
import {IMoveSubscriber} from '../classes/IMoveSubscriber';
import {GamePositionsEnum} from '../classes/Enums';
import {TurnEnum} from '../classes/Enums';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  private turns:Turn[]=[];
  subscribers:IMoveSubscriber[];
  

  constructor() { }
  
  addRecycle(stack:number[],pos:number){
      let recycling:Turn = new Recycle();
      let move:Move;
      stack.forEach(c=>{
          move=new Move();
          move.from=pos;
          move.card=c;
          move.to=GamePositionsEnum.RECYCLE_PILE;
          recycling.moves.push(move);
      });
      this.addTurn(recycling);
      this.turns.push(new Turn());
  }
  addTurn(turn:Turn){
      this.turns.push(turn);
  }
  addMove(move:Move){
      if(this.turns.length==0){
          this.addTurn(new Turn());
      }
      this.turns[this.turns.length-1].moves.push(move);
      if(move.isDiscard){
//          console.log(`Turn: ${JSON.stringify(this.turns[this.turns.length-1])}`);
          this.addTurn(new Turn());
      }
     console.log(`move: ${SMUtils.moveToString(move)}`);
      this.publish(move);
  }
  
  subscribeToChanges(subscriber:IMoveSubscriber){
      this.subscribers.push(subscriber);
  }
  private publish(move:Move){
      this.subscribers.forEach(s=>{s.onNewMoves([move]);});
      
  }
  private undoMove(move:Move):Move{
      let from=move.to;
      move.to=move.from;
      move.from=from; 
      
      return move;
  }
  undo(){
      console.log(`{moves.service.undo} Turns: ${this.turns.length}\n${JSON.stringify(this.turns)}`);
      let undoMoves:Move[]=[];
      if(this.turns && this.turns.length>0){          
          let currentTurn:Turn=this.turns[this.turns.length-1];
          switch(currentTurn.type){
          case TurnEnum.PLAYER:
              break;
          case TurnEnum.DEALER:
              break;
          case TurnEnum.RECYCLE:
              break;
          case TurnEnum.PLAYER_SWITCH:
              break;
          }
          if(this.turns[this.turns.length-1].moves.length>0){
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
                  console.log(`[moves.service.undo] move:${JSON.stringify(move)}`);
                  if(move.isDiscard){
                      console.log(`[moves.service.undo] call onUndoActivePlayer()`);
                      this.subscribers.forEach(s=>{s.onUndoActivePlayer();});
                  }
              }
              
          }
          
          this.subscribers.forEach(s=>{s.onUndo(undoMoves);});  
      }           
  }
  saveTurn(){
      
  }
}
