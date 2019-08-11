import { Injectable } from '@angular/core';
import {Move} from '../classes/Move';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  moves:Move[]=[];
  subscriber:any;
  

  constructor() { }
  
  addMove(move:Move){
      this.moves.push(move);
      this.publish();
  }
  
  subscribeToChanges(subscriber:any){
      this.subscriber=subscriber;
  }
  publish(){
      this.subscriber.onNewMoves(this.moves);
      this.moves=[];
  }
}
