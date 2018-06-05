import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewedMePage } from './viewed-me';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ViewedMePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ViewedMePage),
  ],
})
export class ViewedMePageModule {}
