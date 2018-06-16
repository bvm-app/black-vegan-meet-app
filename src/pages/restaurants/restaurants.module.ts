import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantsPage } from './restaurants';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RestaurantsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(RestaurantsPage),
  ],
})
export class RestaurantsPageModule {}
