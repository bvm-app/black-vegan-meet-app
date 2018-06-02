import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [SettingsPage],
  imports: [LazyLoadImageModule, IonicPageModule.forChild(SettingsPage)]
})
export class SettingsPageModule {}
