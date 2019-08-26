import { Component } from '@angular/core';
import { slidingDoorAnimation } from './Animate';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  animations: [slidingDoorAnimation]
})
export class AppComponent  {
  name = 'Angular';
  public slidingDoorValue:string = 'out';

  toggleSlideContent() {
    this.slidingDoorValue = (this.slidingDoorValue == 'in')?'out':'in'; 
  }
}
//<div [@slidingDoorAnimation]="{value:slidingDoorValue,params:{inWidth:'100px',time:'1000ms'}}">Hello world</div>