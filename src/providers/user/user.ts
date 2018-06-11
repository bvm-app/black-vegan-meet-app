import { Injectable } from '@angular/core';
import { IUser } from '../../models/IUser';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription, ReplaySubject } from 'rxjs';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  private currentLoggedInUserId: string;
  private isAdmin: boolean = false;
  private _user: IUser;
  private user: ReplaySubject<IUser>;
  private userSubscription: Subscription;
  private adminSubscription: Subscription;


  constructor(public db: AngularFireDatabase) {
    console.log('Hello UserProvider Provider');

    this.user = new ReplaySubject<IUser>(1);
  }

  private notifyObservers() {
    this.user.next(this._user);
  }

  initCurrentUser() {
    this.currentLoggedInUserId = firebase.auth().currentUser.uid;
    this.userSubscription = this.db
      .object(`userData/${this.currentLoggedInUserId}`)
      .valueChanges()
      .subscribe((user: IUser) => {
        this._user = user;
        this.notifyObservers();
      });
  }

  initAdminStatus() {
    this.adminSubscription = this.db
      .object(`appAdmins/${this.currentLoggedInUserId}`)
      .valueChanges()
      .subscribe(value => {
        this.isAdmin = !!value;
      });
  }

  initOnlinePresence() {
    var amOnline = firebase.database().ref('/.info/connected');
    var userRef = firebase
      .database()
      .ref('/presence/' + this.currentLoggedInUserId);

    amOnline.on('value', snapshot => {
      if (snapshot.val()) {
        this.db.object(`userData/${this.currentLoggedInUserId}`).update({
          lastActive: firebase.database.ServerValue.TIMESTAMP
        });
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    });
  }

  getCurrentUser() {
    return this.user;
  }

  getAdminStatus() {
    return this.isAdmin;
  }

  unsubscribeSubscriptions() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.adminSubscription) this.adminSubscription.unsubscribe();
  }

  formatAddress(user: IUser) {
    let address = [];

    if (user) {
      if (user.city) {
        address.push(user.city);
      }

      if (user.state) {
        address.push(user.state);
      }

      if (user.country) {
        address.push(user.country);
      }
    }

    return address.join(', ');
  }
}
