import {Component, OnInit, NgZone  } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';

import {Player} from '../classes/Player';
import {Move} from '../classes/Move';

import {DealerService} from '../services/Dealer.Service';
import {MovesService} from '../services/Moves.Service';
import {GameService} from '../services/Game.Service';

import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {Game} from '../classes/Game';


@Component({
  selector: 'play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css']
})
export class PlayAreaComponent implements OnInit {
  PlayerPositions=PlayerPositionsEnum;
  GamePositions=GamePositionsEnum;
  Cards=CardsEnum;
    
  playerStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];
  isPendingDiscard:boolean=false;
  game:Game;
  fromPosition:number=-1 /*
                          0 = Pile
                          1 = Hand 1
                          2 = Hand 2
                          3 = Hand 3
                          4 = Hand 4
                          5 = Hand 5
                          6 = Stack 1
                          7 = Stack 2
                          8 = Stack 3
                          9 = Stack 4
                       */
   toPosition:number=-1 /*
                          6 = Stack 1
                          7 = Stack 2
                          8 = Stack 3
                          9 = Stack 4
                          10 = Centre Stack 1
                          11 = Centre Stack 2
                          12 = Centre Stack 3
                          13 = Centre Stack 4
                        */


  constructor(private router: Router,
              private route: ActivatedRoute, 
              private dealer:DealerService,
              private moveSvc:MovesService,
              private gameSvc:GameService,
              public zone: NgZone) {
       route.params.subscribe(val => {

           const gameId = route.snapshot.paramMap.get('gameId');
           if(!gameId || gameId=="new"){
               this.game=this.gameSvc.newGame();
               dealer.deal(this.game.players);
               // set active player
               if(this.gameSvc.toFaceNumber(this.game.players[0].viewCard(PlayerPositionsEnum.PILE)) 
                  >  
                  this.gameSvc.toFaceNumber(this.game.players[1].viewCard(PlayerPositionsEnum.PILE))){
                   
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
  
  ngOnInit() {
  }
  viewTopOfStack(stack:number):number{
      let centreStack:number[]= this.game.centreStacks[stack];
      let tos:number= centreStack[centreStack.length-1];
  
      if(tos>CardsEnum.DECK){
          //its a joker
          tos=centreStack[centreStack.length-2]+1;
      }
      
      return tos;
  }
  toFaceNumber(card:number):number{
      return this.game.toFaceNumber(card);
  }
  toggleActivePlayer(){
      this.game.activePlayer++;
      if(this.game.activePlayer>=this.game.players.length){
          this.game.activePlayer=0;
      }
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
  onNewMoves(m:Move){
      
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
          this.dealer.fillHand(this.game.players[nextPlayer],this.game);
          this.zone.run(() => this.game.activePlayer=nextPlayer); 
          this.game.nextTurn();
      }else{
//              console.log(`Move: ${JSON.stringify(moves)}`);
          this.zone.run(() => null);
      }
      if(this.game.players[this.game.activePlayer].cardsInHand()==0){
          this.zone.run(() => this.dealer.fillHand(this.game.players[this.game.activePlayer],this.game));
      }
      if(m.to>=GamePositionsEnum.BASE+GamePositionsEnum.STACK_1 && this.toFaceNumber(m.card)==CardsEnum.KING){
          let stack:number[]= this.game.centreStacks[m.to-GamePositionsEnum.BASE];
          console.log(`Recycle centre stack: ${m.to} ${JSON.stringify(this.game.centreStacks[m.to-GamePositionsEnum.BASE])}`);
          this.dealer.addToRecyclePile(stack,this.game);
          this.game.centreStacks[m.to-GamePositionsEnum.BASE]=[CardsEnum.NO_CARD]
      }
      if(m.from==PlayerPositionsEnum.PILE && this.game.players[this.game.activePlayer].viewCard(m.from)==CardsEnum.NO_CARD){
//        Game Over
          this.game.gameOver=this.game.players[this.game.activePlayer].name + " won!.";
      }
  }
  saveGame(){
      console.log(`Game:${JSON.stringify(this.game)}`);
  }
}
