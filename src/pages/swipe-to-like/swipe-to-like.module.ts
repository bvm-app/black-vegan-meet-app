import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwipeToLikePage } from './swipe-to-like';

@NgModule({
  declarations: [
    SwipeToLikePage,
  ],
  imports: [
    IonicPageModule.forChild(SwipeToLikePage),
  ],
})
export class SwipeToLikePageModule {}
