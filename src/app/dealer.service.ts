import { Injectable } from '@angular/core';
import {Player} from './Player';
import {PlayerPositionsEnum} from './Enums';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  deck:number[]=[];
  recyclePile:number[]=[];
  includeJokers:number=0; //maximum 4 (per deck)
  decks:number=2; //default play with two decks

  constructor() {
      for(let d:number=0;d<this.decks;d++){      
          for(let i:number=1;i<=52+(this.includeJokers);i++ ){
              this.deck.push(i);
          }
      }
  }
  
  shuffleDeck() { 
      for (let i:number = this.deck.length - 1; i > 0; i--) {
          let j:number = Math.floor(Math.random() * (i + 1));
          let temp:number = this.deck[i];
          this.deck[i] = this.deck[j];
          this.deck[j] = temp;
      }
  }
  deal(players:Player[]){
      this.shuffleDeck();
      
      // deal the player's pile
      for(let i:number=0;i<13;i++){
          for(let p:number=0;p<players.length;p++){
              players[p].addCard(this.deck.pop(),PlayerPositionsEnum['PILE']);
          } 
      }
      
      // initialise the player's stacks
      for(let i:number=0;i<4;i++){
          for(let p:number=0;p<players.length;p++){
              players[p].addCard(this.deck.pop(),PlayerPositionsEnum['STACK_1']+i);
          }
      } 
      // initialise the player's hand
      for(let i:number=0;i<5;i++){
          for(let p:number=0;p<players.length;p++){
              players[p].addCard(this.deck.pop(),PlayerPositionsEnum['HAND_1']+i);
          }
      }     
  }
  private dealNextCard():number{
      let nextCard:number;
      if(this.deck.length==0){
          /* 
              If the deck has run out of cards, 
              shuffle the recycle pile and add them back into the deck.
          */
          this.deck = this.recyclePile;
          this.recyclePile=[]; //empty the recycle pile
          this.shuffleDeck();
      }
      nextCard= this.deck.pop();
      return nextCard;
  }
  addToRecyclePile(cards:number[]){
      for(let c=0;c<cards.length-1;c++){
          this.recyclePile.push(cards[c]);
      }
  }
  fillHand(player:Player){
      for(let i=5;i>(player.hand.length);i--){
          player.addCard(this.dealNextCard(),PlayerPositionsEnum['HAND_1']+i);
      }
  }
}
