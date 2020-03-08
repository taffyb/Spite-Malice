import { Component, OnInit,Input } from '@angular/core';
import { useAnimation, transition, trigger, style, animate } from '@angular/animations';
import { CardAnimation } from '../classes/CardAnimation';



@Component({
    selector: 'card',
    template: `<div id="c{{pos}}"><img  src="assets/cards/{{filename()}}"/></div>`,
    styles: [`
        :host {
          float: left;
          padding: 0px;
          border-radius: 8px;
        }
        img{
          width:45px;
          height:70px;
          opacity:0.75;
        }
    `],
  animations: [CardAnimation]
  })
  export class CardComponent {
    @Input()cardNo:string;
    @Input()pos:string;
    
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
