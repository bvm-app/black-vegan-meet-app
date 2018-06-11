import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

/*
  Generated class for the ViewedMeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ViewedMeProvider {
  dbPath = 'userViewedMeData';

  constructor(private db: AngularFireDatabase) {
    console.log('Hello ViewedMeProvider Provider');
  }

  updateCurrentUserViewedMe(userId: string) {
    let currentLoggedInUserId = firebase.auth().currentUser.uid;
    return this.db.object(`${this.dbPath}/${userId}/${currentLoggedInUserId}`).set({
      userId: currentLoggedInUserId,
      lastViewed: firebase.database.ServerValue.TIMESTAMP
    });
  }
}
