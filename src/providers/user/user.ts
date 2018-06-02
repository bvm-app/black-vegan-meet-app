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
  private currentLoggedInUserId: string = firebase.auth().currentUser.uid;
  private isAdmin: boolean = false;
  private user: IUser;
  private userSubscription: Subscription;
  private adminSubscription: Subscription;


  constructor(public db: AngularFireDatabase) {
    console.log('Hello UserProvider Provider');

    this.initCurrentUser();
    this.initAdminStatus();
  }

  private initCurrentUser() {
    this.userSubscription = this.db
      .object(`userData/${this.currentLoggedInUserId}`)
      .valueChanges()
      .subscribe((user: IUser) => {
        this.user = user;
      });
  }

  private initAdminStatus() {
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
}
