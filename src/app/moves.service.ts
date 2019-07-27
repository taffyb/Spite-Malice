import { Injectable } from '@angular/core';
import {Move} from './Move';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  moves:Move[]=[];
  constructor() { }
  
  addMove(move:Move){
      this.moves.push(move);
  }
}
