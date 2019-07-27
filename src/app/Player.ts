
import {PlayerPositionsEnum} from './Enums';
import {CardsEnum} from './Enums';

export class Player {
  guid: string;
  name: string;
  cards:any[]=[[],CardsEnum.NO_CARD,CardsEnum.NO_CARD,CardsEnum.NO_CARD,CardsEnum.NO_CARD,CardsEnum.NO_CARD,[],[],[],[]];// pile 

  isPrimary:boolean=false;


  pileSize():number{
      return this.cards[PlayerPositionsEnum['PILE']].length;
  }
  addCard(card:number,position:number){
      
      switch(position){
          case PlayerPositionsEnum['PILE']:
              if(this.cards[PlayerPositionsEnum['PILE']].length>13){
                  throw new Error('Player Pile cannot have more than 13 cards');
              }
              this.cards[PlayerPositionsEnum['PILE']].push(card);
              break;
          case PlayerPositionsEnum['HAND_1']:
              this.cards[PlayerPositionsEnum['HAND_1']]=card;
              break;
          case PlayerPositionsEnum['HAND_2']:
              this.cards[PlayerPositionsEnum['HAND_2']]=card;
          break;
          case PlayerPositionsEnum['HAND_3']:
              this.cards[PlayerPositionsEnum['HAND_3']]=card;
              break;
          case PlayerPositionsEnum['HAND_4']:
              this.cards[PlayerPositionsEnum['HAND_4']]=card;
              break;
          case PlayerPositionsEnum['HAND_5']:
              this.cards[PlayerPositionsEnum['HAND_5']]=card;
              break;
          case PlayerPositionsEnum['STACK_1']:
              this.cards[PlayerPositionsEnum['STACK_1']].push(card);
              break;
          case PlayerPositionsEnum['STACK_2']:
              this.cards[PlayerPositionsEnum['STACK_2']].push(card);
              break;
          case PlayerPositionsEnum['STACK_3']:
              this.cards[PlayerPositionsEnum['STACK_3']].push(card);
              break;
          case PlayerPositionsEnum['STACK_4']:
              this.cards[PlayerPositionsEnum['STACK_4']].push(card);
              break;
          default:
              throw new Error(`${position} is NOT a valid Position`);
      }
  }
  viewCard(position:number,depth:number=1):number{
      let card:number=-1;

      switch(position){
          case PlayerPositionsEnum['PILE']:
              //only show the top card on the pile.
              card = this.cards[this.cards.length-1];
              break;
          case PlayerPositionsEnum['HAND_1']:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum['HAND_1']];
              break;
          case PlayerPositionsEnum['HAND_2']:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum['HAND_2']];
              break;
          case PlayerPositionsEnum['HAND_3']:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum['HAND_3']];
              break;
          case PlayerPositionsEnum['HAND_4']:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum['HAND_4']];
              break;
          case PlayerPositionsEnum['HAND_5']:
              //only show the top card on the pile.
              card = this.cards[PlayerPositionsEnum['HAND_5']];
              break;
          case PlayerPositionsEnum['STACK_1']:
              //show the cards on the stack in reverse order.
              card = this.cards[PlayerPositionsEnum['STACK_1']][this.cards[PlayerPositionsEnum['STACK_1']].length-depth];
              break;
          case PlayerPositionsEnum['STACK_2']:
              //show the cards on the stack in reverse order.
              card = this.cards[PlayerPositionsEnum['STACK_2']][this.cards[PlayerPositionsEnum['STACK_2']].length-depth];
              break;
          case PlayerPositionsEnum['STACK_3']:
              //show the cards on the stack in reverse order.
              card = this.cards[PlayerPositionsEnum['STACK_3']][this.cards[PlayerPositionsEnum['STACK_3']].length-depth];
              break;
          case PlayerPositionsEnum['STACK_4']:
              //show the cards on the stack in reverse order.
              card = this.cards[PlayerPositionsEnum['STACK_4']][this.cards[PlayerPositionsEnum['STACK_4']].length-depth];
              break;
      }

//      console.log(`Position: ${position}, depth: ${depth}, card:${card}`);
      return card;
  }
}