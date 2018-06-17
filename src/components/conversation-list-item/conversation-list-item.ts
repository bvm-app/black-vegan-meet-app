import { Component, Input, OnDestroy } from '@angular/core';
import { IConversationListItem } from '../../models/IConversationListItem';
import { IUser } from '../../models/IUser';
import firebase from 'firebase';
import { env } from '../../app/env';
import moment from 'moment';
import { ConversationProvider } from '../../providers/conversation/conversation';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';

/**
 * Generated class for the ConversationListItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'conversation-list-item',
  templateUrl: 'conversation-list-item.html'
})
export class ConversationListItemComponent implements OnDestroy {
  private _conversationDetails: IConversationListItem;
  private user: IUser;
  private isUserOnlineSubscription: Subscription;
  private isUserOnline: boolean = false;

  formattedTime: string;
  defaultUserImage = env.DEFAULT.userImagePlaceholder;

  get conversationDetails(): IConversationListItem {
    return this._conversationDetails;
  }

  @Input()
  set conversationDetails(value: IConversationListItem) {
    this._conversationDetails = value;
    this.retrieveUser(value.recipient);
    this.formatMessageTimestamp();
  }

  constructor(
    private conversationProvider: ConversationProvider,
    private db: AngularFireDatabase
  ) {
    console.log('Hello ConversationListItemComponent Component');
  }

  ngOnDestroy() {
    if (!this.isUserOnlineSubscription) this.isUserOnlineSubscription.unsubscribe();
  }

  retrieveUser(userId: string) {
    firebase
      .database()
      .ref(`userData/${userId}`)
      .once('value')
      .then(user => {
        this.user = user.val();
      });

    this.isUserOnlineSubscription = this.db
      .object(`presence/${userId}`)
      .valueChanges()
      .subscribe((isOnline: any) => {
        this.isUserOnline = !!isOnline;
      });
  }

  formatMessageTimestamp() {
    this.formattedTime = moment(
      this._conversationDetails.lastMessageTimestamp
    ).format('hh:mm A');
  }

  goToConversation() {
    this.conversationProvider.goToConversation(this.user);
  }
}
