import { Component, OnInit } from '@angular/core';
import {Game} from '../Game';
import {GameService} from '../Game.Service';
import {PlayerPositionsEnum} from '../Enums';
import {GamePositionsEnum} from '../Enums';
import {CardsEnum} from '../Enums';
import {SuitsEnum} from '../Enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  games:Game[]=[];
  game:Game;
  gameService:GameService;

  PlayerPositions=PlayerPositionsEnum;
  GamePositions=GamePositionsEnum;
  Cards=CardsEnum;
  Suits=SuitsEnum;
  playerStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];

  constructor(gameService:GameService) { 
      this.games = gameService.getGames(); 
      this.gameService=gameService;
  }

  ngOnInit() {
  }
  setGame(guid:string){
      console.log(`GUID: ${guid}`);
      this.game = this.gameService.getGame(guid);
  }
  toFaceNumber(card:number):number{
      
      return this.game.toFaceNumber(card);
  }
}
