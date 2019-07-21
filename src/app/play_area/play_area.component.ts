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
  centreStacks:number[][]=[[0],[0],[0],[0]];

  constructor(private dealer:DealerService) {
      this.dealer = dealer;
  }
  
  ngOnInit() {
      let p:Player= new Player();
      p.name = "Taffy";
      p.guid="abcde";
      p.isPrimary=true;
      this.players.push(p);
      p = new Player();
      p.name = "The Machine";
      p.guid="abcde";
      this.players.push(p);
      this.dealer.deal(this.players); 
  }
  toFaceNumber(card:number):number{
      let c:number=card%13;
      return (c>0?c:13);
  }
}
