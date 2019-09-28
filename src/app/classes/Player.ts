
import { v4 as uuid } from 'uuid';
import {PlayerPositionsEnum} from './Enums';
import {PlayerTypesEnum} from './Enums';
import {CardsEnum} from './Enums';

export class Player {
  uuid: string;
  type:number=PlayerTypesEnum.BASE;
  name: string;
  cards:any[];

  isPrimary:boolean=false;

  constructor(){
      this.uuid=uuid();
  }
  initialiseCards(){
      this.cards = [[CardsEnum.NO_CARD], /* PILE*/
                    CardsEnum.NO_CARD,   /* HAND_1*/
                    CardsEnum.NO_CARD,   /* HAND_2*/
                    CardsEnum.NO_CARD,   /* HAND_3*/
                    CardsEnum.NO_CARD,   /* HAND_4*/
                    CardsEnum.NO_CARD,   /* HAND_5*/
                    [CardsEnum.NO_CARD], /* STACK_1*/
                    [CardsEnum.NO_CARD], /* STACK_2*/
                    [CardsEnum.NO_CARD], /* STACK_3*/
                    [CardsEnum.NO_CARD]];/* STACK_4*/ 
  }
  /* Intrinsically NOT type safe */
  static fromJSON(JSONString:string):Player{
      let newPlayer:Player= new this();
      let p=JSON.parse(JSONString);
      newPlayer.uuid=p.uuid;
      newPlayer.type=p.type;
      newPlayer.name=p.name;
      newPlayer.cards=p.cards;
      newPlayer.isPrimary=p.isPrimary;
      return newPlayer;
  }
  getType():number{
      return this.type;
  }
  pileSize():number{
      return this.cards[PlayerPositionsEnum.PILE].length;
  }
  maxStack():number[]{
      let max=1;
      for(let s=PlayerPositionsEnum.STACK_1;s<=PlayerPositionsEnum.STACK_4;s++){
          max=(max<this.cards[s].length?this.cards[s].length:max);
      }
      let maxArray:number[] = []  ;  
      for(let i=0;i<max-2;i++){
          maxArray.push(CardsEnum.NO_CARD);
      }
//      console.log(`maxStack ${JSON.stringify(maxArray)}`);
      return maxArray;
  }
  removeCard(fromPosition:number){

      switch(true){
          case (fromPosition==PlayerPositionsEnum.PILE):
              this.cards[PlayerPositionsEnum.PILE].pop();
              break;
          case (fromPosition>=PlayerPositionsEnum.HAND_1 && fromPosition<=PlayerPositionsEnum.HAND_5):
              this.cards[fromPosition]=CardsEnum.NO_CARD;
              break;
          case (fromPosition>=PlayerPositionsEnum.STACK_1 && fromPosition<=PlayerPositionsEnum.STACK_4):
              this.cards[fromPosition].pop();
              break;
      }
  }
  addCard(card:number,position:number){
      
      switch(position){
          case PlayerPositionsEnum.PILE:
              if(this.cards[PlayerPositionsEnum.PILE].length>13){
                  throw new Error('Player Pile cannot have more than 13 cards');
              }
              this.cards[PlayerPositionsEnum.PILE].push(card);
              break;
          case PlayerPositionsEnum.HAND_1:
              this.cards[PlayerPositionsEnum.HAND_1]=card;
              break;
          case PlayerPositionsEnum.HAND_2:
              this.cards[PlayerPositionsEnum.HAND_2]=card;
          break;
          case PlayerPositionsEnum.HAND_3:
              this.cards[PlayerPositionsEnum.HAND_3]=card;
              break;
          case PlayerPositionsEnum.HAND_4:
              this.cards[PlayerPositionsEnum.HAND_4]=card;
              break;
          case PlayerPositionsEnum.HAND_5:
              this.cards[PlayerPositionsEnum.HAND_5]=card;
              break;
          case PlayerPositionsEnum.STACK_1:
              this.cards[PlayerPositionsEnum.STACK_1].push(card);
              break;
          case PlayerPositionsEnum.STACK_2:
              this.cards[PlayerPositionsEnum.STACK_2].push(card);
              break;
          case PlayerPositionsEnum.STACK_3:
              this.cards[PlayerPositionsEnum.STACK_3].push(card);
              break;
          case PlayerPositionsEnum.STACK_4:
//              console.log(`${this.name} STACK_4 + ${card}\n stack=${JSON.stringify(this.cards[PlayerPositionsEnum.STACK_4])}`);
              this.cards[PlayerPositionsEnum.STACK_4].push(card);
//              console.log(`stack=${JSON.stringify(this.cards[PlayerPositionsEnum.STACK_4])}`);
              break;
          default:
              console.log(`ERROR addCard(${card},${position}) is NOT a valid Position`);
              throw new Error(`${position} is NOT a valid Position`);
      }
  }
  viewTopCard(position:number):number{
      let card:number=-1;
  
      if(position>=PlayerPositionsEnum.STACK_1 && position <=PlayerPositionsEnum.STACK_4){
          card = this.cards[position][this.cards[position].length-1];
      }
      return card;
  }
  viewCard(position:number,depth:number=1):number{
      let card:number=-1;

      switch(position){
          case PlayerPositionsEnum.PILE:
              //only show the top card on the pile.
              let pile = this.cards[PlayerPositionsEnum.PILE].length
              card = this.cards[PlayerPositionsEnum.PILE][pile-1];
              break;
          case PlayerPositionsEnum.HAND_1:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum.HAND_1];
              break;
          case PlayerPositionsEnum.HAND_2:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum.HAND_2];
              break;
          case PlayerPositionsEnum.HAND_3:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum.HAND_3];
              break;
          case PlayerPositionsEnum.HAND_4:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum.HAND_4];
              break;
          case PlayerPositionsEnum.HAND_5:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum.HAND_5];
              break;
          case PlayerPositionsEnum.STACK_1:
              //show the cards on the stack in reverse order.
              if(this.cards[PlayerPositionsEnum.STACK_1].length-1 >= depth){
                  card = this.cards[PlayerPositionsEnum.STACK_1][depth]; 
              }else{
                  card=CardsEnum.NO_CARD;
              }
              break;
          case PlayerPositionsEnum.STACK_2:
              //show the cards on the stack in reverse order.
              if(this.cards[PlayerPositionsEnum.STACK_2].length-1 >= depth){
                  card = this.cards[PlayerPositionsEnum.STACK_2][depth]; 
              }else{
                  card=CardsEnum.NO_CARD;
              }
              break;
          case PlayerPositionsEnum.STACK_3:
              //show the cards on the stack in reverse order.
              if(this.cards[PlayerPositionsEnum.STACK_3].length-1 >= depth){
                  card = this.cards[PlayerPositionsEnum.STACK_3][depth]; 
              }else{
                  card=CardsEnum.NO_CARD;
              }
              break;
          case PlayerPositionsEnum.STACK_4:
              //show the cards on the stack in reverse order.
              if(this.cards[PlayerPositionsEnum.STACK_4].length-1 >= depth){
                  card = this.cards[PlayerPositionsEnum.STACK_4][depth]; 
              }else{
                  card=CardsEnum.NO_CARD;
              }
              break;
      }
//      console.log(`Position: ${position}, depth: ${depth}, card:${card}`);
      return card;
  }
  cardsInHand():number{
      let cards:number=0;
      if(this.cards[PlayerPositionsEnum.HAND_1]>0){cards++;}
      if(this.cards[PlayerPositionsEnum.HAND_2]>0){cards++;}
      if(this.cards[PlayerPositionsEnum.HAND_3]>0){cards++;}
      if(this.cards[PlayerPositionsEnum.HAND_4]>0){cards++;}
      if(this.cards[PlayerPositionsEnum.HAND_5]>0){cards++;}
      return cards;
  }
  isStackFull():boolean{
      const i:number = this.cards[PlayerPositionsEnum.STACK_4].length;
      const isFull:boolean = (this.cards[PlayerPositionsEnum.STACK_1].length>1 &&
                              this.cards[PlayerPositionsEnum.STACK_2].length>1 &&
                              this.cards[PlayerPositionsEnum.STACK_3].length>1 &&
                              this.cards[PlayerPositionsEnum.STACK_4].length>1)
      return isFull;
  }
}