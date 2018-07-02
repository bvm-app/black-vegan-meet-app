import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    ComponentsModule,
    LazyLoadImageModule,
    IonicPageModule.forChild(EventsPage),
  ],
})
export class EventsPageModule { }
