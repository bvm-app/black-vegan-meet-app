import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [SettingsPage],
  imports: [
    ComponentsModule,
    LazyLoadImageModule,
    IonicPageModule.forChild(SettingsPage)
  ]
})
export class SettingsPageModule {}
