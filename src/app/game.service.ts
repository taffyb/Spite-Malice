import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

import {Game} from './Game';
import {Player} from './Player';

import {TestGames} from './test-data/TestGames';

import {PlayerPositionsEnum} from './Enums';
import {GamePositionsEnum} from './Enums';
import {CardsEnum} from './Enums';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  games:Game[]=[];

  constructor() {
      let testGames=new TestGames();
      this.games = testGames.getGames();
  }
  
  newGame():Game{
      let guid = uuid();
      let game = new Game(guid);
      
      let p:Player= new Player();
      p.name = "Player 1";
      p.isPrimary=true;
      game.players.push(p);
      
      p = new Player();
      p.name = "Player 2";
      game.players.push(p);
            
      console.log(`Player[0].topOfPile=${this.toFaceNumber(game.players[0].viewCard(PlayerPositionsEnum.PILE))}`);
      console.log(`Player[1].topOfPile=${this.toFaceNumber(game.players[1].viewCard(PlayerPositionsEnum.PILE))}`);
      
      // set active player
      if(this.toFaceNumber(game.players[0].viewCard(PlayerPositionsEnum.PILE)) 
         >  
         this.toFaceNumber(game.players[1].viewCard(PlayerPositionsEnum.PILE))){
          
         game.activePlayer=1;
      }
//      this.moveService.subscribeToChanges(this);
      this.games.push(game);
      return game;
  }
  getGames():Game[]{
      return this.games;
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
  getGame(guid:string):Game{
      let game:Game;
      this.games.forEach(g=>{
          if(g.guid==guid){
              game = g;
          }
      });
      
      return game;
  }
}
