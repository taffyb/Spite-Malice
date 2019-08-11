import { Component } from '@angular/core';
import {TabsEnum} from './classes/Enums';
import {GameService} from './services/Game.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  activeTab:number=TabsEnum.DEFAULT;
  Tabs=TabsEnum;
  gameService:GameService;
  
  constructor(gameService:GameService){
      this.gameService=gameService;
  }
}
