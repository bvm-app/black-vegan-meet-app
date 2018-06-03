import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    LazyLoadImageModule,
    IonicPageModule.forChild(ProfilePage),
  ],
})
export class ProfilePageModule {}
