import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading/loading';
import { UserCompactViewComponent } from './user-compact-view/user-compact-view';
import { CommonModule } from '@angular/common';
import { ConversationListItemComponent } from './conversation-list-item/conversation-list-item';

@NgModule({
  declarations: [
    LoadingComponent,
    UserCompactViewComponent,
    ConversationListItemComponent
  ],
  imports: [CommonModule],
  exports: [
    LoadingComponent,
    UserCompactViewComponent,
    ConversationListItemComponent
  ]
})
export class ComponentsModule {}
