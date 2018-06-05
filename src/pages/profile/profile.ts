import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import moment from 'moment';
import firebase from 'firebase';
import { ViewedMeProvider } from '../../providers/viewed-me/viewed-me';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  defaultUserImagePlaceholder = env.DEFAULT.userImagePlaceholder;
  currentLoggedInUserId = firebase.auth().currentUser.uid;

  isCurrentLoggedInUser: boolean = true;
  user: IUser;
  userSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public userProvider: UserProvider,
    public viewedMeProvider: ViewedMeProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    let userId = firebase.auth().currentUser.uid;
    if (this.navParams.data.userId) {
      userId = this.navParams.data.userId;
      this.isCurrentLoggedInUser = this.currentLoggedInUserId === userId;
    }

    this.userSubscription = this.db
      .object(`userData/${userId}`)
      .valueChanges()
      .subscribe((user: IUser) => {
        this.user = user;

        if (!this.user.preferences) {
          this.user.preferences = {};
        }
      });

    // Update userViewedMeData of this user
    if (!this.isCurrentLoggedInUser) {
      this.viewedMeProvider.updateCurrentUserViewedMe(userId);
    }
  }

  ionViewDidLeave() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  calculateAge(birthdate: string) {
    if (!birthdate) return '';
    return moment().diff(birthdate, 'years');
  }

  formatAddress() {
    return this.userProvider.formatAddress(this.user);
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
