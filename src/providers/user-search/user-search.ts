import { Injectable } from '@angular/core';
import { IUser } from '../../models/IUser';
import { Subject, Subscription, AsyncSubject, ReplaySubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import _ from 'lodash';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import firebase from 'firebase';

/*
  Generated class for the UserSearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserSearchProvider {
  currentLoggedInUserId = firebase.auth().currentUser.uid;
  dbPath: string = 'userData';

  private _users: IUser[] = [];
  private users: ReplaySubject<IUser[]>;
  private usersSubscription: Subscription;

  constructor(private db: AngularFireDatabase) {
    console.log('Hello UserSearchProvider Provider');
    this.users = new ReplaySubject<IUser[]>(1);

    this.initUsers();
  }

  getUsers() {
    return this.users;
  }

  filterUsers(filters: IRefineSearchFilters) {
    let users = [...this._users];



    return users;
  }

  private initUsers() {
    this.usersSubscription = this.db
      .list(this.dbPath)
      .valueChanges()
      .subscribe((users: IUser[]) => {
        this._users = _.filter(users, user => user.id !== this.currentLoggedInUserId);
        this._users = _.orderBy(this._users, ['lastActive'], ['desc']);
        this.notifyObservables();
      });
  }

  private notifyObservables() {
    this.users.next(this._users);
  }

  unsubscribeSubscriptions() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }
}
