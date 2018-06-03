import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { LazyLoadImageModule } from 'ng-lazyload-image';


@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    LazyLoadImageModule,
    IonicPageModule.forChild(EventsPage),
  ],
})
export class EventsPageModule {}
