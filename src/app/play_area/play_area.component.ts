import { Component, OnInit } from '@angular/core';
import {Player} from '../Player';
import {DealerService} from '../Dealer.Service';

@Component({
  selector: 'play_area',
  templateUrl: './play_area.component.html',
  styleUrls: ['./play_area.component.css']
})
export class Play_areaComponent implements OnInit {
  players: Player[] = [];
  dealer:DealerService;

  constructor(private dealer:DealerService) {
      this.dealer = dealer;
  }
  

  ngOnInit() {
      let p:Player= new Player();
      p.name = "Taffy";
      p.guid="abcde";
      this.players.push(p);
      p = new Player();
      p.name = "The Machine";
      p.guid="abcde";
      this.players.push(p);
      this.dealer.deal(this.players); 
  }
   
}
