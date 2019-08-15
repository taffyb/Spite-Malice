import { Component, OnInit,Input } from '@angular/core';

@Component({
    selector: 'card',
    template: `<div><img [ngClass]="{'clip':clip}" src="/assets/cards/{{filename()}}"/></div>`,
    styles: [`
        :host {
          display: block;
          padding: 0px;
          /*border: 1px solid black;*/
          border-radius: 8px;
        }
        img{
          width:45px;
          height:70px;
          opacity:0.75;
        }
    `]
  })
  export class CardComponent {
    @Input()cardNo:string;
    @Input()clip:boolean=false;
    
    filename():string{
        let filename:string;
        if(!this.cardNo.startsWith("back")){
            let cardNo = parseInt(this.cardNo);
            filename="c"+(cardNo<10?"0"+cardNo:this.cardNo)+".png";
        }else{
            filename="back.png";
        }
        return filename;
    }
}
