import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { IUser } from '../../models/IUser';


/*
  Generated class for the SwipeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SwipeProvider {

  dbPath = 'userSwipeData';
  private currentLoggedInUserId = firebase.auth().currentUser.uid;
  swipeRef;

  constructor(
    private db: AngularFireDatabase
  ) {
    console.log('Hello SwipeProvider Provider');

  }

  updateUserSwipeData(userId: string, liked: boolean) {
    if (liked) {
      this.swipeRef = this.db.object(`${this.dbPath}/${userId}/usersWhoLiked/${this.currentLoggedInUserId}`).set(true);

    } else {
      this.swipeRef = this.db.object(`${this.dbPath}/${userId}/usersWhoDisliked/${this.currentLoggedInUserId}`).set(true);
    }

    return this.swipeRef;
  }

}
