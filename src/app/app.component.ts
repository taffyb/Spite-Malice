import { Component } from '@angular/core';
import {TabsEnum} from './Enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  activeTab:number=TabsEnum.DEFAULT;
  Tabs=TabsEnum;
}
