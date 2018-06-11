import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationListPage } from './conversation-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ConversationListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ConversationListPage),
  ],
})
export class ConversationListPageModule {}
