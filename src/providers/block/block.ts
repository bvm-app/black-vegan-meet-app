import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';

/*
  Generated class for the BlockProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BlockProvider {

  constructor(
    private db: AngularFireDatabase,
  ) {
    console.log('Hello BlockProvider Provider');
  }

  private readonly dbPath = 'blockedUserData';

  public blockUser(userId: string) {
    const currentLoggedInUserId = firebase.auth().currentUser.uid;
    this.db.object(`${this.dbPath}/${currentLoggedInUserId}/blocked/${userId}`).set(true);
    this.db.object(`${this.dbPath}/${userId}/blockedBy/${currentLoggedInUserId}`).set(true);
  }

  public unblockUser(userId: string) {
    const currentLoggedInUserId = firebase.auth().currentUser.uid;
    let blockDataToDelete = this.db.object(`${this.dbPath}/${currentLoggedInUserId}/blocked/${userId}`);
    blockDataToDelete.remove();

    blockDataToDelete = this.db.object(`${this.dbPath}/${userId}/blockedBy/${currentLoggedInUserId}`);
    blockDataToDelete.remove();
  }

  public getBlockedByUsers() {
    const currentLoggedInUserId = firebase.auth().currentUser.uid;
    return this.db.object(`${this.dbPath}/${currentLoggedInUserId}/blockedBy`)
      .valueChanges()
      .map(result => result ? Object.keys(result) : []).first().toPromise();
  }

  public filterBlockedUsers(data: any[], fieldToCompare = 'id') {
    return this.getBlockedByUsers().then(blockedByUsers => {
      return data.filter(x => blockedByUsers.indexOf(x[fieldToCompare]) < 0);
    });
  }

  public checkIfBlocked(userId: string) {
    const currentLoggedInUserId = firebase.auth().currentUser.uid;
    return this.db.object(`${this.dbPath}/${currentLoggedInUserId}/blocked/${userId}`)
      .valueChanges()
      .map(result => <boolean>result);
  }
}
