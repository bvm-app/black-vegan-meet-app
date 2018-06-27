import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PremiumSubscriptionPage } from './premium-subscription';

@NgModule({
  declarations: [
    PremiumSubscriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(PremiumSubscriptionPage),
  ],
})
export class PremiumSubscriptionPageModule {}
