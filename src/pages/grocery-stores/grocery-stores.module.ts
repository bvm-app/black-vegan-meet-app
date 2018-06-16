import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroceryStoresPage } from './grocery-stores';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    GroceryStoresPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GroceryStoresPage),
  ],
})
export class GroceryStoresPageModule {}
