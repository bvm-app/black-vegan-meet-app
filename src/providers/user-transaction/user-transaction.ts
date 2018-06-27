import { Injectable } from '@angular/core';
import { IPremiumOption } from '../../models/IPremiumOption';
import { IUser } from '../../models/IUser';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the UserTransactionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserTransactionProvider {

  constructor(private db: AngularFireDatabase) {
    console.log('Hello UserTransactionProvider Provider');
  }

  addTransaction(response: any, subscriptionOption: IPremiumOption, user: IUser) {

    let transaction = {
      subscriptionOption: subscriptionOption,
      userId: user.id,
      response: response
    };

    return new Promise(resolve => {
      let id = this.db.list('/userTransaction').push(transaction).key;
      this.db.object(`/userTransaction/${id}`).update({
        id: id
      });

      resolve(id);
    });
  }

}
