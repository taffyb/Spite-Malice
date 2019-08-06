
import {PlayerPositionsEnum} from './Enums';
import {CardsEnum} from './Enums';
import {Player} from './Player';

import {DealerService} from './Dealer.Service';
import {MovesService} from './Moves.Service';

export class Game {
  guid: string;
  name: string;
  players:Player[]=[]; 
  centreStacks:number[][]=[[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD],[CardsEnum.NO_CARD]];
  activePlayer:number=0;

  dealer:DealerService;
  moveService:MovesService;

  constructor(dealer:DealerService,moveService:MovesService,gameGUID:string='') {        
      this.dealer=dealer;
      this.moveService=moveService;
      this.guid=gameGUID;
      this.name=gameGUID; 
  }
}