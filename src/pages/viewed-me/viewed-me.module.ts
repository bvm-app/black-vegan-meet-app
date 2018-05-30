import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewedMePage } from './viewed-me';

@NgModule({
  declarations: [
    ViewedMePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewedMePage),
  ],
})
export class ViewedMePageModule {}
