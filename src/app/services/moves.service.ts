import { Injectable } from '@angular/core';
import {Move} from '../classes/Move';
import {Turn} from '../classes/Turn';
import {Deal} from '../classes/Deal';
import {PlayerSwitch} from '../classes/PlayerSwitch';
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
  private moves:{type:number,move:Move}[]=[];
  subscriber:IMoveSubscriber;
  

  constructor() { }
  
  addRecycle(stack:number[],pos:number){
      let moves:Move[] = [];
      
      let move:Move;
      stack.forEach(c=>{
          move=new Move();
          move.from=pos;
          move.card=c;
          move.to=GamePositionsEnum.RECYCLE_PILE;
          moves.push(move);
          this.moves.push({type:TurnEnum.RECYCLE,move:move});
          console.log(`[move.service.addRecycle ${TurnEnum[TurnEnum.RECYCLE]}]: ${SMUtils.moveToString(move)} `);
      });     
  }
  addTurn(turn:Turn){
//      console.log(`[move.service.addTurn]: ${JSON.stringify(turn)}`);
      this.turns.push(turn);
  }
  addMove(move:Move,type:number){
      this.moves.push({type:type,move:move});
//      if(this.turns.length===0){
////          console.log(`***No Turns***`);
//          this.addTurn(new Turn());
//      }          
//      let currentTurn:Turn=this.turns[this.turns.length-1];
//      switch(currentTurn.type){
//      case TurnEnum.PLAYER:
//          if(this.turns[this.turns.length-1].moves.length>0 &&
//              this.turns[this.turns.length-1].moves[this.turns[this.turns.length-1].moves.length-1].isDiscard){
//               console.log(`***Last Turn is complete***`);
//               this.addTurn(new Turn());
//          }
//          break;
//      case TurnEnum.DEALER:
//          console.log(`***Last Turn was the dealer's turn***`);
//          this.addTurn(new Deal());
//          break;
//      case TurnEnum.RECYCLE:
//          console.log(`***Last Turn was the recycler's turn***`);
//          this.addTurn(new Recycle());
//          break;
//      case TurnEnum.PLAYER_SWITCH:
//          console.log(`***Last Turn was a player switch***`);
//          this.addTurn(new PlayerSwitch());
//          break;
//      }
//          
//      this.turns[this.turns.length-1].moves.push(move);
      console.log(`[move.service.addMove ${TurnEnum[type]}]: ${type==TurnEnum.PLAYER_SWITCH?'':SMUtils.moveToString(move)} `);
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
      let undoMoves:Move[]=[];
      let m:{type:number,move:Move};
      let undoMove:Move;
      let moveType:number=-1;
      if(this.moves && this.moves.length==0){
          console.log(`NOTHING TO UNDO!`);
      }else{ 
          while(this.moves && this.moves.length>0){
              switch(this.moves.slice(-1)[0].type){
              case TurnEnum.PLAYER:
                  m=this.moves.pop();
                  undoMove=this.undoMove(m.move);
                  console.log(`moves.service.undo ${TurnEnum[TurnEnum.PLAYER]} ${SMUtils.moveToString(undoMove)}`);
                  undoMoves.push(undoMove);
                  moveType=TurnEnum.PLAYER;
                  break;
              case TurnEnum.DEALER:
//                  console.log(`{moves.service.undo ${TurnEnum[TurnEnum.DEALER]}}`);
                  while(this.moves.slice(-1)[0].type == TurnEnum.DEALER){
                      m=this.moves.pop();
                      undoMove=this.undoMove(m.move);
                      console.log(`moves.service.undo ${TurnEnum[TurnEnum.DEALER]} ${SMUtils.moveToString(undoMove)}`);
                      undoMoves.push(undoMove);
                  }
                  moveType=TurnEnum.DEALER;
                  break;
              case TurnEnum.RECYCLE:                  
                  let recycleMoves:{type:number,move:Move}[]=[];
                  while(this.moves.slice(-1)[0].type==TurnEnum.RECYCLE){
                      recycleMoves.push(this.moves.pop());
                  }
                  for(let i:number=recycleMoves.length-1;i>=0;i--){
                      m=recycleMoves[i];
                      if(i>0){
                          undoMove=this.undoMove(m.move)
                          console.log(`moves.service.undo ${TurnEnum[TurnEnum.RECYCLE]} ${SMUtils.moveToString(undoMove)}`);
                          undoMoves.push(undoMove);
                      }
                  }          
                  moveType=TurnEnum.RECYCLE;
                  break;
              case TurnEnum.PLAYER_SWITCH:
                  this.moves.pop();
                  console.log(`moves.service.undo ${TurnEnum[TurnEnum.PLAYER_SWITCH]} `);
                  undoMoves.push(new Move());
                  moveType=TurnEnum.PLAYER_SWITCH;
                  break;
              }
              if(moveType==TurnEnum.PLAYER){
                  break;
              }
          }          
          this.subscriber.onUndo(undoMoves); 
      }               
  }
  saveTurn(){
      
  }
}
