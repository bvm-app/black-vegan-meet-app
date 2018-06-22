import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdviceCornerPage } from './advice-corner';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AdviceCornerPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AdviceCornerPage),
  ],
})
export class AdviceCornerPageModule {}
