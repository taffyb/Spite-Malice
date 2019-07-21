export class Player {
  guid: string;
  name: string;
  pile: number[]=[];
  topOfPile: number;
  hand: number[]=[]; /*Maximum of 5 cards*/
  stacks:number[][]=[[],[],[],[],[]];
  isPrimary:boolean=false;

  maxStack():number{
      let max:number=0;
      for(let s:number=0;s<this.stacks.length;s++){
          max=(this.stacks.length>max?this.stacks.length:max);
      }
      return max;
  }
}