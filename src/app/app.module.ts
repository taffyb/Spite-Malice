import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { Play_areaComponent } from './play_area/play_area.component';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    Play_areaComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
