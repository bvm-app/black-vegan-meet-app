import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPage } from './admin';
import { EventsPageModule } from '../events/events.module';

@NgModule({
  declarations: [
    AdminPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminPage),
  ],
})
export class AdminPageModule {}
