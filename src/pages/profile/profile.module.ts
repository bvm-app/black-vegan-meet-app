import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    ComponentsModule,
    LazyLoadImageModule,
    IonicPageModule.forChild(ProfilePage),
  ],
})
export class ProfilePageModule {}
