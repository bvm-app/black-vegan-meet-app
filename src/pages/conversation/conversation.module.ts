import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationPage } from './conversation';
import { ElasticModule } from 'ng-elastic';

@NgModule({
  declarations: [
    ConversationPage,
  ],
  imports: [
    ElasticModule,
    IonicPageModule.forChild(ConversationPage),
  ],
})
export class ConversationPageModule {}
