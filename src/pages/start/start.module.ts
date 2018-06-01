import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartPage } from './start';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    StartPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(StartPage),
  ],
})
export class StartPageModule {}
