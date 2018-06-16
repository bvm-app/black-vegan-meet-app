import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantModalPage } from './restaurant-modal';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [
    RestaurantModalPage,
  ],
  imports: [
    LazyLoadImageModule,
    DragulaModule,
    IonicPageModule.forChild(RestaurantModalPage),
  ],
})
export class RestaurantModalPageModule {}
