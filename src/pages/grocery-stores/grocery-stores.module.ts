import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroceryStoresPage } from './grocery-stores';

@NgModule({
  declarations: [
    GroceryStoresPage,
  ],
  imports: [
    IonicPageModule.forChild(GroceryStoresPage),
  ],
})
export class GroceryStoresPageModule {}
