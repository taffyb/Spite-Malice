import {Component, OnInit, NgZone  } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {Player} from '../Player';
import {Move} from '../Move';
import {DealerService} from '../Dealer.Service';
import {MovesService} from '../Moves.Service';
import {GameService} from '../Game.Service';
import {PlayerPositionsEnum} from '../Enums';
import {GamePositionsEnum} from '../Enums';
import {CardsEnum} from '../Enums';
import {Game} from '../Game';


@Component({
  selector: 'play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css']
})
export class PlayAreaComponent implements OnInit {
  playerStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];
  dealer:DealerService;
  moveService:MovesService;
  gameService:GameService;
  PlayerPositions=PlayerPositionsEnum;
  GamePositions=GamePositionsEnum;
  Cards=CardsEnum;
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


  constructor(private route: ActivatedRoute,public zone: NgZone,dealer:DealerService,moveService:MovesService, gameService:GameService) {
       
      this.dealer = dealer;
      this.moveService = moveService;
      this.gameService = gameService;
  }
  
  ngOnInit() {
       this.game=this.gameService.newGame();
//       this.players = this.game.players;
//       this.centreStacks= this.game.centreStacks;
//       this.activePlayer=this.game.activePlayer;
      this.moveService.subscribeToChanges(this);
  }
  viewTopOfStack(stack:number):number{
      
      let centreStack:number[]= this.game.centreStacks[stack];
//      console.log(`TOP_OF_STACK ${stack}\n
//          Center Stacks: ${JSON.stringify(this.centreStacks)}\n
//          centreStack: ${JSON.stringify(centreStack)}\n
//          topOfStack: ${centreStack[centreStack.length-1]}`);
      return centreStack[centreStack.length-1];
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
      this.zone.run(() => this.toPosition =position);        
  }
  moveTo(stack:number){
      let move:Move = new Move();
      let s:number=0;
      move.from = this.fromPosition;
      const fromPosition:number=this.fromPosition;
      let cardToMove:number;
      if(fromPosition>=PlayerPositionsEnum.STACK_1 && fromPosition<=PlayerPositionsEnum.STACK_4){
          let topOfPlayerStack:number= this.game.players[this.game.activePlayer].cards[fromPosition].length-1;
          cardToMove=this.game.players[this.game.activePlayer].cards[fromPosition][topOfPlayerStack];
      }else{
          cardToMove= this.game.players[this.game.activePlayer].viewCard(fromPosition);
      }
      move.card =cardToMove;
      move.to = stack;
//      console.log(`Move: ${JSON.stringify(move)}`);
      if(move.to>=PlayerPositionsEnum['STACK_1'] && move.to<=PlayerPositionsEnum.STACK_4){
          for(let i=PlayerPositionsEnum['STACK_1'];i<=PlayerPositionsEnum.STACK_4;i++){
              if(this.game.players[this.game.activePlayer].viewCard(stack)>0){s++;}
          }
          if(this.game.players[this.game.activePlayer].viewCard(stack)>0){
              this.isPendingDiscard=true;
          }
      }
      
      if(this.isPendingDiscard && s==4){
         move.isDiscard=true;
         this.isPendingDiscard=false;
      }
      this.moveService.addMove(move);
      this.fromPosition=-1;
      this.toPosition=-1;
  }
  canMoveHere(toPosition:number){
      let canMove:boolean=false;
      const fromPosition:number=this.fromPosition;
//      if(fromPosition>-1){console.log(`canMovehere: ${toPosition}`)};
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
             let centreCard:number=this.toFaceNumber(this.viewTopOfStack(toPosition-GamePositionsEnum.BASE));
             if(cardToMove==(centreCard<13?centreCard+1:1)) {
                  canMove=true;
             }        
          }
      }
      return canMove;
  }
  onNewMoves(moves:Move[]){
      
      let nextPlayer = (this.game.activePlayer+1<this.game.players.length?this.game.activePlayer+1:0);
      moves.forEach(m=>{
          this.game.players[this.game.activePlayer].removeCard(m.from);
          if(m.to<=PlayerPositionsEnum['STACK_4']){
              this.game.players[this.game.activePlayer].addCard(m.card,m.to);
          }else{
//              console.log(`m.to:${m.to} GamePositionsEnum.BASE:${GamePositionsEnum.BASE}`);
              this.game.centreStacks[m.to-GamePositionsEnum.BASE].push(m.card);
          }
          if(m.isDiscard){
//              console.log(`Discard: ${JSON.stringify(moves)}`);
              this.dealer.fillHand(this.game.players[nextPlayer]);
              this.zone.run(() => this.game.activePlayer=nextPlayer);              
          }else{
//              console.log(`Move: ${JSON.stringify(moves)}`);
              this.zone.run(() => null);
          }
          if(this.game.players[this.game.activePlayer].cardsInHand()==0){
              this.zone.run(() => this.dealer.fillHand(this.game.players[this.game.activePlayer]));
          }
          if(m.to>=GamePositionsEnum.BASE+GamePositionsEnum.STACK_1 && this.toFaceNumber(m.card)==CardsEnum.KING){
              let stack:number[]= this.game.centreStacks[m.to-GamePositionsEnum.BASE];
              console.log(`Recycle centre stack: ${m.to} ${JSON.stringify(this.game.centreStacks[m.to-GamePositionsEnum.BASE])}`);
              this.dealer.addToRecyclePile(stack);
              this.zone.run(() => this.game.centreStacks[m.to]=[CardsEnum.NO_CARD]);
          }
      });
  }
}
