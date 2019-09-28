import { Injectable } from '@angular/core';
import {Move} from '../classes/Move';
import {Turn} from '../classes/Turn';
import {Deal} from '../classes/Deal';
import {SMUtils} from '../classes/SMUtils';
import {Recycle} from '../classes/Recycle';
import {IMoveSubscriber} from '../classes/IMoveSubscriber';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {TurnEnum} from '../classes/Enums';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  private turns:Turn[]=[];
  subscriber:IMoveSubscriber;
  

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
  }
  addTurn(turn:Turn){
//      console.log(`[move.service.addTurn]: ${JSON.stringify(turn)}`);
      this.turns.push(turn);
  }
  addMove(move:Move){
      if(this.turns.length===0){
//          console.log(`***No Turns***`);
          this.addTurn(new Turn());
      }          
      let currentTurn:Turn=this.turns[this.turns.length-1];
      switch(currentTurn.type){
      case TurnEnum.PLAYER:
          if(this.turns[this.turns.length-1].moves.length>0 &&
              this.turns[this.turns.length-1].moves[this.turns[this.turns.length-1].moves.length-1].isDiscard){
//               console.log(`***Last Turn is complete***`);
               this.addTurn(new Turn());
          }
          break;
      case TurnEnum.DEALER:
//          console.log(`***Last Turn was the dealer's turn***`);
          this.addTurn(new Turn());
          break;
      case TurnEnum.RECYCLE:
//          console.log(`***Last Turn was the recycler's turn***`);
          this.addTurn(new Turn());
          break;
      case TurnEnum.PLAYER_SWITCH:
//          console.log(`***Last Turn was a player switch***`);
          this.addTurn(new Turn());
          break;
      }
          
      this.turns[this.turns.length-1].moves.push(move);
      console.log(`[move.service.addMove]: ${SMUtils.moveToString(move)}`);
      this.publish(move);
  }
  
  subscribeToChanges(subscriber:IMoveSubscriber){
      this.subscriber=subscriber;
  }
  private publish(move:Move){
      this.subscriber.onNewMoves([move]);
      
  }
  private undoMove(move:Move):Move{
      let from=move.to;
      move.to=move.from;
      move.from=from; 
      move.isUndo=true;
      
      return move;
  }
  undo(){
//      console.log(`{moves.service.undo}`);
      let undoMoves:Move[]=[];
      if(this.turns && this.turns.length>0){          
          let currentTurn:Turn=this.turns[this.turns.length-1];
          switch(currentTurn.type){
          case TurnEnum.PLAYER:
              let m:Move= currentTurn.moves.pop();
              undoMoves.push(this.undoMove(m));
              console.log(`Undo Player{${m.puuid}} Move ${SMUtils.moveToString(m)}`);
              if(currentTurn.moves.length===0){
                  this.turns.pop();
              }
              break;
          case TurnEnum.DEALER:
              console.log(`Undo Dealer Turn`);
              for(let i:number=currentTurn.moves.length-1;i>0;i--){
                  let m:Move=currentTurn.moves[i];
                  undoMoves.push(this.undoMove(m));
              }              
              this.turns.pop();
              this.undo();
              break;
          case TurnEnum.RECYCLE:
              console.log(`Undo Recycle Turn`);
              for(let i:number=0;i<currentTurn.moves.length;i++){
                  let m:Move=currentTurn.moves[i];
                  if(!(SMUtils.toFaceNumber(m.card)===CardsEnum.KING)){
                      undoMoves.push(this.undoMove(m));
                  }                  
              }              
              this.turns.pop();
              this.undo();
              break;
          case TurnEnum.PLAYER_SWITCH:
              console.log(`Undo Player Switch`);
              this.subscriber.onUndoActivePlayer();
              this.turns.pop();
              this.undo();
              break;
          }
          
          this.subscriber.onUndo(undoMoves); 
      }else{
          console.log(`NOTHING TO UNDO!`);
      }          
  }
  saveTurn(){
      
  }
}
