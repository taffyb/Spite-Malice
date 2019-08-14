import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

import {Game} from '../classes/Game';
import {Player} from '../classes/Player';

import {TestGames} from '../test-data/TestGames';

import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {MovesService} from './moves.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  games:Game[]=[];

  constructor(private movesService:MovesService) {
      let testGames=new TestGames();
      this.games = testGames.getGames();
  }
  
  newGame():Game{
      let guid = uuid();
      let game = new Game(guid,this.movesService);
      
      let p:Player= new Player();
      p.name = "Player 1";
      p.isPrimary=true;
      game.players.push(p);
      
      p = new Player();
      p.name = "Player 2";
      game.players.push(p);
            
//      console.log(`Player[0].topOfPile=${this.toFaceNumber(game.players[0].viewCard(PlayerPositionsEnum.PILE))}`);
//      console.log(`Player[1].topOfPile=${this.toFaceNumber(game.players[1].viewCard(PlayerPositionsEnum.PILE))}`);
      
      game.inPlay=true;
//      this.moveService.subscribeToChanges(this);
      this.games.push(game);
      
      return game;
  }
  removeGame(gameId:string){
      this.games.forEach((g,i)=>{
         if(g.guid==gameId){
             this.games.splice(i,1);
         } 
      });
  }
  getGames():Game[]{
      return this.games;
  }
  getActiveGames():Game[]{
      let activeGames:Game[]=[];
      this.games.forEach(g=>{
          if(g.inPlay){
              activeGames.push(g);
          }
      });
      return activeGames;
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
