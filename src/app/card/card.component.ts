import { Component, OnInit,Input } from '@angular/core';

@Component({
    selector: 'card',
    template: `<div><img>src="/assets/cards/c0{{name}}.png"/></div>`,
    styles: [`
        :host {
          display: block;
          padding: 32px;
          border: 1px solid black;
          border-radius: 8px;
        }
        img{
          height:20px;
          width:15px;
        }
    `]
  })
  export class CardComponent {
    @Input()cardNo:number;
    
}
