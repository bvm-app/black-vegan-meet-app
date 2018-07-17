import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeeWhoLikedYouPage } from './see-who-liked-you';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SeeWhoLikedYouPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SeeWhoLikedYouPage),
  ],
})
export class SeeWhoLikedYouPageModule {}
