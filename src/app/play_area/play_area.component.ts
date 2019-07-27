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
  players: Player[] = [];
  dealer:DealerService;
  moveService:MovesService;
  centreStacks:number[][]=[[CardsEnum['NO_CARD']],[CardsEnum['NO_CARD']],[CardsEnum['NO_CARD']],[CardsEnum['NO_CARD']]];
  PlayerPositions = PlayerPositionsEnum;
  GamePositions = GamePositionsEnum;
  Cards = CardsEnum;
  activePlayer:number=0;
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
      
      console.log(`Player[0].topOfPile=${this.toFaceNumber(this.players[0].viewCard(this.PlayerPositions['PILE']))}`);
      console.log(`Player[1].topOfPile=${this.toFaceNumber(this.players[1].viewCard(this.PlayerPositions['PILE']))}`);
      
      // set active player
      if(this.toFaceNumber(this.players[0].viewCard(this.PlayerPositions["PILE"])) 
         >  
         this.toFaceNumber(this.players[1].viewCard(this.PlayerPositions['PILE']))){
          
         this.activePlayer=1;
      }
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
      let c:number=card%13;
      return (c>0?c:13);
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
  moveToCentreStack(stack:number){
      let move:Move = new Move();
      move.from = this.fromPosition;
      move.card =this.players[this.activePlayer].viewCard(stack);
      move.to = stack+GamePositionsEnum['BASE'];
      console.log(`moveToCentreStack: ${JSON.stringify(move)}`);
      this.moveService.addMove(move);
      this.fromPosition=-1;
  }
  moveToPlayerStack(stack:number){
      let move:Move = new Move();
      move.from = this.fromPosition;
      move.card =this.players[this.activePlayer].viewCard(stack);
      move.to = stack;
      console.log(`Move: ${JSON.stringify(move)}`);
      this.moveService.addMove(move);
      this.fromPosition=-1;
  }
  canMoveHere(toPosition:number){
      console.log(`canMovehere: ${toPosition}`);
      let canMove:boolean=false;
      let fromPosition:number=this.fromPosition;
  
      if(fromPosition>-1){
          if(toPosition>=(GamePositionsEnum['BASE']+GamePositionsEnum['STACK_1']) &&
                  toPosition<=GamePositionsEnum['BASE']+GamePositionsEnum['STACK_4']){
             let centreCard:number=this.viewTopOfStack(toPosition-GamePositionsEnum['BASE']);
             if(this.players[this.activePlayer].viewCard(this.fromPosition)==(centreCard<13?centreCard+1:1)) {
                  canMove=true;
             }        
          }
      }
      return canMove;
  }
}
