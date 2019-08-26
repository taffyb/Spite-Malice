import { Injectable } from '@angular/core';
import {Player} from '../classes/Player';
import {PlayerTypesEnum} from '../classes/Enums';
import {DeterministicPlayer} from '../classes/DeterministicPlayer';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private players:Player[]=[];

  constructor() { 
      let p:Player = new Player();
      p.name="Taffy";
      this.players.push(p);
      
      p=new Player();
      p.name="Suzannah";
      this.players.push(p);
      
      p=new DeterministicPlayer();
      p.name="Dannie D.";   
      this.players.push(p); 
      
      p=new DeterministicPlayer();
      p.name="Doug D.";   
      this.players.push(p);   
  }
  findPlayer(guid:string):Player{
      let retVal:Player=null;
      this.players.forEach(p=>{
         if(p.guid==guid){
             retVal=p;
         } 
      });
      return retVal;
  }
  getPlayers():Player[]{
      return this.players;
  }
  clonePlayer(guid:string):Player{
      
      let player:Player=Player.fromJSON(JSON.stringify(this.findPlayer(guid)));
      let playerType = player.getType();
      if(playerType!=PlayerTypesEnum.BASE){
          if(playerType=PlayerTypesEnum.DETERMINISTIC){
              
              player = DeterministicPlayer.fromPlayer(player);
          }
      }
      return player;
  }
}
