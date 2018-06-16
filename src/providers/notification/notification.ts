import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription, ReplaySubject } from 'rxjs';
import firebase from 'firebase';
import { INotifications } from '../../models/INotifications';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {
  private dbPath: string;
  private userNotificationsSubscription: Subscription = new Subscription();
  private notifications: ReplaySubject<INotifications>;

  constructor(private db: AngularFireDatabase) {
    console.log('Hello NotificationProvider Provider');

    this.dbPath = 'notifications';
    this.notifications = new ReplaySubject<INotifications>(1);

    this.initNotifications();
  }

  private initNotifications() {
    const currentUserId = firebase.auth().currentUser.uid;

    this.userNotificationsSubscription = this.db
      .object(`${this.dbPath}/${currentUserId}`)
      .valueChanges()
      .subscribe((notifications: INotifications) => {
        this.notifications.next(notifications);
      });
  }

  getNotifications() {
    return this.notifications;
  }

  unsubscribeSubscriptions() {
    if (this.userNotificationsSubscription)
      this.userNotificationsSubscription.unsubscribe();
  }

  // incrementMessageNotificationCount(userId) {
  //   return this.db
  //     .object(`${this.dbPath}/${userId}/messages`)
  //     .query.ref.transaction(messagesCount => {
  //       if (messagesCount === null) {
  //         return (messagesCount = 1);
  //       } else {
  //         return messagesCount + 1;
  //       }
  //     });
  // }

  // decrementMessageNotificationCount(userId) {
  //   return this.db
  //     .object(`${this.dbPath}/${userId}/messages`)
  //     .query.ref.transaction(messagesCount => {
  //       if (messagesCount === null || messagesCount < 1) {
  //         return (messagesCount = 0);
  //       } else {
  //         return messagesCount - 1;
  //       }
  //     });
  // }

  // clearCurrentUserMessageNotificationCount() {
  //   const currentUserId = firebase.auth().currentUser.uid;

  //   return this.db
  //     .object(`${this.dbPath}/${currentUserId}/messages`)
  //     .query.ref.transaction(messagesCount => {
  //       return (messagesCount = 0);
  //     });
  // }

  addMessageNotificationToUser(userId) {
    const currentUserId = firebase.auth().currentUser.uid;

    return this.db
      .object(`${this.dbPath}/${userId}/messages/${currentUserId}`)
      .query.ref.transaction(value => {
        return value = true;
      });
  }

  removeMessageNotificationToUser(userId) {
    const currentUserId = firebase.auth().currentUser.uid;

    return this.db
      .object(`${this.dbPath}/${currentUserId}/messages/${userId}`)
      .remove();
  }

  setViewedMeNotification(userId) {
    return this.db
      .object(`${this.dbPath}/${userId}/viewedMe`)
      .query.ref.transaction(viewedMe => {
        return (viewedMe = true);
      });
  }

  clearCurrentUserViewedMeNotification() {
    const currentUserId = firebase.auth().currentUser.uid;

    return this.db
      .object(`${this.dbPath}/${currentUserId}/viewedMe`)
      .query.ref.transaction(viewedMe => {
        return (viewedMe = false);
      });
  }
}
