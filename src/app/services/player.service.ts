import { Injectable } from '@angular/core';
import {Player} from '../classes/Player';
import {PlayerTypesEnum} from '../classes/Enums';
import {DeterministicPlayer} from '../classes/DeterministicPlayer';
import {RecursiveDeterministicPlayer} from '../classes/RecursiveDeterministicPlayer';

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

      p=new RecursiveDeterministicPlayer();
      p.name="Roger D.";   
      this.players.push(p);   
      
  }
  findPlayer(puuid:string):Player{
      let retVal:Player=null;
      this.players.forEach(p=>{
         if(p.uuid==puuid){
             retVal=p;
         } 
      });
      return retVal;
  }
  getPlayers():Player[]{
//      console.log(`PlayerSvc.getPlayers :${JSON.stringify(this.players)}`)
      return this.players;
  }
  clonePlayer(puuid:string):Player{
      
      let player:Player=Player.fromJSON(JSON.stringify(this.findPlayer(puuid)));
      let playerType = player.getType();
      if(playerType!=PlayerTypesEnum.BASE){
          switch(playerType){
              case PlayerTypesEnum.DETERMINISTIC:
                  player = DeterministicPlayer.fromPlayer(player);
                  break;
              case PlayerTypesEnum.REC_DETERMINISTIC:
                  player = RecursiveDeterministicPlayer.fromPlayer(player);
                  break
          }
      }
      return player;
  }
}
