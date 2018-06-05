import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroceryStoreModalPage } from './grocery-store-modal';

@NgModule({
  declarations: [
    GroceryStoreModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GroceryStoreModalPage),
  ],
})
export class GroceryStoreModalPageModule {}
