import {Injectable} from '@angular/core';
import {Player} from '../classes/Player';
import {Game} from '../classes/Game';
import {PlayerPositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  deck:number[]=[];
  recyclePile:number[]=[];
  includeJokers:number=0; //maximum 4 (per deck)
  decks:number=2; //default play with two decks

  constructor() {
      this.fillDeck();
  }
  private fillDeck(){
      this.deck=[];
      for(let d:number=0;d<this.decks;d++){      
          for(let i:number=1;i<=52+(this.includeJokers);i++){
              this.deck.push(i);
          }
      }      
  }
  setGameDeck(game:Game){
      this.fillDeck();
      game.centreStacks.forEach(s=>{
          if(s.length>1){
              s.forEach(c=>{
                  if(c>0){
                      this.removeCard(c);
                  }                  
              });
          }
      });
      game.players.forEach(p=>{
          p.cards.forEach((pos,posIdx)=>{
             if(posIdx == PlayerPositionsEnum.PILE) {
                 pos.forEach(c=>{
                     if(c>0){
                         this.removeCard(c);
                     }                  
                 });
             }
             if(posIdx >=PlayerPositionsEnum.HAND_1 && posIdx <=PlayerPositionsEnum.HAND_5) {
                 this.removeCard(pos);
             }
             if(posIdx >=PlayerPositionsEnum.STACK_1 && posIdx <=PlayerPositionsEnum.STACK_4) {
                 pos.forEach(c=>{
                     if(c>0){
                         this.removeCard(c);
                     }                  
                 });
             }
          });
      });
      this.shuffleDeck();
  }
  removeCard(card:number){
      let removed:number;
      for(let i=0;i<this.deck.length;i++){
          let c = this.deck[i];
          if(c==card){
              removed=this.deck.splice(i,1)[0];
              break;
          }
      }
      
//      console.log(`Remove ${card} = ${removed}`);
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
  private dealNextCard(game:Game):number{
      let nextCard:number;
      if(this.deck.length==0){
          /* 
              If the deck has run out of cards, 
              shuffle the recycle pile and add them back into the deck.
          */
          this.deck = game.recyclePile;
          game.recyclePile=[]; //empty the recycle pile
          this.shuffleDeck();
      }
      if(this.deck.length==0){
          throw Error;
      }
      nextCard= this.deck.pop();
      return nextCard;
  }
  addToRecyclePile(cards:number[],game:Game){
      for(let c=0;c<cards.length-1;c++){
          game.recyclePile.push(cards[c]);
      }
  }
  fillHand(player:Player,game:Game){
      let c:number=0;
//      console.log(`fillHand\nPlayer: ${player.name} Hand B4: ${JSON.stringify(player.cards)}`);
      for(let i=PlayerPositionsEnum['HAND_1'];i<PlayerPositionsEnum['STACK_1'];i++){
          if(player.cards[i]==CardsEnum.NO_CARD){
              let nextCard:number = this.dealNextCard(game);
//              console.log(`add card ${nextCard} to position ${i}`);
              c++;
              player.addCard(nextCard,i);
          }          
      }
      console.log(`fillHand\nPlayer: ${player.name} Added ${c} cards`);
  }
}
