import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwipeToLikePage } from './swipe-to-like';

import { SwingModule } from 'angular2-swing';

@NgModule({
  declarations: [
    SwipeToLikePage,
  ],
  imports: [
    IonicPageModule.forChild(SwipeToLikePage),
    SwingModule
  ],
})
export class SwipeToLikePageModule {}
