import {Component, OnInit, NgZone } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';

import {Player} from '../classes/Player';
import {AutoPlayer} from '../classes/AutoPlayer';
import {IAutoplay} from '../classes/IAutoplay';
import {DeterministicPlayer} from '../classes/DeterministicPlayer';
import {Move} from '../classes/Move';
import {Turn} from '../classes/Turn';
import {IMoveSubscriber} from '../classes/IMoveSubscriber';

import {DealerService} from '../services/dealer.service';
import {MovesService} from '../services/moves.service';
import {GameService} from '../services/game.service';

import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {Game} from '../classes/Game';
import {SMUtils} from '../classes/SMUtils';


@Component({
  selector: 'play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css']
})
export class PlayAreaComponent implements OnInit, IMoveSubscriber {
  PlayerPositions=PlayerPositionsEnum;
  GamePositions=GamePositionsEnum;
  Cards=CardsEnum;
  isFullAuto:boolean=false;
    
  playerStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];
  isPendingDiscard:boolean=false;
  game:Game;
  fromPosition:number=PlayerPositionsEnum.NO_POS;
  toPosition:number=PlayerPositionsEnum.NO_POS;


  constructor(private router: Router,
              private route: ActivatedRoute, 
              private moveSvc:MovesService,
              private gameSvc:GameService,
              public dealer:DealerService,
              public zone: NgZone) {
       route.params.subscribe(val => {
           const gameId = route.snapshot.paramMap.get('gameId');
           if(!gameId || gameId=="new"){
               this.game=this.gameSvc.newGame();
               dealer.fillDeck();
               dealer.deal(this.game.players);
               // set active player
               if(SMUtils.toFaceNumber(this.game.players[0].viewCard(PlayerPositionsEnum.PILE)) 
                  >  
                   SMUtils.toFaceNumber(this.game.players[1].viewCard(PlayerPositionsEnum.PILE))){
                   
                   this.game.activePlayer=1;
               }
               router.navigateByUrl(`/play-area/${this.game.guid}`);
           }else{
               this.game=this.gameSvc.getGame(gameId);
               dealer.setGameDeck(this.game);
           }     
           this.moveSvc.subscribeToChanges(this);
       });
  }
  isPlayerAutoplay(pIdx):boolean{
      let player:Player=this.game.players[pIdx];
      let retVal:boolean=false;
  
      if(player instanceof AutoPlayer){
          retVal=true;
      }
      return retVal;
  }
  ngOnInit() {
  }
  viewTopOfStack(stack:number):number{          
      return this.game.viewTopOfStack(stack);
  }
  toFaceNumber(card:number):number{
      return SMUtils.toFaceNumber(card);
  }
  private setActivePlayer(playerId){
      this.game.activePlayer=playerId;  
      let player:Player=this.game.players[playerId];
      if((player instanceof AutoPlayer) && this.isFullAuto){
          let move:Move = player.findNextMove(this.game);
          this.onNewMoves([move]);
          while(!move.isDiscard){
              move = player.findNextMove(this.game);
              this.onNewMoves([move]);
          }
      }
  }
  nextMove(){
      let player:Player=this.game.players[this.game.activePlayer];
      if((player instanceof AutoPlayer)){
          let move:Move = player.findNextMove(this.game);
          this.onNewMoves([move]);
      }   
  }
  toggleActivePlayer(){
      let ap:number=this.game.activePlayer;
      ap++;
      if(ap>=this.game.players.length){
          ap=0;
      }
      this.setActivePlayer(ap);
  }
  toggleMoveFrom(player:number,position:number){
      if(player == this.game.activePlayer){
          if(position==this.fromPosition){
              this.zone.run(() => this.fromPosition =-1);
          }else{
              this.zone.run(() => this.fromPosition =position);
          }          
      }
  }
  toggleTarget(position:number){
      if(!this.isPendingDiscard ||
         (position<PlayerPositionsEnum.STACK_1) ||
         this.game.players[this.game.activePlayer].cards[position].length<=1){         
          this.zone.run(() => this.toPosition =position);
      }
  }
  moveTo(stack:number){
      let move:Move = new Move();
      move.player= this.game.players[this.game.activePlayer].guid;
      let sCount:number=0;
      move.from = this.fromPosition;
      const from:number=this.fromPosition;
      let cardToMove:number;
      if(from>=PlayerPositionsEnum.STACK_1 && from<=PlayerPositionsEnum.STACK_4){
          let topOfPlayerStack:number= this.game.players[this.game.activePlayer].cards[from].length-1;
          cardToMove=this.game.players[this.game.activePlayer].cards[from][topOfPlayerStack];
      }else{
          cardToMove= this.game.players[this.game.activePlayer].viewCard(from);
      }
      move.card =cardToMove;
      move.to = stack;
      
//    If moving to a Player Stack is this a discard?
//    All stacks must have at least 1 card before it can be considered a discard
      if(move.to>=PlayerPositionsEnum['STACK_1'] && move.to<=PlayerPositionsEnum.STACK_4){
          for(let i=PlayerPositionsEnum['STACK_1'];i<=PlayerPositionsEnum.STACK_4;i++){
//              count player stacks with at least one card
              if(this.game.players[this.game.activePlayer].viewCard(i)>0 || i==stack){sCount++;}
          }
//          does the target stack already have a card on it?
          if(this.game.players[this.game.activePlayer].viewCard(stack)>0 ){
              this.isPendingDiscard=true;
          }
      }
      
      if(this.isPendingDiscard && sCount==4){
         move.isDiscard=true;
         this.isPendingDiscard=false;
      }
      this.moveSvc.addMove(move);
      this.fromPosition=-1;
      this.toPosition=-1;
  }
  canMoveHere(toPosition:number){
      let canMove:boolean=false;
      const fromPosition:number=this.fromPosition;
      const centreStack1:number=GamePositionsEnum.BASE+GamePositionsEnum.STACK_1;
      const centreStack4:number=GamePositionsEnum.BASE+GamePositionsEnum.STACK_4;
  
      if(fromPosition>-1){
          
          let cardToMove:number;
          if(fromPosition>=PlayerPositionsEnum.STACK_1 && fromPosition<=PlayerPositionsEnum.STACK_4){
              let topOfPlayerStack:number= this.game.players[this.game.activePlayer].cards[fromPosition].length-1;
              cardToMove=this.toFaceNumber(this.game.players[this.game.activePlayer].cards[fromPosition][topOfPlayerStack]);
          }else{
              cardToMove= this.toFaceNumber(this.game.players[this.game.activePlayer].viewCard(fromPosition));
          }
          
          if(toPosition>=centreStack1 && toPosition<=centreStack4){
             if(cardToMove==CardsEnum.JOKER){
                 canMove=true;
             }else{
                 let centreCard:number=this.toFaceNumber(this.viewTopOfStack(toPosition-GamePositionsEnum.BASE));
                 if(cardToMove==(centreCard<CardsEnum.KING?centreCard+1:1)) {
                      canMove=true;
                 }     
             }
          }
      }
      return canMove;
  }
  onUndoActivePlayer(){
      console.log(`[play-area] activePlayer: ${this.game.activePlayer}`); 
      let previousPlayer = (this.game.activePlayer-1>=0?this.game.activePlayer-1:this.game.players.length-1);
      console.log(`[play-area] previousPlayer: ${previousPlayer}`); 
      this.zone.run(() => this.setActivePlayer(previousPlayer));
  }
  onUndo(moves:Move[]){
      let player:Player;
      moves.forEach(m=>{   
          //determine the player who made the move
          this.game.players.forEach(p=>{
             if(p.guid==m.player){
                 player=p;
             }
          });
          
          //If it is from a center stack
//          console.log(`${JSON.stringify(m)}`);
          if(m.from>GamePositionsEnum.BASE){
             if(m.from==GamePositionsEnum.RECYCLE_PILE){
                 this.game.recyclePile.pop();
                 this.game.centreStacks[m.to-GamePositionsEnum.BASE].push(m.card);
                 
             }else{
                 this.game.centreStacks[m.from-GamePositionsEnum.BASE].pop();
             }
             
          }
          
          //If it is from a Player stack
          if(m.from>=PlayerPositionsEnum.STACK_1 && m.from<=PlayerPositionsEnum.STACK_4){
              player.cards[m.from].pop();
          }
          
          //If it it is going back to the deck
          if(m.to==GamePositionsEnum.DECK){
              this.dealer.returnCard(m.card);
          }else if(m.to>PlayerPositionsEnum.STACK_4){
              this.game.centreStacks[m.to-GamePositionsEnum.BASE].push(m.card);
          }else{
              player.addCard(m.card,m.to);    
          }          
      });
  }
  onNewMoves(moves:Move[]){
      moves.forEach(m=>{   
          let nextPlayer = (this.game.activePlayer+1<this.game.players.length?this.game.activePlayer+1:0);
     
          this.game.players[this.game.activePlayer].removeCard(m.from);
          if(m.to<=PlayerPositionsEnum['STACK_4']){
              this.game.players[this.game.activePlayer].addCard(m.card,m.to);
          }else{
    //          console.log(`m.to:${m.to} GamePositionsEnum.BASE:${GamePositionsEnum.BASE}`);
              this.game.centreStacks[m.to-GamePositionsEnum.BASE].push(m.card);
          }
          if(m.isDiscard){
    //          console.log(`Discard: ${JSON.stringify(moves)}`);
              let deal:Turn;
              deal=this.dealer.fillHand(this.game.players[nextPlayer],this.game);
              this.moveSvc.addTurn(deal);
              this.zone.run(() => this.setActivePlayer(nextPlayer)); 
              this.game.nextTurn();
          }else{
    //          console.log(`Move: ${JSON.stringify(moves)}`);
              this.zone.run(() => null);
          }
          if(this.game.players[this.game.activePlayer].cardsInHand()==0){
              this.zone.run(() => this.dealer.fillHand(this.game.players[this.game.activePlayer],this.game));
          }
//          console.log(`m.to=${m.to} card=${this.toFaceNumber(this.viewTopOfStack(m.to-GamePositionsEnum.BASE))}`);
          if(m.to>=GamePositionsEnum.BASE+GamePositionsEnum.STACK_1 && 
                  (this.toFaceNumber(this.viewTopOfStack(m.to-GamePositionsEnum.BASE))==CardsEnum.KING)){
              let stack:number[]= this.game.centreStacks[m.to-GamePositionsEnum.BASE];
//              console.log(`Recycle centre stack: ${m.to} ${JSON.stringify(this.game.centreStacks[m.to-GamePositionsEnum.BASE])}`);
              this.moveSvc.addRecycle(stack,m.to);
              this.dealer.addToRecyclePile(stack,this.game);
              this.game.centreStacks[m.to-GamePositionsEnum.BASE]=[CardsEnum.NO_CARD]
          }
          if(m.from==PlayerPositionsEnum.PILE && this.game.players[this.game.activePlayer].viewCard(m.from)==CardsEnum.NO_CARD){
    //        Game Over
              this.game.gameOver=this.game.players[this.game.activePlayer].name + " won!.";
          }
      });
  }
  saveGame(){
      console.log(`Game:${JSON.stringify(this.game)}`);
  }
  undo(){
      this.moveSvc.undo();
  }
}
