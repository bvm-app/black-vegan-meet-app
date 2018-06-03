import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageEventsPage } from './manage-events';

@NgModule({
  declarations: [
    ManageEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageEventsPage),
  ],
})
export class ManageEventsPageModule {}
