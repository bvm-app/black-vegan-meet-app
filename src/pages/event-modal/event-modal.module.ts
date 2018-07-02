import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventModalPage } from './event-modal';
import { DragulaModule } from 'ng2-dragula';
import { LazyLoadImageModule } from 'ng-lazyload-image';



@NgModule({
  declarations: [
    EventModalPage,
  ],
  imports: [
    LazyLoadImageModule,
    DragulaModule,
    IonicPageModule.forChild(EventModalPage)
  ],
})
export class EventModalPageModule {}
