import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { env } from '../../app/env';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { ViewedMeProvider } from '../../providers/viewed-me/viewed-me';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
import { map } from 'rxjs/operators/map';
import moment from 'moment';
import _ from 'lodash';
import { NotificationProvider } from '../../providers/notification/notification';
import { BlockProvider } from '../../providers/block/block';

/**
 * Generated class for the ViewedMePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewed-me',
  templateUrl: 'viewed-me.html'
})
export class ViewedMePage {
  defaultUserImage = env.DEFAULT.userImagePlaceholder;
  currentLoggedInUserId: string;

  users: any[] = [];
  usersSubscription: Subscription;
  isFetching = false;
  hasNoMoreToFetch: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public viewedMeProvider: ViewedMeProvider,
    public userProvider: UserProvider,
    public notificationProvider: NotificationProvider,
    private blockProvider: BlockProvider
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewedMePage');
    this.currentLoggedInUserId = firebase.auth().currentUser.uid;
    this.fetchViewedMeUsers(null);
    this.notificationProvider.clearCurrentUserViewedMeNotification();
  }

  ionViewDidLeave() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }

  fetchViewedMeUsers(infiniteScroll, concat: boolean = false, limit: number = 10) {
    return new Promise(resolve => {
      if (!concat) this.isFetching = true;

      this.usersSubscription = this.db
        .list(
          `${this.viewedMeProvider.dbPath}/${this.currentLoggedInUserId}`,
          ref => ref.limitToLast(this.users.length + limit).orderByChild('lastViewed')
        )
        .valueChanges()
        .pipe(
          map(userViewedMeData => {
            return Promise.all(
              userViewedMeData.map((data: any) => {
                return firebase
                  .database()
                  .ref(`userData/${data.userId}`)
                  .once('value')
                  .then(user => {
                    return { ...user.val(), lastViewed: data.lastViewed };
                  });
              })
            );
          })
        )
        .subscribe(userViewedMeDataPromises => {
          userViewedMeDataPromises.then(userViewedMeData => {
            const previousCount = this.users.length;

            if (concat) {
              this.users = _.uniqBy([...this.users, ...userViewedMeData.reverse()], 'id');
            } else {
              this.users = userViewedMeData.reverse();
            }

            const afterCount = this.users.length;

            this.blockProvider.filterBlockedUsers(this.users).then(users => {
              this.users = users;

              if (previousCount === afterCount) {
                this.hasNoMoreToFetch = true;
              }

              if (infiniteScroll) infiniteScroll.complete();

              this.isFetching = false;
            });

            this.usersSubscription.unsubscribe();
          });
        });
    });
  }

  navigateToProfile(user: IUser) {
    if (!user) return;
    this.navCtrl.push('ProfilePage', { userId: user.id });
  }

  fromNow(lastViewedDate: number) {
    return moment(lastViewedDate).fromNow();
  }
}
