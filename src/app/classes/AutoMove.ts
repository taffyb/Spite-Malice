import {Move} from './Move';

export class AutoMove extends Move{
  score:number;
  nextMoves:AutoMove[];
  previousMove:AutoMove;
}