import { Component, OnInit, NgZone  } from '@angular/core';
import {Player} from '../Player';
import {Move} from '../Move';
import {DealerService} from '../Dealer.Service';
import {MovesService} from '../Moves.Service';
import {PlayerPositionsEnum} from '../Enums';
import {GamePositionsEnum} from '../Enums';
import {CardsEnum} from '../Enums';


@Component({
  selector: 'play_area',
  templateUrl: './play_area.component.html',
  styleUrls: ['./play_area.component.css']
})
export class Play_areaComponent implements OnInit {
  playerStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];
  players: Player[] = [];
  dealer:DealerService;
  moveService:MovesService;
  centreStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];
  PlayerPositions = PlayerPositionsEnum;
  GamePositions = GamePositionsEnum;
  Cards = CardsEnum;
  activePlayer:number=0;
  isPendingDiscard:boolean=false;
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
                          0 = Stack 1
                          1 = Stack 2
                          2 = Stack 3
                          3 = Stack 4
                          10 = Centre Stack 1
                          11 = Centre Stack 2
                          12 = Centre Stack 3
                          13 = Centre Stack 4
                        */


  constructor(public zone: NgZone,dealer:DealerService,moveService:MovesService) {
      this.dealer = dealer;
      this.moveService = moveService;
  }
  
  ngOnInit() {
      let p:Player= new Player();
      p.name = "Taffy";
      p.guid="abcde";
      p.isPrimary=true;
      this.players.push(p);
      p = new Player();
      p.name = "The Machine";
      p.guid="abcde";
      this.players.push(p);
      this.dealer.deal(this.players); 
      
      console.log(`Player[0].topOfPile=${this.toFaceNumber(this.players[0].viewCard(this.PlayerPositions.PILE))}`);
      console.log(`Player[1].topOfPile=${this.toFaceNumber(this.players[1].viewCard(this.PlayerPositions.PILE))}`);
      
      // set active player
      if(this.toFaceNumber(this.players[0].viewCard(this.PlayerPositions.PILE)) 
         >  
         this.toFaceNumber(this.players[1].viewCard(this.PlayerPositions.PILE))){
          
         this.activePlayer=1;
      }
      this.moveService.subscribeToChanges(this);
  }
  viewTopOfStack(stack:number):number{
      let centreStack:number[]= this.centreStacks[stack];
//      console.log(`TOP_OF_STACK ${stack}\n
//          Center Stacks: ${JSON.stringify(this.centreStacks)}\n
//          Length: ${this.centreStacks.length}\n
//          centreStack: ${JSON.stringify(centreStack)}\n
//          topOfStack: ${JSON.stringify(centreStack[centreStack.length-1])}`);
      return centreStack[centreStack.length-1];
  }
  toFaceNumber(card:number):number{
      let c:number;
      if(card>0){
          c=card%13;
          if(c==0){
              c=13;
          }
      }else{
          c=0;
      }
      return c;
  }
  toggleActivePlayer(){
      this.activePlayer++;
      if(this.activePlayer>=this.players.length){
          this.activePlayer=0;
      }
  }
  toggleMoveFrom(player:number,position:number){
      if(player == this.activePlayer){
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
          let topOfPlayerStack:number= this.players[this.activePlayer].cards[fromPosition].length-1;
          cardToMove=this.players[this.activePlayer].cards[fromPosition][topOfPlayerStack];
      }else{
          cardToMove= this.players[this.activePlayer].viewCard(fromPosition);
      }
      move.card =cardToMove;
      move.to = stack;
//      console.log(`Move: ${JSON.stringify(move)}`);
      if(move.to>=PlayerPositionsEnum['STACK_1'] && move.to<=PlayerPositionsEnum.STACK_4){
          for(let i=PlayerPositionsEnum['STACK_1'];i<=PlayerPositionsEnum.STACK_4;i++){
              if(this.players[this.activePlayer].viewCard(stack)>0){s++;}
          }
          if(this.players[this.activePlayer].viewCard(stack)>0){
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
              let topOfPlayerStack:number= this.players[this.activePlayer].cards[fromPosition].length-1;
              cardToMove=this.toFaceNumber(this.players[this.activePlayer].cards[fromPosition][topOfPlayerStack]);
          }else{
              cardToMove= this.toFaceNumber(this.players[this.activePlayer].viewCard(fromPosition));
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
      
      let nextPlayer = (this.activePlayer+1<this.players.length?this.activePlayer+1:0);
      moves.forEach(m=>{
          this.players[this.activePlayer].removeCard(m.from);
          if(m.to<=PlayerPositionsEnum['STACK_4']){
              this.players[this.activePlayer].addCard(m.card,m.to);
          }else{
//              console.log(`m.to:${m.to} GamePositionsEnum.BASE:${GamePositionsEnum.BASE}`);
              this.centreStacks[m.to-GamePositionsEnum.BASE].push(m.card);
          }
          if(m.isDiscard){
//              console.log(`Discard: ${JSON.stringify(moves)}`);
              this.dealer.fillHand(this.players[nextPlayer]);
              this.zone.run(() => this.activePlayer=nextPlayer);              
          }else{
//              console.log(`Move: ${JSON.stringify(moves)}`);
              this.zone.run(() => null);
          }
          if(this.players[this.activePlayer].cardsInHand()==0){
              this.zone.run(() => this.dealer.fillHand(this.players[this.activePlayer]));
          }
      });
  }
}
