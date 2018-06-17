import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { IConversationMessage } from '../../models/IConversationMessage';
import { IConversationListItem } from '../../models/IConversationListItem';
import { IUser } from '../../models/IUser';
import { App } from 'ionic-angular';

/*
  Generated class for the ConversationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConversationProvider {
  dbUserConversationsPath = 'userConversations';
  dbConversationMessagesPath = 'conversationMessages';

  constructor(private db: AngularFireDatabase, private app: App) {
    console.log('Hello ConversationProvider Provider');
  }

  getConversationId(recipentId: string) {
    const currentUserId = firebase.auth().currentUser.uid;

    let conversationId = '';
    if (currentUserId > recipentId) {
      conversationId = `${currentUserId}_${recipentId}`;
    } else {
      conversationId = `${recipentId}_${currentUserId}`;
    }
    return conversationId;
  }

  getConversation(recipentId: string) {
    const conversationId = this.getConversationId(recipentId);

    return this.db
      .list(`${this.dbConversationMessagesPath}/${conversationId}`)
      .valueChanges();
  }

  sendMessage(conversationId: string, payload: IConversationMessage) {
    return this.db
      .list(`${this.dbConversationMessagesPath}/${conversationId}`)
      .push(payload);
  }

  updateUserConversationListDetails(
    userId: string,
    recipientId: string,
    conversationId: string,
    payload: IConversationMessage,
    unread: boolean = false
  ) {
    let conversationListItem: IConversationListItem = {
      id: conversationId,
      lastMessage: payload.payload,
      lastMessageTimestamp: payload.timestamp,
      recipient: recipientId,
      unread: unread
    };

    return this.db
      .object(`${this.dbUserConversationsPath}/${userId}/${conversationId}`)
      .update(conversationListItem);
  }

  clearUnread(userId: string, conversationId: string) {
    const conversationPath = `${this.dbUserConversationsPath}/${userId}/${conversationId}`;

    firebase.database().ref(conversationPath).once('value', snapshot => {
      if (snapshot.exists()) {
        this.db
          .object(conversationPath)
          .update({ unread: false });
      }
    });
  }

  goToConversation(user: IUser) {
    if (!user) return;
    this.app.getActiveNav().push('ConversationPage', { recipient: user });
  }
}
