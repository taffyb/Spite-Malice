import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

import {Game} from './Game';
import {Player} from './Player';

import {DealerService} from './Dealer.Service';
import {MovesService} from './Moves.Service';

import {PlayerPositionsEnum} from './Enums';
import {GamePositionsEnum} from './Enums';
import {CardsEnum} from './Enums';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  games:Game[]=[];
  dealerService:DealerService;
  moveService:MovesService;

  constructor(dealer:DealerService,moveService:MovesService) {
       
      this.dealerService = dealer;
      this.moveService = moveService;
  }
  
  newGame():Game{
      let guid = uuid();
      let game = new Game(this.dealerService,this.moveService,guid);
      
      let p:Player= new Player();
      p.name = "Player 1";
      p.guid=uuid();
      p.isPrimary=true;
      game.players.push(p);
      
      p = new Player();
      p.name = "Player 2";
      p.guid=uuid();
      game.players.push(p);
      
      this.dealerService.deal(game.players); 
      
      console.log(`Player[0].topOfPile=${this.toFaceNumber(game.players[0].viewCard(PlayerPositionsEnum.PILE))}`);
      console.log(`Player[1].topOfPile=${this.toFaceNumber(game.players[1].viewCard(PlayerPositionsEnum.PILE))}`);
      
      // set active player
      if(this.toFaceNumber(game.players[0].viewCard(PlayerPositionsEnum.PILE)) 
         >  
         this.toFaceNumber(game.players[1].viewCard(PlayerPositionsEnum.PILE))){
          
         game.activePlayer=1;
      }
//      this.moveService.subscribeToChanges(this);
      
      return game;
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
}
