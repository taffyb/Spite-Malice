import { Injectable } from '@angular/core';

import {Game} from '../classes/Game';
import {Player} from '../classes/Player';

import {TestGames} from '../test-data/TestGames';

import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {MovesService} from './moves.service';
import {PlayerService} from './player.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  games:Game[]=[];
  player1Guid:string;
  player2Guid:string;
  name:string="New";
  

  constructor(private movesService:MovesService,private playerService:PlayerService) {
      let testGames=new TestGames();
      this.games = testGames.getGames();
  }
  
  newGame():Game{
      let game = new Game();
      game.name=this.name;
      
      let p:Player= this.playerService.clonePlayer(this.player1Guid);
      p.isPrimary=true;
      p.initialiseCards();
      game.players.push(p);
      
      p = this.playerService.clonePlayer(this.player2Guid);
      p.initialiseCards();
      game.players.push(p);
      
      game.inPlay=true;
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
