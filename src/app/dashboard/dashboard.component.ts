import { Component, OnInit} from '@angular/core';
import {Game} from '../classes/Game';
import {GameService} from '../services/game.service';
import {PlayerService} from '../services/player.service';
import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {SuitsEnum} from '../classes/Enums';
import {SMUtils} from '../classes/SMUtils';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  games:Game[]=[];
  game:Game;
  playerService:PlayerService;
  gameService:GameService;
  

  PlayerPositions=PlayerPositionsEnum;
  GamePositions=GamePositionsEnum;
  Cards=CardsEnum;
  Suits=SuitsEnum;
  playerStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];

  constructor(gameSvc:GameService,playerSvc:PlayerService) { 
      this.games = gameSvc.getGames();
      this.playerService=playerSvc;    
      this.gameService=gameSvc;      
  }

  ngOnInit() {
  }
  
  setGame(guid:string){
//      console.log(`GUID: ${guid}`);
      this.game = this.gameService.getGame(guid);
  }
  toFaceNumber(card:number):number{      
      return SMUtils.toFaceNumber(card);
  }
}
