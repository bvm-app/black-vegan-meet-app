import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { IUser } from '../../models/IUser';

/*
  Generated class for the ViewedMeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ViewedMeProvider {
  dbPath = 'userViewedMeData';
  private currentLoggedInUserId = firebase.auth().currentUser.uid;

  constructor(private db: AngularFireDatabase) {
    console.log('Hello ViewedMeProvider Provider');
  }

  updateCurrentUserViewedMe(userId: string) {
    return this.db.object(`${this.dbPath}/${userId}/${this.currentLoggedInUserId}`).set({
      userId: this.currentLoggedInUserId,
      lastViewed: firebase.database.ServerValue.TIMESTAMP
    });
  }
}
