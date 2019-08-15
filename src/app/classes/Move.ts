export class Move {
  guid: string;
  player:string;
  from: number;
  card: number;
  to: number;
  isDiscard:boolean=false;
  score:number;
}