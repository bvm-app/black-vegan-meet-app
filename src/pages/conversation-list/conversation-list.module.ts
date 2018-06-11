import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationListPage } from './conversation-list';

@NgModule({
  declarations: [
    ConversationListPage,
  ],
  imports: [
    IonicPageModule.forChild(ConversationListPage),
  ],
})
export class ConversationListPageModule {}
