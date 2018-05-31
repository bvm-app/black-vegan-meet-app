import { Injectable } from '@angular/core';
import { IUser } from '../../models/IUser';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  private user: IUser;
  private userSubscription: Subscription;

  constructor(public db: AngularFireDatabase) {
    console.log('Hello UserProvider Provider');

    this.initCurrentUser();
    this.initOnlinePresence();
  }

  private initCurrentUser() {
    this.userSubscription = this.db.object(`userData/${firebase.auth().currentUser.uid}`).valueChanges().subscribe((user: IUser) => {
      this.user = user;
    });
  }

  private initOnlinePresence() {
    let amOnline = firebase.database().ref('/.info/connected');
    let userRef = firebase
      .database()
      .ref('/presence/' + firebase.auth().currentUser.uid);

    amOnline.on('value', snapshot => {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    });
  }

  getCurrentUser() {
    return this.user;
  }

  unsubscribeSubscriptions() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
