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
  user: IUser;
  userSubscription: Subscription;

  constructor(public db: AngularFireDatabase) {
    console.log('Hello UserProvider Provider');
    this.userSubscription = this.db.object(`userData/${firebase.auth().currentUser.uid}`).valueChanges().subscribe((user: IUser) => {
      this.user = user;
    });
  }

  getCurrentUser() {
    return this.user;
  }

  unsubscribeSubscriptions() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
