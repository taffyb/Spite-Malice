export class Player {
  guid: string;
  name: string;
  pile: number[]=[];
  topOfPile: number;
  hand: number[]=[]; /*Maximum of 5 cards*/
  stacks:number[][]=[[],[],[],[],[]];
}