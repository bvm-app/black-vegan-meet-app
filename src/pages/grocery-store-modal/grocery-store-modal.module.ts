import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DragulaModule } from 'ng2-dragula';
import { GroceryStoreModalPage } from './grocery-store-modal';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    GroceryStoreModalPage,
  ],
  imports: [
    LazyLoadImageModule,
    DragulaModule,
    IonicPageModule.forChild(GroceryStoreModalPage),
  ],
})
export class GroceryStoreModalPageModule {}
