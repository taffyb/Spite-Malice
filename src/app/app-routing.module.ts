import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Play_areaComponent }   from './play_area/play_area.component';

const routes: Routes = [
     { path: '', redirectTo: '/play-area', pathMatch: 'full' },
     { path: 'play-area', component: Play_areaComponent}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
