import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwipeToLikePage } from './swipe-to-like';

import { SwipeCardsModule } from 'ng2-swipe-cards';

@NgModule({
  declarations: [
    SwipeToLikePage,
  ],
  imports: [
    IonicPageModule.forChild(SwipeToLikePage),
    SwipeCardsModule
  ],
})
export class SwipeToLikePageModule {}
